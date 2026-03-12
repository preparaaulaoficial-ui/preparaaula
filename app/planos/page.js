'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'

// ── Links de checkout gerados no painel da Cakto ──────────────────────────────
// Painel Cakto → Produtos → [produto] → Copiar link de checkout
const CHECKOUT_LINKS = {
  starter:      process.env.NEXT_PUBLIC_CAKTO_LINK_STARTER,
  profissional: process.env.NEXT_PUBLIC_CAKTO_LINK_PROFISSIONAL,
  escola:       process.env.NEXT_PUBLIC_CAKTO_LINK_ESCOLA,
}

// ─── Tabela de preços e limites (espelhar com LIMITES_PLANO no route.js) ──────
// Starter  R$57  → 20 aulas → custo API ~R$15 → margem ~72%
// Pro      R$97  → 35 aulas → custo API ~R$26 → margem ~72%
// Escola   R$197 → 60 aulas → custo API ~R$45 → margem ~74%

const PLANOS = [
  {
    id: 'starter',
    nome: 'Starter',
    preco: 'R$ 57',
    periodo: '/mês',
    descricao: 'Para começar a usar IA nas suas aulas',
    cor: '#475569',
    badge_economia: 'Menos de R$3 por aula',
    recursos: [
      '20 aulas completas por mês',
      'Até 20 slides por aula',
      'Estrutura pedagógica automática',
      'Plano de aula alinhado à BNCC',
      '5 exercícios com gabarito',
      'Exportação PowerPoint',
      'Suporte por e-mail',
    ],
    nao_inclui: ['Edição de slides', '6 paletas de cores'],
  },
  {
    id: 'profissional',
    nome: 'Profissional',
    preco: 'R$ 97',
    periodo: '/mês',
    descricao: 'Para professores que usam IA todo dia',
    cor: '#1a56db',
    destaque: true,
    badge_economia: 'Menos de R$3 por aula',
    recursos: [
      '35 aulas completas por mês',
      'Até 20 slides por aula',
      'Estrutura pedagógica automática',
      'Plano de aula alinhado à BNCC',
      '5 exercícios com gabarito',
      'Exportação PowerPoint',
      'Edição de slides ✓',
      'Suporte prioritário',
    ],
    nao_inclui: ['6 paletas de cores'],
  },
  {
    id: 'escola',
    nome: 'Escola',
    preco: 'R$ 197',
    periodo: '/mês',
    descricao: 'Para escolas e coordenadores pedagógicos',
    cor: '#7c3aed',
    badge_economia: '60 aulas — menos de R$4 cada',
    recursos: [
      '60 aulas completas por mês',
      'Até 20 slides por aula',
      'Estrutura pedagógica automática',
      'Plano de aula alinhado à BNCC',
      '5 exercícios com gabarito',
      'Exportação PowerPoint',
      'Edição de slides ✓',
      '6 paletas de cores ✓',
      'Suporte via WhatsApp',
    ],
    nao_inclui: [],
  },
]

export default function PlanosPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [planoAtual, setPlanoAtual]   = useState('starter')
  const [planoAtivo, setPlanoAtivo]   = useState(false)
  const [loading, setLoading]         = useState(true)
  const [userEmail, setUserEmail]     = useState('')

  const sucesso   = searchParams.get('sucesso')
  const planoNovo = searchParams.get('plano')
  const cancelado = searchParams.get('cancelado')

  useEffect(() => { carregar() }, [])

  async function carregar() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    setUserEmail(user.email)

    const { data: perfil } = await supabase
      .from('profiles').select('plano, plano_ativo').eq('id', user.id).single()

    setPlanoAtual(perfil?.plano || 'starter')
    setPlanoAtivo(perfil?.plano_ativo || false)
    setLoading(false)
  }

  function irParaCheckout(planoId) {
    const link = CHECKOUT_LINKS[planoId]
    if (!link) {
      alert('Link de pagamento não configurado. Configure NEXT_PUBLIC_CAKTO_LINK_' + planoId.toUpperCase() + ' no .env.local')
      return
    }
    // Passa o email do usuário como parâmetro para pré-preencher o checkout da Cakto
    const url = userEmail ? `${link}?email=${encodeURIComponent(userEmail)}` : link
    window.open(url, '_blank')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'sans-serif', fontSize: 14 }}>Carregando...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* HEADER */}
      <header style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg,#1a56db,#0891b2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>📚</div>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#0f2b5b', letterSpacing: '-0.02em' }}>
            Prepara<span style={{ color: '#1a56db' }}>Aula</span>
          </span>
        </div>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: '1px solid #e2e8f0', color: '#64748b', padding: '7px 16px', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
          ← Voltar ao dashboard
        </button>
      </header>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px' }}>

        {/* Alertas de status */}
        {sucesso && (
          <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 12, padding: '16px 20px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 22 }}>🎉</span>
            <div>
              <div style={{ fontWeight: 700, color: '#166534', fontSize: 15 }}>Obrigado! Seu pagamento foi recebido.</div>
              <div style={{ fontSize: 13, color: '#166534', opacity: 0.85, marginTop: 2 }}>
                Seu plano será ativado em alguns instantes. Se não atualizar em até 5 minutos, entre em contato com o suporte.
              </div>
            </div>
          </div>
        )}
        {cancelado && (
          <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 12, padding: '14px 18px', marginBottom: 28 }}>
            <div style={{ fontWeight: 600, color: '#9a3412', fontSize: 14 }}>Pagamento cancelado — nenhuma cobrança foi realizada.</div>
          </div>
        )}

        {/* Título */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0f2b5b', letterSpacing: '-0.03em', margin: '0 0 10px' }}>
            Escolha seu plano
          </h1>
          <p style={{ color: '#64748b', fontSize: 15, margin: '0 0 14px' }}>
            Crie aulas completas com IA em minutos · PIX, cartão ou boleto · Cancele quando quiser
          </p>

          {planoAtivo && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 100, padding: '6px 16px' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#1a56db' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1e40af' }}>
                Plano ativo: {planoAtual.charAt(0).toUpperCase() + planoAtual.slice(1)}
              </span>
            </div>
          )}
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, alignItems: 'start' }}>
          {PLANOS.map(plano => {
            const ehAtual = planoAtual === plano.id && planoAtivo

            return (
              <div key={plano.id} style={{
                background: 'white',
                borderRadius: 16,
                padding: '28px 24px',
                border: ehAtual
                  ? `2px solid ${plano.cor}`
                  : plano.destaque
                    ? `2px solid ${plano.cor}`
                    : '1px solid #e2e8f0',
                position: 'relative',
                boxShadow: plano.destaque ? `0 8px 32px ${plano.cor}18` : 'none',
                display: 'flex',
                flexDirection: 'column',
              }}>

                {/* Badge */}
                {plano.destaque && !ehAtual && (
                  <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: plano.cor, color: 'white', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 100, whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>
                    ⭐ MAIS POPULAR
                  </div>
                )}
                {ehAtual && (
                  <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: '#059669', color: 'white', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 100, whiteSpace: 'nowrap' }}>
                    ✓ SEU PLANO ATUAL
                  </div>
                )}

                {/* Cabeçalho */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 3 }}>{plano.nome}</div>
                  <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>{plano.descricao}</div>
                  {plano.badge_economia && (
                    <div style={{ display: 'inline-block', marginTop: 8, background: `${plano.cor}12`, border: `1px solid ${plano.cor}30`, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 700, color: plano.cor }}>
                      💰 {plano.badge_economia}
                    </div>
                  )}
                </div>

                {/* Preço */}
                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontSize: 36, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em' }}>{plano.preco}</span>
                  <span style={{ fontSize: 14, color: '#94a3b8' }}>{plano.periodo}</span>
                </div>

                {/* CTA */}
                <button
                  onClick={() => irParaCheckout(plano.id)}
                  style={{
                    width: '100%', padding: '12px 0',
                    borderRadius: 10,
                    background: ehAtual ? '#f1f5f9' : plano.cor,
                    color: ehAtual ? '#475569' : 'white',
                    border: 'none', fontSize: 14, fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'inherit',
                    marginBottom: 20,
                    boxShadow: ehAtual ? 'none' : `0 4px 14px ${plano.cor}30`,
                    transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={e => e.target.style.opacity = '0.9'}
                  onMouseLeave={e => e.target.style.opacity = '1'}
                >
                  {ehAtual ? '✓ Plano atual' : `Assinar ${plano.nome} →`}
                </button>

                {/* Lista de recursos */}
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Inclui</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {plano.recursos.map((r, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <div style={{ width: 16, height: 16, borderRadius: '50%', background: `${plano.cor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                          <span style={{ fontSize: 9, color: plano.cor, fontWeight: 700 }}>✓</span>
                        </div>
                        <span style={{ fontSize: 12.5, color: '#374151', lineHeight: 1.4 }}>{r}</span>
                      </div>
                    ))}
                    {plano.nao_inclui.map((r, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, opacity: 0.3 }}>
                        <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                          <span style={{ fontSize: 9, color: '#94a3b8' }}>✕</span>
                        </div>
                        <span style={{ fontSize: 12.5, color: '#94a3b8', lineHeight: 1.4 }}>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Métodos de pagamento */}
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            {['PIX', 'Cartão', 'Boleto'].map(m => (
              <div key={m} style={{ padding: '5px 12px', background: 'white', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 12, fontWeight: 600, color: '#475569' }}>
                {m}
              </div>
            ))}
          </div>
          <p style={{ color: '#94a3b8', fontSize: 13, margin: 0 }}>
            Pagamento 100% seguro via Cakto · Cancele quando quiser · Sem fidelidade
          </p>
        </div>

        {/* FAQ rápido */}
        <div style={{ marginTop: 48, maxWidth: 600, margin: '48px auto 0' }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f2b5b', marginBottom: 20, textAlign: 'center' }}>Dúvidas frequentes</h2>
          {[
            { p: 'Como funciona o pagamento?', r: 'Você é redirecionado para o checkout seguro da Cakto. Aceita PIX (sem taxa extra), cartão de crédito e boleto. Após o pagamento, seu acesso é liberado automaticamente em minutos.' },
            { p: 'Posso cancelar quando quiser?', r: 'Sim. Basta entrar em contato pelo email suporte@preparaaula.com.br antes da próxima cobrança. Sem burocracia e sem multa.' },
            { p: 'O plano renova automaticamente?', r: 'Sim, é uma assinatura mensal recorrente. O limite de aulas reseta todo mês. Você pode cancelar a qualquer momento.' },
            { p: 'Posso mudar de plano?', r: 'Sim. Cancele o plano atual e assine o novo. O acesso é atualizado automaticamente assim que o pagamento for confirmado.' },
            { p: 'O que acontece se eu atingir o limite de aulas?', r: 'Você recebe uma mensagem avisando e pode fazer upgrade para um plano com mais aulas. O limite reseta no primeiro dia do mês seguinte.' },
          ].map((faq, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 10, padding: '16px 18px', marginBottom: 10, border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 14, marginBottom: 6 }}>{faq.p}</div>
              <div style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6 }}>{faq.r}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}