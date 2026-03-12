'use client'
import { useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginConteudo() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail]     = useState('')
  const [senha, setSenha]     = useState('')
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro]       = useState('')
  const [modo, setModo]       = useState('senha')
  const [mostrarSenha, setMostrarSenha] = useState(false)

  const msgParam = searchParams.get('msg')

  async function handleLoginSenha(e) {
    e.preventDefault()
    setLoading(true)
    setErro('')

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: senha,
    })

    if (error) {
      setErro(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  async function handleMagicLink(e) {
    e.preventDefault()
    setLoading(true)
    setErro('')

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: `${window.location.origin}/dashboard` }
    })

    if (error) {
      setErro('Erro ao enviar o link. Tente novamente em alguns minutos.')
      setLoading(false)
      return
    }

    setEnviado(true)
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px',
    border: '1.5px solid #e2e8f0', borderRadius: 10,
    fontSize: 14, fontFamily: 'inherit', color: '#0f172a',
    outline: 'none', boxSizing: 'border-box', background: 'white',
  }

  const labelStyle = {
    display: 'block', fontSize: 12, fontWeight: 700,
    color: '#374151', marginBottom: 6, letterSpacing: '0.03em',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Plus Jakarta Sans', sans-serif", padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#1a56db,#0891b2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📚</div>
            <span style={{ fontSize: 22, fontWeight: 900, color: 'white', letterSpacing: '-0.03em' }}>
              Prepara<span style={{ color: '#60a5fa' }}>Aula</span>
            </span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: 0 }}>Sua aula pronta em minutos</p>
        </div>

        {/* Card */}
        <div style={{ background: 'white', borderRadius: 20, padding: '36px 32px', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>

          {msgParam === 'sem-acesso' && (
            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#9a3412' }}>
              ⚠️ Você precisa ter um plano ativo para acessar o PreparaAula.
            </div>
          )}

          {!enviado ? (
            <>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                Entrar no PreparaAula
              </h1>
              <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 24px' }}>
                Acesse sua conta para criar aulas com IA.
              </p>

              {/* Tabs */}
              <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 10, padding: 4, marginBottom: 24 }}>
                {[{ id: 'senha', label: '🔑 Email e senha' }, { id: 'magiclink', label: '✉️ Link por email' }].map(tab => (
                  <button key={tab.id} onClick={() => { setModo(tab.id); setErro('') }}
                    style={{
                      flex: 1, padding: '8px 0', border: 'none', borderRadius: 8,
                      fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                      background: modo === tab.id ? 'white' : 'transparent',
                      color: modo === tab.id ? '#0f172a' : '#94a3b8',
                      boxShadow: modo === tab.id ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                    }}>{tab.label}</button>
                ))}
              </div>

              {/* Formulário senha */}
              {modo === 'senha' && (
                <form onSubmit={handleLoginSenha}>
                  <div style={{ marginBottom: 14 }}>
                    <label style={labelStyle}>EMAIL</label>
                    <input type="email" value={email} required onChange={e => setEmail(e.target.value)}
                      placeholder="seuemail@gmail.com" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#1a56db'}
                      onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>SENHA</label>
                    <div style={{ position: 'relative' }}>
                      <input type={mostrarSenha ? 'text' : 'password'} value={senha} required
                        onChange={e => setSenha(e.target.value)} placeholder="Sua senha"
                        style={{ ...inputStyle, paddingRight: 44 }}
                        onFocus={e => e.target.style.borderColor = '#1a56db'}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                      <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)}
                        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#94a3b8' }}>
                        {mostrarSenha ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>

                  {erro && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#dc2626' }}>{erro}</div>}

                  <button type="submit" disabled={loading} style={{
                    width: '100%', padding: '13px 0',
                    background: loading ? '#94a3b8' : 'linear-gradient(135deg, #1a56db, #0891b2)',
                    color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                    boxShadow: loading ? 'none' : '0 4px 14px rgba(26,86,219,0.35)',
                  }}>{loading ? 'Entrando...' : 'Entrar →'}</button>

                  <button type="button" onClick={() => setModo('magiclink')}
                    style={{ display: 'block', width: '100%', marginTop: 12, background: 'none', border: 'none', color: '#64748b', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                    Esqueceu a senha? Receba um link por email
                  </button>
                </form>
              )}

              {/* Formulário magic link */}
              {modo === 'magiclink' && (
                <form onSubmit={handleMagicLink}>
                  <div style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>EMAIL</label>
                    <input type="email" value={email} required onChange={e => setEmail(e.target.value)}
                      placeholder="seuemail@gmail.com" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#1a56db'}
                      onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                  </div>

                  {erro && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#dc2626' }}>{erro}</div>}

                  <button type="submit" disabled={loading} style={{
                    width: '100%', padding: '13px 0',
                    background: loading ? '#94a3b8' : 'linear-gradient(135deg, #1a56db, #0891b2)',
                    color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                    boxShadow: loading ? 'none' : '0 4px 14px rgba(26,86,219,0.35)',
                  }}>{loading ? 'Enviando...' : 'Enviar link de acesso →'}</button>
                </form>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
                <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                <span style={{ fontSize: 12, color: '#94a3b8' }}>ainda não tem acesso?</span>
                <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
              </div>

              <a href="/planos" style={{
                display: 'block', textAlign: 'center', padding: '12px 0', borderRadius: 10,
                border: '1.5px solid #1a56db', color: '#1a56db', fontSize: 14, fontWeight: 700, textDecoration: 'none',
              }}>Ver planos e assinar →</a>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>Link enviado!</h2>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, margin: '0 0 20px' }}>
                Enviamos um link para<br /><strong style={{ color: '#0f172a' }}>{email}</strong><br />
                Clique no link para entrar — expira em 1 hora.
              </p>
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#475569' }}>
                💡 Não recebeu? Verifique o spam ou{' '}
                <button onClick={() => setEnviado(false)}
                  style={{ background: 'none', border: 'none', color: '#1a56db', fontWeight: 700, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', padding: 0 }}>
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