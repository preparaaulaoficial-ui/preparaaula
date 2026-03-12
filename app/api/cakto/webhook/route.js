import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const PRODUTO_PARA_PLANO = {
  'PreparaAula Starter':      'starter',
  'PreparaAula Profissional': 'profissional',
  'PreparaAula Escola':       'escola',
}

function identificarPlano(nomeProduto = '') {
  for (const [chave, plano] of Object.entries(PRODUTO_PARA_PLANO)) {
    if (nomeProduto.toLowerCase().includes(chave.toLowerCase())) return plano
  }
  if (nomeProduto.toLowerCase().includes('escola'))       return 'escola'
  if (nomeProduto.toLowerCase().includes('profissional')) return 'profissional'
  if (nomeProduto.toLowerCase().includes('starter'))      return 'starter'
  return 'starter'
}

// Gera uma senha aleatória segura para o novo usuário
function gerarSenhaTemporaria() {
  return crypto.randomBytes(12).toString('base64').slice(0, 16) + '@1'
}

export async function POST(request) {
  try {
    const body = await request.text()

    // ── Verifica assinatura ───────────────────────────────────────────────────
    const secret = process.env.CAKTO_WEBHOOK_SECRET
    if (secret) {
      const signature = request.headers.get('x-cakto-signature') ||
                        request.headers.get('x-webhook-signature') ||
                        request.headers.get('x-signature')
      if (signature) {
        const esperado = crypto.createHmac('sha256', secret).update(body).digest('hex')
        if (signature !== esperado && signature !== `sha256=${esperado}`) {
          console.warn('Webhook Cakto: assinatura inválida')
          return new Response('Assinatura inválida', { status: 401 })
        }
      }
    }

    const evento = JSON.parse(body)
    console.log('Webhook Cakto:', evento?.event || evento?.type, JSON.stringify(evento).slice(0, 300))

    const tipo  = evento?.event || evento?.type || ''
    const pedido = evento?.data || evento?.order || evento

    const emailCliente = pedido?.customer?.email || pedido?.email
    const nomeCliente  = pedido?.customer?.name  || pedido?.name || 'Professor'
    const nomeProduto  = pedido?.product?.name   || pedido?.productName || ''
    const statusPedido = pedido?.status || ''
    const idPedido     = pedido?.id     || pedido?.refId || ''

    if (!emailCliente) {
      console.warn('Webhook Cakto: email não encontrado no payload')
      return Response.json({ recebido: true, aviso: 'email não encontrado' })
    }

    const plano = identificarPlano(nomeProduto)

    // ── Eventos de pagamento aprovado ─────────────────────────────────────────
    const isAprovado =
      ['purchase_approved', 'purchase.approved', 'subscription_activated',
       'subscription.activated', 'paid', 'approved']
      .some(e => tipo.toLowerCase().includes(e)) || statusPedido === 'paid'

    if (isAprovado) {
      // 1. Verifica se já existe no auth
      const { data: listaUsers } = await supabase.auth.admin.listUsers()
      const userExistente = listaUsers?.users?.find(u => u.email === emailCliente)

      let userId

      if (userExistente) {
        // Usuário já existe — só atualiza o plano
        userId = userExistente.id
        console.log(`Usuário existente encontrado: ${emailCliente}`)
      } else {
        // Usuário novo — cria a conta automaticamente
        const senhaTemp = gerarSenhaTemporaria()

        const { data: novoUser, error: erroAuth } = await supabase.auth.admin.createUser({
          email: emailCliente,
          password: senhaTemp,
          email_confirm: true, // confirma o email automaticamente
          user_metadata: { nome: nomeCliente }
        })

        if (erroAuth) {
          console.error('Erro ao criar usuário:', erroAuth)
          return Response.json({ recebido: true, erro: 'falha ao criar usuário' })
        }

        userId = novoUser.user.id
        console.log(`✅ Novo usuário criado: ${emailCliente}`)

        // Cria o perfil na tabela profiles
        await supabase.from('profiles').insert({
          id:     userId,
          email:  emailCliente,
          nome:   nomeCliente,
          plano:  plano,
          plano_ativo: true,
          aulas_mes: 0,
          ultimo_reset_mes: new Date().toISOString().slice(0, 7),
          cakto_pedido_id:    idPedido,
          cakto_produto_nome: nomeProduto,
          stripe_subscription_status: 'active',
        })

        // Envia o magic link por email para o usuário definir a senha
        await supabase.auth.admin.generateLink({
          type: 'magiclink',
          email: emailCliente,
          options: {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
          }
        })

        console.log(`📧 Magic link enviado para: ${emailCliente}`)
        return Response.json({ recebido: true, acao: 'conta_criada', plano })
      }

      // Atualiza plano do usuário existente
      await supabase.from('profiles').upsert({
        id:    userId,
        email: emailCliente,
        nome:  nomeCliente,
        plano: plano,
        plano_ativo: true,
        cakto_pedido_id:    idPedido,
        cakto_produto_nome: nomeProduto,
        stripe_subscription_status: 'active',
      }, { onConflict: 'id' })

      console.log(`✅ Plano ${plano} ativado para ${emailCliente}`)
      return Response.json({ recebido: true, acao: 'plano_ativado', plano })
    }

    // ── Cancelamento / reembolso ──────────────────────────────────────────────
    const isCancelado =
      ['purchase_refunded', 'purchase.refunded', 'subscription_canceled',
       'subscription.canceled', 'refunded', 'canceled', 'chargedback']
      .some(e => tipo.toLowerCase().includes(e)) ||
      ['refunded', 'canceled', 'chargedback'].includes(statusPedido)

    if (isCancelado) {
      const { data: listaUsers } = await supabase.auth.admin.listUsers()
      const user = listaUsers?.users?.find(u => u.email === emailCliente)
      if (user) {
        await supabase.from('profiles').update({
          plano: 'starter',
          plano_ativo: false,
          stripe_subscription_status: 'canceled',
        }).eq('id', user.id)
        console.log(`❌ Plano cancelado para ${emailCliente}`)
      }
      return Response.json({ recebido: true, acao: 'plano_cancelado' })
    }

    // ── Renovação ─────────────────────────────────────────────────────────────
    const isRenovacao =
      ['subscription_renewal', 'subscription.renewal', 'renewal']
      .some(e => tipo.toLowerCase().includes(e))

    if (isRenovacao) {
      const { data: listaUsers } = await supabase.auth.admin.listUsers()
      const user = listaUsers?.users?.find(u => u.email === emailCliente)
      if (user) {
        await supabase.from('profiles').update({
          plano, plano_ativo: true,
          stripe_subscription_status: 'active',
        }).eq('id', user.id)
        console.log(`🔄 Renovação ${plano} para ${emailCliente}`)
      }
      return Response.json({ recebido: true, acao: 'renovacao' })
    }

    console.log(`ℹ️ Evento não mapeado: tipo="${tipo}" status="${statusPedido}"`)
    return Response.json({ recebido: true, acao: 'ignorado' })

  } catch (erro) {
    console.error('Erro no webhook:', erro)
    return Response.json({ recebido: true, erro: erro.message }, { status: 200 })
  }
}