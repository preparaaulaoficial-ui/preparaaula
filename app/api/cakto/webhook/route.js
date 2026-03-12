import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Mapeamento: nome do produto na Cakto → slug do plano no sistema
// Preencha com os nomes EXATOS dos produtos que você criou no painel da Cakto
const PRODUTO_PARA_PLANO = {
  'PreparaAula Starter':      'starter',
  'PreparaAula Profissional': 'profissional',
  'PreparaAula Escola':       'escola',
}

// Identifica o plano pelo nome do produto recebido no webhook
function identificarPlano(nomeProduto = '') {
  for (const [chave, plano] of Object.entries(PRODUTO_PARA_PLANO)) {
    if (nomeProduto.toLowerCase().includes(chave.toLowerCase())) return plano
  }
  // Fallback: tenta detectar pelo nome
  if (nomeProduto.toLowerCase().includes('escola'))       return 'escola'
  if (nomeProduto.toLowerCase().includes('profissional')) return 'profissional'
  if (nomeProduto.toLowerCase().includes('starter'))      return 'starter'
  return null
}

export async function POST(request) {
  try {
    const body = await request.text()

    // ── Verifica assinatura HMAC da Cakto (se configurada) ──────────────────
    const secret = process.env.CAKTO_WEBHOOK_SECRET
    if (secret) {
      const signature = request.headers.get('x-cakto-signature') ||
                        request.headers.get('x-webhook-signature') ||
                        request.headers.get('x-signature')
      if (signature) {
        const esperado = crypto
          .createHmac('sha256', secret)
          .update(body)
          .digest('hex')
        if (signature !== esperado && signature !== `sha256=${esperado}`) {
          console.warn('Webhook Cakto: assinatura inválida')
          return new Response('Assinatura inválida', { status: 401 })
        }
      }
    }

    const evento = JSON.parse(body)
    console.log('Webhook Cakto recebido:', evento?.event || evento?.type, JSON.stringify(evento).slice(0, 300))

    // ── Extrai os campos do payload da Cakto ──────────────────────────────────
    // A Cakto envia os webhooks com os dados do pedido diretamente
    const tipo   = evento?.event || evento?.type || ''
    const pedido = evento?.data  || evento?.order || evento

    const emailCliente  = pedido?.customer?.email   || pedido?.email
    const nomeProduto   = pedido?.product?.name     || pedido?.productName || ''
    const statusPedido  = pedido?.status            || ''
    const idPedido      = pedido?.id                || pedido?.refId       || ''
    const tipoProduto   = pedido?.type              || pedido?.product?.type || ''  // unique | subscription

    if (!emailCliente) {
      console.warn('Webhook Cakto: email do cliente não encontrado no payload')
      return Response.json({ recebido: true, aviso: 'email não encontrado' })
    }

    // Busca o usuário pelo email
    const { data: usuario } = await supabase
      .from('profiles')
      .select('id, plano, plano_ativo')
      .eq('email', emailCliente)
      .maybeSingle()

    // Se não achou pelo email na tabela profiles, tenta pelo auth
    let userId = usuario?.id
    if (!userId) {
      const { data: authUser } = await supabase.auth.admin.listUsers()
      const found = authUser?.users?.find(u => u.email === emailCliente)
      userId = found?.id
    }

    if (!userId) {
      console.warn(`Webhook Cakto: usuário não encontrado para email ${emailCliente}`)
      // Retorna 200 para a Cakto não ficar reenviando
      return Response.json({ recebido: true, aviso: 'usuário não encontrado' })
    }

    const plano = identificarPlano(nomeProduto)

    // ── Processa por tipo de evento ───────────────────────────────────────────

    // Compra aprovada / assinatura ativa
    const eventosAprovados = ['purchase_approved', 'purchase.approved', 'subscription_activated', 'subscription.activated', 'paid', 'approved']
    const isAprovado = eventosAprovados.some(e => tipo.toLowerCase().includes(e.toLowerCase())) ||
                       statusPedido === 'paid'

    if (isAprovado && plano) {
      await supabase.from('profiles').update({
        plano,
        plano_ativo:              true,
        cakto_pedido_id:          idPedido,
        cakto_produto_nome:       nomeProduto,
        stripe_subscription_status: 'active',
      }).eq('id', userId)

      console.log(`✅ Plano ${plano} ativado para ${emailCliente}`)
      return Response.json({ recebido: true, acao: 'plano_ativado', plano })
    }

    // Reembolso / cancelamento / chargeback
    const eventosCancelados = ['purchase_refunded', 'purchase.refunded', 'subscription_canceled', 'subscription.canceled', 'subscription_cancelled', 'refunded', 'canceled', 'chargedback', 'chargeback']
    const isCancelado = eventosCancelados.some(e => tipo.toLowerCase().includes(e.toLowerCase())) ||
                        ['refunded', 'canceled', 'chargedback'].includes(statusPedido)

    if (isCancelado) {
      await supabase.from('profiles').update({
        plano:                    'starter',
        plano_ativo:              false,
        stripe_subscription_status: 'canceled',
      }).eq('id', userId)

      console.log(`❌ Plano cancelado para ${emailCliente}`)
      return Response.json({ recebido: true, acao: 'plano_cancelado' })
    }

    // Renovação de assinatura (cobrança recorrente aprovada)
    const eventosRenovacao = ['subscription_renewal', 'subscription.renewal', 'recurring_payment', 'renewal']
    const isRenovacao = eventosRenovacao.some(e => tipo.toLowerCase().includes(e.toLowerCase()))

    if (isRenovacao && plano) {
      await supabase.from('profiles').update({
        plano,
        plano_ativo:              true,
        stripe_subscription_status: 'active',
      }).eq('id', userId)

      console.log(`🔄 Assinatura renovada (${plano}) para ${emailCliente}`)
      return Response.json({ recebido: true, acao: 'renovacao' })
    }

    // Falha no pagamento
    const eventosFalha = ['purchase_refused', 'purchase.refused', 'payment_failed', 'refused']
    const isFalha = eventosFalha.some(e => tipo.toLowerCase().includes(e.toLowerCase())) ||
                    statusPedido === 'refused'

    if (isFalha) {
      await supabase.from('profiles').update({
        stripe_subscription_status: 'past_due',
      }).eq('id', userId)

      console.log(`⚠️ Pagamento recusado para ${emailCliente}`)
      return Response.json({ recebido: true, acao: 'pagamento_recusado' })
    }

    // Evento desconhecido — apenas loga e confirma recebimento
    console.log(`ℹ️ Evento Cakto não mapeado: tipo="${tipo}" status="${statusPedido}"`)
    return Response.json({ recebido: true, acao: 'ignorado', tipo, statusPedido })

  } catch (erro) {
    console.error('Erro no webhook Cakto:', erro)
    // Retorna 200 mesmo com erro para evitar reenvios em loop
    return Response.json({ recebido: true, erro: erro.message }, { status: 200 })
  }
}