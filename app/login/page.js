'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [senha, setSenha]       = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [erro, setErro]         = useState('')
  const [sucesso, setSucesso]   = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setErro('')
    setSucesso('')

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErro('Por favor insira um e-mail válido.')
      return
    }
    if (senha.length < 6) {
      setErro('Senha inválida (mínimo 6 caracteres).')
      return
    }

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
    setErro('')
    setSucesso('')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErro('Digite seu e-mail acima antes de solicitar a recuperação.')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/definir-senha`,
    })
    setLoading(false)
    if (error) { setErro('Erro ao enviar e-mail. Verifique o endereço e tente novamente.'); return }
    setSucesso('E-mail de recuperação enviado! Verifique sua caixa de entrada.')
  }

  return (
    <div style={{fontFamily:"'Inter',sans-serif",color:'#0a0a0a',minHeight:'100vh',display:'flex'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        :root{
          --indigo:#152664;--indigo-light:#1e3580;--indigo-50:#cbe7fe;--indigo-100:#a8d8fd;
          --violet:#152664;--peach:#f4e3d0;
          --slate-900:#0a0a0a;--slate-700:#2d3748;--slate-600:#4a5568;
          --slate-500:#64748B;--slate-400:#94A3B8;--slate-200:#E2E8F0;
          --slate-100:#F1F5F9;--slate-50:#F8FAFC;--white:#FFFFFF;
          --danger:#EF4444;--success:#10B981;
          --radius:12px;--shadow:0 4px 16px rgba(0,0,0,.07),0 2px 6px rgba(0,0,0,.04);
          --shadow-indigo:0 8px 32px rgba(21,38,100,.3);
          --transition:all .2s cubic-bezier(.4,0,.2,1);
        }
        a{color:inherit;text-decoration:none;}
        button{font-family:inherit;cursor:pointer;border:none;}
        .auth-layout{display:flex;width:100%;min-height:100vh;}
        .auth-left{flex:0 0 480px;background:linear-gradient(155deg,#060e24 0%,#152664 60%,#1a3278 100%);padding:48px 52px;display:flex;flex-direction:column;position:relative;overflow:hidden;}
        .auth-left::before{content:'';position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.055) 1.5px,transparent 1.5px);background-size:28px 28px;pointer-events:none;}
        .auth-left::after{content:'';position:absolute;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,rgba(100,130,210,.22) 0%,transparent 65%);bottom:-180px;right:-180px;pointer-events:none;}
        .left-logo{display:flex;align-items:center;gap:11px;font-weight:800;font-size:1.1rem;color:#fff;position:relative;z-index:1;margin-bottom:auto;}
        .left-logo-mark{width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center;font-size:18px;backdrop-filter:blur(4px);}
        .left-body{position:relative;z-index:1;margin-bottom:52px;}
        .left-body h2{font-size:1.95rem;font-weight:800;color:#fff;line-height:1.18;letter-spacing:-.022em;margin-bottom:16px;}
        .left-body>p{font-size:.9375rem;color:rgba(255,255,255,.62);line-height:1.72;margin-bottom:40px;}
        .left-stats{display:flex;flex-direction:column;gap:12px;}
        .left-stat{display:flex;align-items:center;gap:14px;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.14);border-radius:14px;padding:15px 18px;backdrop-filter:blur(6px);}
        .left-stat-icon{width:40px;height:40px;border-radius:11px;flex-shrink:0;background:rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center;font-size:18px;}
        .left-stat-text strong{display:block;font-size:.875rem;font-weight:700;color:#fff;}
        .left-stat-text span{font-size:.775rem;color:rgba(255,255,255,.52);}
        .left-footer{position:relative;z-index:1;font-size:.78rem;color:rgba(255,255,255,.28);}
        .auth-right{flex:1;display:flex;align-items:center;justify-content:center;padding:48px 40px;background:var(--slate-50);overflow-y:auto;}
        .auth-card{width:100%;max-width:416px;}
        .auth-card-head{margin-bottom:32px;}
        .auth-card-head h1{font-size:1.6rem;font-weight:800;letter-spacing:-.022em;color:var(--slate-900);margin-bottom:7px;}
        .auth-card-head p{font-size:.875rem;color:var(--slate-500);line-height:1.6;}
        .form-group{margin-bottom:16px;}
        .form-label{display:block;font-size:.8rem;font-weight:600;color:var(--slate-700);margin-bottom:7px;}
        .input-wrap{position:relative;}
        .form-input{width:100%;height:46px;padding:0 14px 0 42px;border:1.5px solid var(--slate-200);border-radius:var(--radius);background:var(--white);outline:none;font-family:'Inter',sans-serif;font-size:.9375rem;color:var(--slate-900);transition:border-color .18s,box-shadow .18s;}
        .form-input::placeholder{color:var(--slate-400);}
        .form-input:focus{border-color:var(--indigo);box-shadow:0 0 0 3px rgba(21,38,100,.11);}
        .form-input.error{border-color:var(--danger);}
        .input-icon-left{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--slate-400);pointer-events:none;}
        .input-icon-right{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;color:var(--slate-400);padding:4px;display:flex;transition:color .15s;}
        .input-icon-right:hover{color:var(--slate-600);}
        .form-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;}
        .form-check{display:flex;align-items:center;gap:8px;cursor:pointer;}
        .form-check input{width:15px;height:15px;accent-color:var(--indigo);cursor:pointer;}
        .form-check-lbl{font-size:.82rem;color:var(--slate-600);}
        .form-forgot{font-size:.82rem;color:var(--indigo);font-weight:500;background:none;padding:0;}
        .form-forgot:hover{text-decoration:underline;}
        .btn-submit{width:100%;height:48px;background:linear-gradient(135deg,var(--indigo) 0%,var(--violet) 100%);border-radius:var(--radius);color:#fff;font-size:.9375rem;font-weight:700;box-shadow:var(--shadow-indigo);display:flex;align-items:center;justify-content:center;gap:8px;transition:var(--transition);margin-bottom:20px;}
        .btn-submit:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(21,38,100,.38);filter:brightness(1.06);}
        .btn-submit:disabled{opacity:.65;transform:none;cursor:not-allowed;}
        .back-link{display:inline-flex;align-items:center;gap:6px;font-size:.8rem;font-weight:500;color:var(--slate-500);margin-bottom:28px;transition:color .15s;}
        .back-link:hover{color:var(--indigo);}
        @media(max-width:860px){.auth-left{display:none;}.auth-right{background:var(--white);}}
        @media(max-width:440px){.auth-right{padding:32px 20px;}}
      `}</style>

      <div className="auth-layout">
        {/* LEFT */}
        <aside className="auth-left">
          <div className="left-logo">
            <div className="left-logo-mark">✦</div>
            Prepara Aula
          </div>
          <div className="left-body">
            <h2>Crie aulas completas em minutos com IA.</h2>
            <p>Slides, plano de aula, roteiro do professor e exercícios — tudo gerado automaticamente e alinhado à BNCC.</p>
            <div className="left-stats">
              {[
                {icon:'⚡',t:'Tempo médio de 3 minutos',s:'Do prompt à aula completa pronta para usar'},
                {icon:'📊',t:'Até 20 slides por aula',s:'Com design profissional e estrutura pedagógica'},
                {icon:'✅',t:'100% alinhado à BNCC',s:'Competências e habilidades preenchidas automaticamente'},
              ].map((st,i) => (
                <div key={i} className="left-stat">
                  <div className="left-stat-icon">{st.icon}</div>
                  <div className="left-stat-text"><strong>{st.t}</strong><span>{st.s}</span></div>
                </div>
              ))}
            </div>
          </div>
          <div className="left-footer">© 2026 Prepara Aula · Todos os direitos reservados</div>
        </aside>

        {/* RIGHT */}
        <main className="auth-right">
          <div className="auth-card">
            <a href="/" className="back-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Voltar ao site
            </a>

            <div className="auth-card-head">
              <h1>Bem-vindo de volta</h1>
              <p>Entre na sua conta para continuar criando aulas.</p>
            </div>

            <form onSubmit={handleLogin} noValidate>
              {/* Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="inp-email">E-mail</label>
                <div className="input-wrap">
                  <span className="input-icon-left">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>
                  </span>
                  <input
                    id="inp-email" type="email"
                    className={`form-input${erro && erro.includes('e-mail') ? ' error' : ''}`}
                    placeholder="ana@escola.com.br"
                    value={email} onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="form-group" style={{marginBottom:'8px'}}>
                <label className="form-label" htmlFor="inp-pass">Senha</label>
                <div className="input-wrap">
                  <span className="input-icon-left">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </span>
                  <input
                    id="inp-pass" type={showPass ? 'text' : 'password'}
                    className={`form-input${erro && erro.includes('Senha') ? ' error' : ''}`}
                    placeholder="••••••••"
                    value={senha} onChange={e => setSenha(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button type="button" className="input-icon-right" onClick={() => setShowPass(!showPass)} aria-label="Ver senha">
                    {showPass
                      ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>

              {/* Lembrar / Esqueci */}
              <div className="form-row">
                <label className="form-check">
                  <input type="checkbox"/>
                  <span className="form-check-lbl">Lembrar de mim</span>
                </label>
                <button type="button" className="form-forgot" onClick={handleEsqueciSenha}>
                  Esqueci minha senha
                </button>
              </div>

              {/* Feedback */}
              {erro && (
                <div style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:'10px',padding:'11px 14px',marginBottom:'14px',fontSize:'.82rem',color:'#dc2626',lineHeight:1.5}}>
                  {erro}
                </div>
              )}
              {sucesso && (
                <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:'10px',padding:'11px 14px',marginBottom:'14px',fontSize:'.82rem',color:'#16a34a',lineHeight:1.5}}>
                  {sucesso}
                </div>
              )}

              <button type="submit" className="btn-submit" disabled={loading}>
                <span>{loading ? 'Aguarde...' : 'Entrar na conta'}</span>
                {!loading && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
              </button>
            </form>

            <p style={{textAlign:'center',fontSize:'.82rem',color:'#94A3B8',marginTop:'4px'}}>
              Ainda não tem uma conta?{' '}
              <a href="https://pay.cakto.com.br/ay95nr9_802729" target="_blank" style={{color:'#152664',fontWeight:600}}>
                Conheça os planos →
              </a>
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}