'use client'
import { useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginConteudo() {
  const router      = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [enviado, setEnviado]   = useState(false)
  const [erro, setErro]         = useState('')

  const msgParam = searchParams.get('msg')

  async function handleLogin(e) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setErro('')

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      }
    })

    if (error) {
      setErro('Erro ao enviar o link. Verifique o email e tente novamente.')
      setLoading(false)
      return
    }

    setEnviado(true)
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#1a56db,#0891b2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📚</div>
            <span style={{ fontSize: 22, fontWeight: 900, color: 'white', letterSpacing: '-0.03em' }}>
              Prepara<span style={{ color: '#60a5fa' }}>Aula</span>
            </span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: 0 }}>
            Sua aula pronta em minutos
          </p>
        </div>

        {/* Card */}
        <div style={{ background: 'white', borderRadius: 20, padding: '36px 32px', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>

          {/* Alerta de contexto */}
          {msgParam === 'acesso-negado' && (
            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#9a3412' }}>
              ⚠️ Faça login para acessar o PreparaAula.
            </div>
          )}

          {!enviado ? (
            <>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                Entrar no PreparaAula
              </h1>
              <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 24px', lineHeight: 1.5 }}>
                Digite seu email e enviaremos um link de acesso. Não precisa de senha.
              </p>

              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, letterSpacing: '0.03em' }}>
                    EMAIL
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="seuemail@gmail.com"
                    required
                    style={{
                      width: '100%', padding: '12px 14px',
                      border: '1.5px solid #e2e8f0', borderRadius: 10,
                      fontSize: 14, fontFamily: 'inherit', color: '#0f172a',
                      outline: 'none', boxSizing: 'border-box',
                      transition: 'border-color 0.15s',
                    }}
                    onFocus={e => e.target.style.borderColor = '#1a56db'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>

                {erro && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#dc2626' }}>
                    {erro}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%', padding: '13px 0',
                    background: loading ? '#94a3b8' : 'linear-gradient(135deg, #1a56db, #0891b2)',
                    color: 'white', border: 'none', borderRadius: 10,
                    fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit', letterSpacing: '-0.01em',
                    boxShadow: loading ? 'none' : '0 4px 14px rgba(26,86,219,0.35)',
                  }}
                >
                  {loading ? 'Enviando...' : 'Enviar link de acesso →'}
                </button>
              </form>

              {/* Separador */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
                <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                <span style={{ fontSize: 12, color: '#94a3b8' }}>ainda não tem acesso?</span>
                <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
              </div>

              <a
                href="/planos"
                style={{
                  display: 'block', textAlign: 'center',
                  padding: '12px 0', borderRadius: 10,
                  border: '1.5px solid #1a56db', color: '#1a56db',
                  fontSize: 14, fontWeight: 700, textDecoration: 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.target.style.background = '#eff6ff'}
                onMouseLeave={e => e.target.style.background = 'transparent'}
              >
                Ver planos e assinar →
              </a>
            </>
          ) : (
            /* ── Estado: email enviado ── */
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>
                Link enviado!
              </h2>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, margin: '0 0 20px' }}>
                Enviamos um link de acesso para<br />
                <strong style={{ color: '#0f172a' }}>{email}</strong><br />
                Clique no link para entrar — ele expira em 1 hora.
              </p>
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#475569' }}>
                💡 Não recebeu? Verifique a pasta de spam ou{' '}
                <button
                  onClick={() => { setEnviado(false); setEmail('') }}
                  style={{ background: 'none', border: 'none', color: '#1a56db', fontWeight: 700, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', padding: 0 }}
                >
                  tente novamente
                </button>
              </div>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
          © 2026 PreparaAula · Todos os direitos reservados
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'sans-serif' }}>Carregando...</p>
      </div>
    }>
      <LoginConteudo />
    </Suspense>
  )
}