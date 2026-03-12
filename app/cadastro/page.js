'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Cadastro() {
  const router = useRouter()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function handleCadastro() {
    setLoading(true)
    setErro('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { nome } }
    })

    if (error) {
      setErro(error.message)
      setLoading(false)
      return
    }

    // Criar perfil no banco
    await supabase.from('profiles').insert({
      id: data.user.id,
      email,
      nome,
      plano: 'starter'
    })

    router.push('/dashboard')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f2b5b, #1a3a7a)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: 16,
        padding: 40,
        width: '100%',
        maxWidth: 420,
        boxShadow: '0 24px 80px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📚</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f2b5b', margin: 0 }}>
            Prepara<span style={{ color: '#1a56db' }}>Aula</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 14, marginTop: 6 }}>
            Crie sua conta gratuita
          </p>
        </div>

        {erro && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca',
            color: '#dc2626', padding: '10px 14px',
            borderRadius: 8, fontSize: 14, marginBottom: 16
          }}>
            {erro}
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
            Seu nome
          </label>
          <input
            type="text"
            placeholder="Ex: Maria Silva"
            value={nome}
            onChange={e => setNome(e.target.value)}
            style={{
              width: '100%', padding: '12px 14px',
              border: '1.5px solid #e2e8f0', borderRadius: 8,
              fontSize: 14, outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
            E-mail
          </label>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              width: '100%', padding: '12px 14px',
              border: '1.5px solid #e2e8f0', borderRadius: 8,
              fontSize: 14, outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
            Senha
          </label>
          <input
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            style={{
              width: '100%', padding: '12px 14px',
              border: '1.5px solid #e2e8f0', borderRadius: 8,
              fontSize: 14, outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          onClick={handleCadastro}
          disabled={loading}
          style={{
            width: '100%', padding: 14,
            background: loading ? '#94a3b8' : '#1a56db',
            color: 'white', border: 'none',
            borderRadius: 10, fontSize: 15,
            fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {loading ? 'Criando conta...' : 'Criar conta grátis →'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#94a3b8', marginTop: 20 }}>
          Já tem conta?{' '}
          <Link href="/login" style={{ color: '#1a56db', fontWeight: 600 }}>
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  )
}