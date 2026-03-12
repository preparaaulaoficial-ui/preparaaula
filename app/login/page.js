'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]     = useState('')
  const [senha, setSenha]     = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro]       = useState('')
  const [sucesso, setSucesso] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setErro('')
    setSucesso('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })

    if (error) {
      setErro('E-mail ou senha incorretos. Verifique seus dados e tente novamente.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  async function handleEsqueciSenha() {
    if (!email) {
      setErro('Digite seu e-mail acima antes de solicitar a recuperação.')
      return
    }
    setErro('')
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/definir-senha`,
    })

    setLoading(false)

    if (error) {
      setErro('Erro ao enviar e-mail. Verifique o endereço e tente novamente.')
      return
    }

    setSucesso('E-mail de recuperação enviado! Verifique sua caixa de entrada.')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#152664',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Mulish', sans-serif",
      padding: 24,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Mulish:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;}
        input{font-family:'Mulish',sans-serif!important;}
      `}</style>

      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 42, height: 42,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.15)',
            }}>
              <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                <path d="M20 3C14 5 10 11 7 16C6 18 5 21 5 21C7 19 9 18 11 17.5C11 17.5 10 14 14 10C17 7 20 3 20 3Z" fill="#f4e3d0"/>
                <path d="M5 21C5.5 20 6.5 19.2 7.5 18.8" stroke="#f4e3d0" strokeWidth="1.3" strokeLinecap="round"/>
                <path d="M3.5 22.5C4.5 22 5.8 21.4 7 21" stroke="#f4e3d0" strokeWidth="1" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 22, color: '#f4e3d0',
              letterSpacing: '-0.02em',
            }}>Prepara Aula</span>
          </a>
        </div>

        {/* Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: 20,
          padding: '40px 36px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.3)',
        }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 26, fontWeight: 700,
            color: '#152664', margin: '0 0 6px',
            letterSpacing: '-0.03em',
          }}>
            Entrar na conta
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(13,13,13,0.45)', margin: '0 0 28px', fontWeight: 300 }}>
            Acesse o dashboard e crie suas aulas.
          </p>

          <form onSubmit={handleLogin}>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block', fontSize: 11, fontWeight: 700,
                color: '#374151', marginBottom: 7, letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                style={{
                  width: '100%', padding: '13px 16px',
                  border: '1.5px solid #e5e7eb', borderRadius: 10,
                  fontSize: 14, color: '#0d0d0d',
                  outline: 'none', transition: 'border-color 0.2s',
                  background: '#fafafa',
                }}
                onFocus={e => e.target.style.borderColor = '#152664'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Senha */}
            <div style={{ marginBottom: 10 }}>
              <label style={{
                display: 'block', fontSize: 11, fontWeight: 700,
                color: '#374151', marginBottom: 7, letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>Senha</label>
              <input
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                placeholder="Sua senha"
                required
                style={{
                  width: '100%', padding: '13px 16px',
                  border: '1.5px solid #e5e7eb', borderRadius: 10,
                  fontSize: 14, color: '#0d0d0d',
                  outline: 'none', transition: 'border-color 0.2s',
                  background: '#fafafa',
                }}
                onFocus={e => e.target.style.borderColor = '#152664'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Esqueci senha */}
            <div style={{ textAlign: 'right', marginBottom: 24 }}>
              <button
                type="button"
                onClick={handleEsqueciSenha}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 13, color: '#152664', fontWeight: 500,
                  fontFamily: 'inherit', opacity: 0.65,
                  textDecoration: 'underline', padding: 0,
                }}
              >
                Esqueci minha senha
              </button>
            </div>

            {/* Erro */}
            {erro && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: 10, padding: '12px 16px',
                marginBottom: 16, fontSize: 13, color: '#dc2626',
                lineHeight: 1.5,
              }}>
                {erro}
              </div>
            )}

            {/* Sucesso */}
            {sucesso && (
              <div style={{
                background: '#f0fdf4', border: '1px solid #bbf7d0',
                borderRadius: 10, padding: '12px 16px',
                marginBottom: 16, fontSize: 13, color: '#16a34a',
                lineHeight: 1.5,
              }}>
                {sucesso}
              </div>
            )}

            {/* Botão entrar */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', height: 50,
                background: loading ? '#9ca3af' : '#152664',
                color: '#f4e3d0', border: 'none', borderRadius: 100,
                fontSize: 15, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', letterSpacing: '-0.01em',
                transition: 'all 0.2s',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(21,38,100,0.3)',
              }}
            >
              {loading ? 'Entrando...' : 'Entrar →'}
            </button>

          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'rgba(255,255,255,0.25)', fontWeight: 300 }}>
          © 2026 Prepara Aula · Todos os direitos reservados
        </p>

      </div>
    </div>
  )
}