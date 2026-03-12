'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()
  const [usuario, setUsuario] = useState(null)
  const [aulas, setAulas] = useState([])
  const [loading, setLoading] = useState(true)
  const [gerando, setGerando] = useState(false)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [aulasMes, setAulasMes] = useState(0)
  const [limiteMes, setLimiteMes] = useState(20)

  const [form, setForm] = useState({
    contexto: '',
    disciplina: 'Matemática',
    nivel: 'Ensino Fundamental II',
    duracao: '50 minutos',
    turma: '',
    qtdSlides: 12
  })

  useEffect(() => { carregarDados() }, [])

  async function carregarDados() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data: perfil } = await supabase
      .from('profiles').select('*').eq('id', user.id).single()

    // Bloqueia acesso se não tem plano ativo
    if (!perfil?.plano_ativo) {
      router.push("/planos?msg=sem-acesso")
      return
    }

    setUsuario(perfil)

    const limites = { starter: 20, profissional: 35, escola: 60 }
    setLimiteMes(limites[perfil?.plano] || 20)
    setAulasMes(perfil?.aulas_mes || 0)

    const { data: minhasAulas } = await supabase
      .from('aulas').select('*').eq('user_id', user.id)
      .order('created_at', { ascending: false })

    setAulas(minhasAulas || [])
    setLoading(false)
  }

  async function handleGerarAula() {
    if (!form.contexto.trim()) {
      alert('Descreva o que você quer ensinar!')
      return
    }

    if (aulasMes >= limiteMes) {
      alert(`Você atingiu o limite de ${limiteMes} aulas do seu plano este mês.`)
      return
    }

    setGerando(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch('/api/gerar-aula', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          tema: form.contexto.slice(0, 100),
          contexto: form.contexto,
          disciplina: form.disciplina,
          nivel: form.nivel,
          duracao: form.duracao,
          turma: form.turma,
          qtdSlides: form.qtdSlides
        })
      })

      const data = await response.json()
      if (data.erro) { alert('Erro: ' + data.erro); setGerando(false); return }

      await carregarDados()
      setMostrarForm(false)
      setForm({ contexto: '', disciplina: 'Matemática', nivel: 'Ensino Fundamental II', duracao: '50 minutos', turma: '', qtdSlides: 12 })
    } catch (err) {
      alert('Erro ao conectar com o servidor.')
    }
    setGerando(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    border: '1.5px solid #e2e8f0', borderRadius: 8,
    fontSize: 14, outline: 'none', boxSizing: 'border-box',
    color: '#374151', fontFamily: 'inherit', transition: 'border-color 0.2s',
    background: 'white'
  }

  const labelStyle = {
    fontSize: 12, fontWeight: 700, color: '#64748b',
    display: 'block', marginBottom: 6,
    textTransform: 'uppercase', letterSpacing: '0.08em'
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>📚</div>
        <p style={{ color: '#64748b', fontSize: 14 }}>Carregando...</p>
      </div>
    </div>
  )

  const porcentagem = limiteMes >= 99999 ? 0 : Math.round((aulasMes / limiteMes) * 100)

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* HEADER */}
      <header style={{
        background: 'white', borderBottom: '1px solid #e2e8f0',
        padding: '0 32px', height: 64, display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
        boxShadow: '0 1px 8px rgba(15,43,91,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #1a56db, #0891b2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📚</div>
          <span style={{ fontSize: 17, fontWeight: 800, color: '#0f2b5b', letterSpacing: '-0.02em' }}>
            Prepara<span style={{ color: '#1a56db' }}>Aula</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ background: '#f1f5f9', borderRadius: 10, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <span style={{ color: '#64748b' }}>Aulas este mês:</span>
            <span style={{ fontWeight: 700, color: porcentagem >= 90 ? '#ef4444' : '#0f2b5b' }}>
              {aulasMes}/{limiteMes >= 99999 ? '∞' : limiteMes}
            </span>
            {limiteMes < 99999 && (
              <div style={{ width: 60, height: 5, background: '#e2e8f0', borderRadius: 100, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${porcentagem}%`, background: porcentagem >= 90 ? '#ef4444' : '#1a56db', borderRadius: 100, transition: 'width 0.3s' }} />
              </div>
            )}
          </div>

          <span style={{ fontSize: 13, color: '#64748b' }}>
            Olá, <strong style={{ color: '#0f2b5b' }}>{usuario?.nome || usuario?.email?.split('@')[0]}</strong>
          </span>

          <div style={{
            background: usuario?.plano === 'escola' ? '#7c3aed' : usuario?.plano === 'profissional' ? '#1a56db' : '#475569',
            color: 'white', fontSize: 11, fontWeight: 700,
            padding: '4px 10px', borderRadius: 6,
            textTransform: 'uppercase', letterSpacing: '0.05em'
          }}>
            {usuario?.plano || 'starter'}
          </div>

          <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #e2e8f0', color: '#64748b', padding: '7px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
            Sair
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px' }}>

        {/* TOPO */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f2b5b', margin: 0, letterSpacing: '-0.02em' }}>Minhas aulas</h1>
            <p style={{ color: '#64748b', fontSize: 14, margin: '5px 0 0' }}>
              {aulas.length === 0 ? 'Crie sua primeira aula com IA' : `${aulas.length} aula${aulas.length !== 1 ? 's' : ''} criada${aulas.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <button
            onClick={() => setMostrarForm(true)}
            disabled={aulasMes >= limiteMes && limiteMes < 99999}
            style={{
              background: (aulasMes >= limiteMes && limiteMes < 99999) ? '#e2e8f0' : 'linear-gradient(135deg, #1a56db, #0891b2)',
              color: (aulasMes >= limiteMes && limiteMes < 99999) ? '#94a3b8' : 'white',
              border: 'none', padding: '12px 22px', borderRadius: 10,
              fontSize: 14, fontWeight: 700, cursor: (aulasMes >= limiteMes && limiteMes < 99999) ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit',
              boxShadow: (aulasMes >= limiteMes && limiteMes < 99999) ? 'none' : '0 4px 16px rgba(26,86,219,0.3)'
            }}
          >
            ✨ Criar nova aula
          </button>
        </div>

        {/* FORMULÁRIO */}
        {mostrarForm && (
          <div style={{ background: 'white', borderRadius: 16, padding: 32, marginBottom: 32, border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(15,43,91,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f2b5b', margin: 0 }}>✨ Nova aula</h2>
                <p style={{ fontSize: 13, color: '#64748b', margin: '5px 0 0' }}>
                  Quanto mais contexto você der, mais específica e densa será a aula gerada
                </p>
              </div>
              <button onClick={() => setMostrarForm(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#94a3b8', lineHeight: 1, padding: 4 }}>✕</button>
            </div>

            {/* CAMPO PRINCIPAL — contexto */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>
                Descreva sua aula *
              </label>
              <textarea
                placeholder={`Seja específico — descreva o que quer ensinar com suas próprias palavras.\n\nExemplos:\n• "Como o transporte vai impactar o mercado global: automação logística, drones, veículos autônomos e cadeias de suprimento do futuro"\n• "Fotossíntese para o 7° ano — quero que entendam o processo completo usando exemplos do cotidiano"\n• "Segunda Guerra Mundial focando nas causas econômicas e o Tratado de Versalhes"`}
                value={form.contexto}
                onChange={e => setForm({ ...form, contexto: e.target.value })}
                rows={5}
                style={{
                  ...inputStyle,
                  resize: 'vertical', lineHeight: 1.6,
                  border: '1.5px solid #c7d7ff',
                  background: '#fafbff', padding: '14px 16px', borderRadius: 10
                }}
                onFocus={e => e.target.style.borderColor = '#1a56db'}
                onBlur={e => e.target.style.borderColor = '#c7d7ff'}
              />
            </div>

            {/* LINHA 1: DISCIPLINA + NÍVEL */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Disciplina</label>
                <select value={form.disciplina} onChange={e => setForm({ ...form, disciplina: e.target.value })} style={inputStyle}>
                  {['Matemática','Português','Ciências','História','Geografia','Física','Química','Biologia','Inglês','Artes','Educação Física','Filosofia','Sociologia','Economia','Outras'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Nível da turma</label>
                <select value={form.nivel} onChange={e => setForm({ ...form, nivel: e.target.value })} style={inputStyle}>
                  {['Educação Infantil','Ensino Fundamental I','Ensino Fundamental II','Ensino Médio','Ensino Superior','Pós-graduação','EJA','Curso Técnico'].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
            </div>

            {/* LINHA 2: DURAÇÃO + TURMA */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Duração</label>
                <select value={form.duracao} onChange={e => setForm({ ...form, duracao: e.target.value })} style={inputStyle}>
                  {['30 minutos','50 minutos','1 hora','1h30','2 horas'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Turma <span style={{ fontWeight: 400, textTransform: 'none' }}>(opcional)</span></label>
                <input
                  type="text" placeholder="Ex: 7° ano B, Noturno..."
                  value={form.turma} onChange={e => setForm({ ...form, turma: e.target.value })}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#1a56db'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            {/* QUANTIDADE DE SLIDES */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ ...labelStyle, marginBottom: 10 }}>
                Quantidade de slides — <span style={{ fontWeight: 600, color: '#1a56db', fontSize: 13, textTransform: 'none', letterSpacing: 0 }}>{form.qtdSlides} slides</span>
              </label>
              <input
                type="range" min={6} max={20} step={1}
                value={form.qtdSlides}
                onChange={e => setForm({ ...form, qtdSlides: Number(e.target.value) })}
                style={{ width: '100%', accentColor: '#1a56db', cursor: 'pointer', height: 4 }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                {[
                  { val: 6,  label: '6',  desc: 'Rápido' },
                  { val: 10, label: '10', desc: 'Padrão' },
                  { val: 14, label: '14', desc: 'Completo' },
                  { val: 18, label: '18', desc: 'Extenso' },
                  { val: 20, label: '20', desc: 'Máximo' },
                ].map(({ val, label, desc }) => (
                  <button
                    key={val}
                    onClick={() => setForm({ ...form, qtdSlides: val })}
                    style={{
                      background: form.qtdSlides === val ? '#1a56db' : '#f1f5f9',
                      color: form.qtdSlides === val ? 'white' : '#64748b',
                      border: 'none', borderRadius: 8,
                      padding: '6px 12px', cursor: 'pointer',
                      fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
                      transition: 'all 0.15s'
                    }}
                  >
                    {label} <span style={{ fontSize: 11, opacity: 0.7 }}>({desc})</span>
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '8px 0 0' }}>
                💡 Mais slides = mais profundidade de conteúdo. Aulas de 50min funcionam bem com 10–14 slides.
              </p>
            </div>

            {/* BOTÃO */}
            <button
              onClick={handleGerarAula}
              disabled={gerando}
              style={{
                width: '100%', padding: 16,
                background: gerando ? '#e2e8f0' : 'linear-gradient(135deg, #1a56db, #0891b2)',
                color: gerando ? '#94a3b8' : 'white',
                border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700,
                cursor: gerando ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                boxShadow: gerando ? 'none' : '0 4px 16px rgba(26,86,219,0.3)', transition: 'all 0.2s'
              }}
            >
              {gerando ? `🤖 Gerando ${form.qtdSlides} slides com IA... pode demorar até 90 segundos` : `🚀 Gerar aula com ${form.qtdSlides} slides`}
            </button>

            {gerando && (
              <div style={{ marginTop: 14, padding: '14px 18px', background: '#eff6ff', borderRadius: 10, border: '1px solid #bfdbfe' }}>
                <p style={{ fontSize: 13, color: '#1e40af', margin: 0, lineHeight: 1.6 }}>
                  ⏳ <strong>Gerando conteúdo denso com o Claude.</strong> Estamos criando {form.qtdSlides} slides com dados reais, exemplos concretos, plano de aula e 5 exercícios. Isso leva entre 45 e 90 segundos dependendo da quantidade de slides.
                </p>
              </div>
            )}
          </div>
        )}

        {/* LISTA DE AULAS */}
        {aulas.length === 0 && !mostrarForm ? (
          <div style={{ background: 'white', borderRadius: 16, padding: '64px 32px', textAlign: 'center', border: '1.5px dashed #e2e8f0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f2b5b', marginBottom: 8 }}>Nenhuma aula criada ainda</h3>
            <p style={{ color: '#64748b', fontSize: 14, maxWidth: 360, margin: '0 auto 24px', lineHeight: 1.6 }}>
              Descreva o que quer ensinar e a IA cria slides visuais com conteúdo denso, plano de aula e exercícios.
            </p>
            <button onClick={() => setMostrarForm(true)} style={{ background: 'linear-gradient(135deg, #1a56db, #0891b2)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              ✨ Criar minha primeira aula
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {aulas.map(aula => {
              const corMap = { 'Matemática':'#1a56db','Física':'#7c3aed','Química':'#059669','Biologia':'#16a34a','História':'#dc2626','Geografia':'#ea580c','Português':'#0891b2','Inglês':'#0284c7','Ciências':'#0d9488' }
              const cor = corMap[aula.disciplina] || '#475569'
              const slideCount = (() => { try { return JSON.parse(aula.slides_editados || aula.slides || '[]').length } catch { return 0 } })()

              return (
                <div key={aula.id} onClick={() => router.push(`/aula/${aula.id}`)}
                  style={{ background: 'white', borderRadius: 14, padding: 24, border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(15,43,91,0.1)'; e.currentTarget.style.borderColor = cor }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e2e8f0' }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: cor, borderRadius: '14px 14px 0 0' }} />
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 12 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f2b5b', lineHeight: 1.4, margin: 0, flex: 1 }}>{aula.titulo}</h3>
                    <span style={{ background: cor+'15', color: cor, border: `1px solid ${cor}30`, fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, whiteSpace: 'nowrap', flexShrink: 0 }}>{aula.disciplina}</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                    {aula.nivel && <span style={{ background: '#f1f5f9', color: '#64748b', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6 }}>🎓 {aula.nivel}</span>}
                    {aula.duracao && <span style={{ background: '#f1f5f9', color: '#64748b', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6 }}>⏱ {aula.duracao}</span>}
                    {slideCount > 0 && <span style={{ background: '#eff6ff', color: '#1a56db', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6 }}>🖼 {slideCount} slides</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>{new Date(aula.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    <span style={{ fontSize: 12, color: cor, fontWeight: 600 }}>Ver aula →</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}