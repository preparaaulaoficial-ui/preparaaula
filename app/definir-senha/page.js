'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function DefinirSenhaPage() {
  const router = useRouter()
  const [senha, setSenha]           = useState('')
  const [confirmar, setConfirmar]   = useState('')
  const [loading, setLoading]       = useState(false)
  const [erro, setErro]             = useState('')
  const [primeiroAcesso, setPrimeiroAcesso] = useState(false)

  useEffect(() => {
    verificarSessao()
  }, [])

  async function verificarSessao() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    // Verifica se é primeiro acesso (veio via magic link)
    const { data: { session } } = await supabase.auth.getSession()
    const isPrimeiroAcesso = session?.user?.app_metadata?.provider === 'email' &&
                             !session?.user?.user_metadata?.senha_definida
    setPrimeiroAcesso(isPrimeiroAcesso)
  }

  async function handleDefinirSenha(e) {
    e.preventDefault()
    setErro('')

    if (senha.length < 8) {
      setErro('A senha precisa ter pelo menos 8 caracteres.')
      return
    }
    if (senha !== confirmar) {
      setErro('As senhas não coincidem.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password: senha,
      data: { senha_definida: true }
    })

    if (error) {
      setErro('Erro ao definir senha. Tente novamente.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      padding: 24,
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
        </div>

        {/* Card */}
        <div style={{ background: 'white', borderRadius: 20, padding: '36px 32px', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>

          {/* Ícone */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 44 }}>🔐</div>
          </div>

          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 6px', textAlign: 'center', letterSpacing: '-0.02em' }}>
            {primeiroAcesso ? 'Crie sua senha' : 'Alterar senha'}
          </h1>
          <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 24px', textAlign: 'center', lineHeight: 1.5 }}>
            {primeiroAcesso
              ? 'Bem-vindo ao PreparaAula! Defina uma senha para os próximos acessos.'
              : 'Digite uma nova senha para sua conta.'}
          </p>

          <form onSubmit={handleDefinirSenha}>

            {/* Senha */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, letterSpacing: '0.03em' }}>
                NOVA SENHA
              </label>
              <input
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                required
                style={{
                  width: '100%', padding: '12px 14px',
                  border: '1.5px solid #e2e8f0', borderRadius: 10,
                  fontSize: 14, fontFamily: 'inherit', color: '#0f172a',
                  outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#1a56db'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            {/* Confirmar */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, letterSpacing: '0.03em' }}>
                CONFIRMAR SENHA
              </label>
              <input
                type="password"
                value={confirmar}
                onChange={e => setConfirmar(e.target.value)}
                placeholder="Repita a senha"
                required
                style={{
                  width: '100%', padding: '12px 14px',
                  border: '1.5px solid #e2e8f0', borderRadius: 10,
                  fontSize: 14, fontFamily: 'inherit', color: '#0f172a',
                  outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#1a56db'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            {/* Indicador de força */}
            {senha.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{
                      flex: 1, height: 3, borderRadius: 2,
                      background: senha.length >= i * 3
                        ? i <= 1 ? '#ef4444' : i <= 2 ? '#f59e0b' : i <= 3 ? '#3b82f6' : '#10b981'
                        : '#e2e8f0'
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>
                  {senha.length < 6 ? 'Fraca' : senha.length < 9 ? 'Razoável' : senha.length < 12 ? 'Boa' : 'Forte'}
                </span>
              </div>
            )}

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
                fontSize: 15, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', letterSpacing: '-0.01em',
                boxShadow: loading ? 'none' : '0 4px 14px rgba(26,86,219,0.35)',
              }}
            >
              {loading ? 'Salvando...' : primeiroAcesso ? 'Salvar e entrar no dashboard →' : 'Salvar nova senha →'}
            </button>
          </form>

          {/* Link para pular (só se não for primeiro acesso) */}
          {!primeiroAcesso && (
            <button
              onClick={() => router.push('/dashboard')}
              style={{ display: 'block', width: '100%', marginTop: 12, background: 'none', border: 'none', color: '#94a3b8', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Cancelar
            </button>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
          © 2026 PreparaAula · Todos os direitos reservados
        </p>
      </div>
    </div>
  )
}