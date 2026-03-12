'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const DISCIPLINAS = [
  // Ensino Básico
  'Matemática', 'Português', 'Ciências', 'História', 'Geografia',
  'Física', 'Química', 'Biologia', 'Inglês', 'Espanhol',
  'Artes', 'Educação Física', 'Filosofia', 'Sociologia', 'Religião',
  // Ensino Superior
  'Administração', 'Contabilidade', 'Direito', 'Economia',
  'Engenharia', 'Medicina', 'Psicologia', 'Pedagogia',
  'Nutrição', 'Arquitetura', 'Tecnologia da Informação',
  'Comunicação', 'Letras', 'Enfermagem', 'Fisioterapia',
]

const TURMAS = [
  // Educação Infantil
  { grupo: 'Educação Infantil', opcoes: ['Maternal', 'Jardim I', 'Jardim II', 'Pré-escola'] },
  // Ensino Fundamental I
  { grupo: 'Fund. I', opcoes: ['1º ano — EF', '2º ano — EF', '3º ano — EF', '4º ano — EF', '5º ano — EF'] },
  // Ensino Fundamental II
  { grupo: 'Fund. II', opcoes: ['6º ano — EF', '7º ano — EF', '8º ano — EF', '9º ano — EF'] },
  // Ensino Médio
  { grupo: 'Ensino Médio', opcoes: ['1º ano — EM', '2º ano — EM', '3º ano — EM'] },
  // EJA
  { grupo: 'EJA', opcoes: ['EJA — Fase I', 'EJA — Fase II', 'EJA — Fase III'] },
  // Ensino Superior
  {
    grupo: 'Ensino Superior', opcoes: [
      'Superior — 1º Período', 'Superior — 2º Período', 'Superior — 3º Período',
      'Superior — 4º Período', 'Superior — 5º Período', 'Superior — 6º Período',
      'Superior — 7º Período', 'Superior — 8º Período',
      'Pós-graduação', 'Mestrado', 'Doutorado',
    ]
  },
  // Técnico
  { grupo: 'Técnico', opcoes: ['Técnico — Módulo I', 'Técnico — Módulo II', 'Técnico — Módulo III'] },
]

const DURACOES = ['20 minutos', '30 minutos', '40 minutos', '50 minutos', '1 hora', '1h30', '2 horas']

const navItems = [
  { id: 'inicio', label: 'Início', icon: '⊞' },
  { id: 'nova-aula', label: 'Nova Aula', icon: '✦', badge: 'IA' },
  { id: 'minhas-aulas', label: 'Minhas Aulas', icon: '⊡' },
  { id: 'slides', label: 'Slides', icon: '▤', section: 'FERRAMENTAS' },
  { id: 'planos-aula', label: 'Planos de Aula', icon: '☰' },
  { id: 'exercicios', label: 'Exercícios', icon: '✎' },
  { id: 'roteiros', label: 'Roteiros', icon: '⚑' },
  { id: 'plano', label: 'Plano & Assinatura', icon: '⊕', section: 'CONTA' },
  { id: 'sair', label: 'Sair', icon: '⎋' },
]

export default function Dashboard() {
  const router = useRouter()
  const [usuario, setUsuario] = useState(null)
  const [aulas, setAulas] = useState([])
  const [loading, setLoading] = useState(true)
  const [gerando, setGerando] = useState(false)
  const [progresso, setProgresso] = useState(0)
  const [activeNav, setActiveNav] = useState('inicio')
  const [filtro, setFiltro] = useState('todas')
  const [busca, setBusca] = useState('')

  const [form, setForm] = useState({
    descricao: '',
    disciplina: 'Ciências',
    turma: '8º ano — EF',
    duracao: '50 minutos',
  })

  // Stats calculados a partir dos dados reais
  const [stats, setStats] = useState({
    aulasMes: 0,
    slidesGerados: 0,
    horasEconomizadas: 0,
    exerciciosGerados: 0,
    limitesMes: 20,
    aulasUsadas: 0,
  })

  useEffect(() => { carregarDados() }, [])

  async function carregarDados() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data: perfil } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!perfil?.plano_ativo) { router.push('/planos'); return }

    setUsuario(perfil)

    const { data: minhasAulas } = await supabase
      .from('aulas')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    const lista = minhasAulas || []
    setAulas(lista)

    // Calcular stats a partir dos dados reais
    const mesAtual = new Date().toISOString().slice(0, 7) // "2026-03"
    const aulasMes = lista.filter(a => a.created_at?.slice(0, 7) === mesAtual).length

    let totalSlides = 0
    let totalExercicios = 0
    for (const aula of lista) {
      try {
        const slides = aula.slides ? JSON.parse(aula.slides) : []
        totalSlides += Array.isArray(slides) ? slides.length : 0
      } catch {}
      try {
        const ex = aula.exercicios ? JSON.parse(aula.exercicios) : []
        totalExercicios += Array.isArray(ex) ? ex.length : 0
      } catch {}
    }

    const limites = { starter: 20, profissional: 35, escola: 60 }
    const limite = limites[perfil?.plano] || 20

    setStats({
      aulasMes,
      slidesGerados: totalSlides,
      horasEconomizadas: Math.round(lista.length * 1.5),
      exerciciosGerados: totalExercicios,
      limitesMes: limite,
      aulasUsadas: perfil?.aulas_mes || 0,
    })

    setLoading(false)
  }

  async function handleGerarAula() {
    if (!form.descricao.trim()) {
      alert('Descreva sua aula antes de gerar!')
      return
    }

    const limite = stats.limitesMes
    const usadas = stats.aulasUsadas
    if (usadas >= limite) {
      alert(`Você atingiu o limite de ${limite} aulas do seu plano este mês. Faça upgrade para continuar!`)
      return
    }

    setGerando(true)
    setProgresso(0)
    setActiveNav('nova-aula')

    // Progresso animado
    const intervalo = setInterval(() => {
      setProgresso(p => {
        if (p >= 85) { clearInterval(intervalo); return p }
        return p + Math.random() * 8
      })
    }, 800)

    try {
      const { data: { session } } = await supabase.auth.getSession()

      const response = await fetch('/api/gerar-aula', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          tema: form.descricao,
          disciplina: form.disciplina,
          nivel: form.turma,
          duracao: form.duracao,
          turma: form.turma,
          quantidade_slides: 14,
        })
      })

      clearInterval(intervalo)
      setProgresso(100)

      const data = await response.json()

      if (!response.ok || data.erro) {
        alert('Erro ao gerar aula: ' + (data.erro || 'Tente novamente'))
        setGerando(false)
        setProgresso(0)
        return
      }

      // Redireciona para a aula gerada
      setTimeout(() => {
        setGerando(false)
        setProgresso(0)
        if (data.aula?.id) {
          router.push(`/aula/${data.aula.id}`)
        } else {
          carregarDados()
          setActiveNav('minhas-aulas')
        }
      }, 600)

    } catch (err) {
      clearInterval(intervalo)
      alert('Erro de conexão. Verifique sua internet e tente novamente.')
      setGerando(false)
      setProgresso(0)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const aulasFiltradas = aulas.filter(a => {
    if (filtro === 'concluidas') return a.status === 'concluida' || !a.status
    if (filtro === 'rascunhos') return a.status === 'rascunho'
    return true
  }).filter(a => {
    if (!busca) return true
    const s = busca.toLowerCase()
    return (a.titulo || a.tema || '').toLowerCase().includes(s) ||
      (a.disciplina || '').toLowerCase().includes(s)
  })

  const iconesDisciplina = {
    'Ciências': '🔬', 'Matemática': '📐', 'Português': '📝', 'História': '🏛️',
    'Geografia': '🌍', 'Física': '⚡', 'Química': '🧪', 'Biologia': '🧬',
    'Inglês': '🇺🇸', 'Espanhol': '🇪🇸', 'Artes': '🎨', 'Educação Física': '⚽',
    'Filosofia': '🦉', 'Sociologia': '👥', 'Direito': '⚖️', 'Medicina': '🩺',
    'Engenharia': '⚙️', 'Administração': '📊', 'Psicologia': '🧠',
  }

  const getHoraSaudacao = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Bom dia'
    if (h < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  const formatarData = (iso) => {
    if (!iso) return ''
    const d = new Date(iso)
    const hoje = new Date()
    const ontem = new Date(); ontem.setDate(ontem.getDate() - 1)
    if (d.toDateString() === hoje.toDateString()) return `Hoje, ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
    if (d.toDateString() === ontem.toDateString()) return `Ontem, ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ', ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  const nomeAbreviado = usuario?.nome?.split(' ')[0] || 'Professor'
  const iniciais = usuario?.nome?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'GC'
  const nomePlano = { starter: 'Starter', profissional: 'Profissional', escola: 'Escola' }[usuario?.plano] || 'Starter'

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16, animation: 'spin 1s linear infinite' }}>✦</div>
        <p style={{ color: '#1a3a7a', fontWeight: 600 }}>Carregando PreparaAula...</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )

  const renderConteudo = () => {
    if (activeNav === 'nova-aula' || activeNav === 'inicio') {
      return (
        <>
          {/* Saudação */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f2b5b', margin: 0 }}>
                {getHoraSaudacao()}, {nomeAbreviado} 👋
              </h1>
              <p style={{ color: '#94a3b8', marginTop: 4, fontSize: 14 }}>
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · Plano {nomePlano}
              </p>
            </div>
            <button
              onClick={() => setActiveNav('nova-aula')}
              style={{
                background: 'linear-gradient(135deg, #152664, #1a56db)',
                color: 'white', border: 'none', borderRadius: 12,
                padding: '12px 24px', fontWeight: 700, fontSize: 14,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: '0 4px 16px rgba(21,38,100,0.25)'
              }}
            >
              + Nova aula
            </button>
          </div>

          {/* Stats — apenas se tiver aulas criadas */}
          {aulas.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16, marginBottom: 32 }}>
              {[
                { label: 'Aulas criadas este mês', value: stats.aulasMes, icon: '📊', cor: '#3b82f6' },
                { label: 'Slides gerados', value: stats.slidesGerados, icon: '🖼️', cor: '#8b5cf6' },
                { label: 'Horas economizadas', value: `${stats.horasEconomizadas}h`, icon: '⏱️', cor: '#10b981' },
                { label: 'Exercícios gerados', value: stats.exerciciosGerados, icon: '📝', cor: '#f59e0b' },
              ].map((s, i) => (
                <div key={i} style={{
                  background: 'white', borderRadius: 16, padding: '20px 22px',
                  border: '1px solid #e8eef8', boxShadow: '0 2px 12px rgba(21,38,100,0.05)'
                }}>
                  <div style={{ fontSize: 24, marginBottom: 10 }}>{s.icon}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#0f2b5b' }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Barra de uso do plano */}
          <div style={{
            background: 'white', borderRadius: 16, padding: '20px 24px',
            border: '1px solid #e8eef8', marginBottom: 28,
            boxShadow: '0 2px 12px rgba(21,38,100,0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontWeight: 600, color: '#0f2b5b', fontSize: 14 }}>Uso do plano este mês</span>
              <span style={{ fontSize: 13, color: '#94a3b8' }}>{stats.aulasUsadas} / {stats.limitesMes} aulas</span>
            </div>
            <div style={{ background: '#f1f5f9', borderRadius: 100, height: 8, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 100,
                background: stats.aulasUsadas / stats.limitesMes > 0.8
                  ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                  : 'linear-gradient(90deg, #152664, #1a56db)',
                width: `${Math.min((stats.aulasUsadas / stats.limitesMes) * 100, 100)}%`,
                transition: 'width 0.5s ease'
              }} />
            </div>
            {stats.aulasUsadas >= stats.limitesMes && (
              <p style={{ fontSize: 12, color: '#ef4444', marginTop: 8, fontWeight: 600 }}>
                ⚠️ Limite atingido. <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => router.push('/planos')}>Fazer upgrade →</span>
              </p>
            )}
          </div>

          {/* Formulário de geração */}
          <div style={{
            background: 'white', borderRadius: 20, padding: 28,
            border: '1px solid #e8eef8', marginBottom: 32,
            boxShadow: '0 2px 12px rgba(21,38,100,0.05)'
          }}>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0f2b5b', margin: '0 0 4px' }}>
                ✦ Nova aula com IA
              </h2>
              <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Descreva sua aula e deixe a IA fazer o resto.</p>
            </div>

            <div style={{ position: 'relative', marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: 8 }}>
                DESCREVA SUA AULA
              </label>
              <textarea
                placeholder="Ex: Sistema circulatório para o 8º ano do ensino fundamental, 50 minutos. Turma participativa, gosto de perguntas interativas..."
                value={form.descricao}
                onChange={e => setForm({ ...form, descricao: e.target.value })}
                rows={4}
                style={{
                  width: '100%', padding: '14px 16px',
                  border: '1.5px solid #e2e8f0', borderRadius: 12,
                  fontSize: 14, outline: 'none', resize: 'vertical',
                  fontFamily: 'sans-serif', color: '#374151',
                  boxSizing: 'border-box', lineHeight: 1.6,
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = '#1a56db'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 20 }}>
              {/* Disciplina */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Disciplina</label>
                <select
                  value={form.disciplina}
                  onChange={e => setForm({ ...form, disciplina: e.target.value })}
                  style={selectStyle}
                >
                  <optgroup label="── Ensino Básico ──" disabled />
                  {DISCIPLINAS.slice(0, 15).map(d => <option key={d}>{d}</option>)}
                  <optgroup label="── Ensino Superior ──" disabled />
                  {DISCIPLINAS.slice(15).map(d => <option key={d}>{d}</option>)}
                </select>
              </div>

              {/* Turma */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Turma / Série</label>
                <select
                  value={form.turma}
                  onChange={e => setForm({ ...form, turma: e.target.value })}
                  style={selectStyle}
                >
                  {TURMAS.map(grupo => (
                    <optgroup key={grupo.grupo} label={`── ${grupo.grupo} ──`}>
                      {grupo.opcoes.map(o => <option key={o}>{o}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Duração */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Duração</label>
                <select
                  value={form.duracao}
                  onChange={e => setForm({ ...form, duracao: e.target.value })}
                  style={selectStyle}
                >
                  {DURACOES.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {/* Chips do que será gerado */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[
                  { label: 'Slides', icon: '📊' },
                  { label: 'Plano BNCC', icon: '📋' },
                  { label: 'Roteiro', icon: '🎙️' },
                  { label: 'Exercícios', icon: '📝' },
                ].map(c => (
                  <div key={c.label} style={{
                    background: '#eff6ff', color: '#1a56db',
                    borderRadius: 100, padding: '5px 12px',
                    fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5
                  }}>
                    {c.icon} {c.label}
                  </div>
                ))}
              </div>

              <button
                onClick={handleGerarAula}
                disabled={gerando || stats.aulasUsadas >= stats.limitesMes}
                style={{
                  background: gerando || stats.aulasUsadas >= stats.limitesMes
                    ? '#94a3b8'
                    : 'linear-gradient(135deg, #152664, #1a56db)',
                  color: 'white', border: 'none', borderRadius: 12,
                  padding: '12px 28px', fontWeight: 700, fontSize: 14,
                  cursor: gerando ? 'wait' : stats.aulasUsadas >= stats.limitesMes ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: gerando ? 'none' : '0 4px 16px rgba(21,38,100,0.25)',
                  transition: 'all 0.2s'
                }}
              >
                {gerando ? '⟳ Gerando...' : '⚡ Gerar aula'}
              </button>
            </div>

            {/* Barra de progresso */}
            {gerando && (
              <div style={{ marginTop: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: '#64748b' }}>
                    {progresso < 30 ? '🤖 Analisando o contexto...'
                      : progresso < 60 ? '📊 Criando os slides...'
                        : progresso < 85 ? '📋 Montando o plano de aula...'
                          : '✅ Finalizando...'}
                  </span>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{Math.round(progresso)}%</span>
                </div>
                <div style={{ background: '#f1f5f9', borderRadius: 100, height: 6, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 100,
                    background: 'linear-gradient(90deg, #152664, #1a56db)',
                    width: `${progresso}%`,
                    transition: 'width 0.4s ease'
                  }} />
                </div>
              </div>
            )}
          </div>

          {/* Lista de aulas recentes */}
          {aulas.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0f2b5b', margin: 0 }}>
                  Aulas recentes
                </h2>
                <button
                  onClick={() => setActiveNav('minhas-aulas')}
                  style={{ fontSize: 13, color: '#1a56db', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                >
                  Ver todas →
                </button>
              </div>
              <TabelaAulas
                aulas={aulas.slice(0, 5)}
                router={router}
                icones={iconesDisciplina}
                formatarData={formatarData}
              />
            </div>
          )}

          {aulas.length === 0 && (
            <div style={{
              background: 'white', borderRadius: 20, padding: 64,
              textAlign: 'center', border: '2px dashed #e2e8f0'
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
              <h3 style={{ color: '#0f2b5b', marginBottom: 8, fontSize: 18 }}>Nenhuma aula ainda</h3>
              <p style={{ color: '#94a3b8', fontSize: 14 }}>Descreva sua aula acima e clique em <strong>Gerar aula</strong> para começar!</p>
            </div>
          )}
        </>
      )
    }

    if (activeNav === 'minhas-aulas') {
      return (
        <>
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f2b5b', margin: '0 0 4px' }}>Minhas Aulas</h1>
            <p style={{ color: '#94a3b8', fontSize: 13 }}>{aulas.length} aula{aulas.length !== 1 ? 's' : ''} criada{aulas.length !== 1 ? 's' : ''}</p>
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Buscar aulas, disciplinas..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              style={{
                flex: 1, minWidth: 200, padding: '10px 16px',
                border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none'
              }}
            />
            {['todas', 'concluidas', 'rascunhos'].map(f => (
              <button key={f}
                onClick={() => setFiltro(f)}
                style={{
                  padding: '10px 18px', borderRadius: 10, border: 'none',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  background: filtro === f ? '#152664' : '#f1f5f9',
                  color: filtro === f ? 'white' : '#64748b',
                }}
              >
                {f === 'todas' ? 'Todas' : f === 'concluidas' ? 'Concluídas' : 'Rascunhos'}
              </button>
            ))}
          </div>

          {aulasFiltradas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 64, color: '#94a3b8' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <p>Nenhuma aula encontrada</p>
            </div>
          ) : (
            <TabelaAulas
              aulas={aulasFiltradas}
              router={router}
              icones={iconesDisciplina}
              formatarData={formatarData}
            />
          )}
        </>
      )
    }

    // Slides, Planos de Aula, Exercícios, Roteiros — filtram das aulas existentes
    const secoes = {
      slides: { titulo: 'Slides', icon: '▤', desc: 'Apresentações geradas', campo: 'slides' },
      'planos-aula': { titulo: 'Planos de Aula', icon: '☰', desc: 'Planos com BNCC', campo: 'plano_aula' },
      exercicios: { titulo: 'Exercícios', icon: '✎', desc: 'Exercícios e gabaritos', campo: 'exercicios' },
      roteiros: { titulo: 'Roteiros', icon: '⚑', desc: 'Roteiros do professor', campo: 'atividade' },
    }

    if (secoes[activeNav]) {
      const sec = secoes[activeNav]
      const aulasComConteudo = aulas.filter(a => a[sec.campo])
      return (
        <>
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f2b5b', margin: '0 0 4px' }}>
              {sec.icon} {sec.titulo}
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 13 }}>{sec.desc} · {aulasComConteudo.length} item{aulasComConteudo.length !== 1 ? 's' : ''}</p>
          </div>

          {aulasComConteudo.length === 0 ? (
            <div style={{
              background: 'white', borderRadius: 20, padding: 64,
              textAlign: 'center', border: '2px dashed #e2e8f0'
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
              <p style={{ color: '#94a3b8' }}>Nenhum conteúdo ainda.<br />Gere uma aula para ver aqui.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {aulasComConteudo.map(aula => (
                <div
                  key={aula.id}
                  onClick={() => router.push(`/aula/${aula.id}`)}
                  style={{
                    background: 'white', borderRadius: 14,
                    padding: '18px 22px', cursor: 'pointer',
                    border: '1px solid #e8eef8',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    transition: 'box-shadow 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(21,38,100,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: '#eff6ff', fontSize: 18,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {iconesDisciplina[aula.disciplina] || '📖'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f2b5b', fontSize: 14 }}>{aula.titulo || aula.tema}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>{aula.disciplina} · {aula.nivel} · {aula.duracao}</div>
                    </div>
                  </div>
                  <span style={{ color: '#1a56db', fontSize: 18 }}>→</span>
                </div>
              ))}
            </div>
          )}
        </>
      )
    }

    if (activeNav === 'plano') {
      return (
        <>
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f2b5b', margin: 0 }}>Plano & Assinatura</h1>
          </div>
          <div style={{
            background: 'white', borderRadius: 20, padding: 32,
            border: '1px solid #e8eef8', maxWidth: 500
          }}>
            <div style={{ fontSize: 14, color: '#64748b', marginBottom: 8 }}>Plano atual</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#0f2b5b', marginBottom: 4 }}>{nomePlano}</div>
            <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 24 }}>
              {stats.aulasUsadas} de {stats.limitesMes} aulas usadas este mês
            </div>
            <a
              href="/planos"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg, #152664, #1a56db)',
                color: 'white', borderRadius: 10, padding: '12px 24px',
                fontWeight: 700, fontSize: 14, textDecoration: 'none'
              }}
            >
              Ver planos e fazer upgrade →
            </a>
          </div>
        </>
      )
    }

    return null
  }

  const selectStyle = {
    width: '100%', padding: '10px 14px',
    border: '1.5px solid #e2e8f0', borderRadius: 10,
    fontSize: 14, outline: 'none', background: 'white',
    color: '#374151', cursor: 'pointer', boxSizing: 'border-box'
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f7ff', fontFamily: "'Mulish', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(21,38,100,0.15); border-radius: 4px; }
      `}</style>

      {/* SIDEBAR */}
      <aside style={{
        width: 224, background: '#152664', minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, background: 'rgba(203,231,254,0.15)',
              borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M20 3C14 5 10 11 7 16C6 18 5 21 5 21C7 19 9 18 11 17.5C11 17.5 10 14 14 10C17 7 20 3 20 3Z" fill="#cbe7fe" />
              </svg>
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, color: 'white', letterSpacing: '-0.01em' }}>Prepara Aula</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          {navItems.map((item, i) => {
            const isSection = item.section
            const prevItem = navItems[i - 1]
            const showSection = isSection && (!prevItem || prevItem.section !== item.section)

            return (
              <div key={item.id}>
                {showSection && (
                  <div style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
                    color: 'rgba(255,255,255,0.3)', padding: '16px 8px 8px',
                    textTransform: 'uppercase'
                  }}>
                    {item.section}
                  </div>
                )}
                <button
                  onClick={() => {
                    if (item.id === 'sair') { handleLogout(); return }
                    setActiveNav(item.id)
                  }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 10px', borderRadius: 9, border: 'none',
                    background: activeNav === item.id ? 'rgba(255,255,255,0.12)' : 'transparent',
                    color: activeNav === item.id ? 'white' : 'rgba(255,255,255,0.55)',
                    fontSize: 13.5, fontWeight: activeNav === item.id ? 700 : 500,
                    cursor: 'pointer', marginBottom: 2,
                    transition: 'all 0.15s', textAlign: 'left'
                  }}
                  onMouseEnter={e => { if (activeNav !== item.id) e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
                  onMouseLeave={e => { if (activeNav !== item.id) e.currentTarget.style.background = 'transparent' }}
                >
                  <span style={{ fontSize: 15, width: 18, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && (
                    <span style={{
                      background: '#1a56db', color: 'white',
                      fontSize: 10, fontWeight: 700, padding: '2px 7px',
                      borderRadius: 100, letterSpacing: '0.05em'
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              </div>
            )
          })}
        </nav>

        {/* Usuário */}
        <div style={{
          padding: '16px 16px', borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', gap: 10
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'rgba(203,231,254,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#cbe7fe', flexShrink: 0
          }}>
            {iniciais}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {usuario?.nome || 'Professor'}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Plano {nomePlano}</div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, marginLeft: 224, minHeight: '100vh' }}>
        {/* Topbar */}
        <header style={{
          background: 'white', height: 64, padding: '0 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid #e8eef8', position: 'sticky', top: 0, zIndex: 50
        }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 15 }}>🔍</span>
            <input
              type="text"
              placeholder="Buscar aulas, disciplinas..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              onFocus={() => { if (busca) setActiveNav('minhas-aulas') }}
              style={{
                width: '100%', height: 40, paddingLeft: 40, paddingRight: 16,
                border: '1.5px solid #e8eef8', borderRadius: 10,
                fontSize: 14, outline: 'none', background: '#f8faff'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              background: '#eff6ff', color: '#1a56db',
              borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 700
            }}>
              {stats.aulasUsadas}/{stats.limitesMes} aulas
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: '#152664', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: 'white', cursor: 'pointer'
            }}>
              {iniciais}
            </div>
          </div>
        </header>

        {/* Conteúdo */}
        <div style={{ padding: '32px 36px', maxWidth: 1100 }}>
          {renderConteudo()}
        </div>
      </main>
    </div>
  )
}

function TabelaAulas({ aulas, router, icones, formatarData }) {
  return (
    <div style={{
      background: 'white', borderRadius: 16,
      border: '1px solid #e8eef8', overflow: 'hidden'
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 120px 80px 160px 90px',
        padding: '10px 22px', borderBottom: '1px solid #f1f5f9'
      }}>
        {['AULA', 'STATUS', 'SLIDES', 'CRIADA EM', ''].map((h, i) => (
          <div key={i} style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#94a3b8', textTransform: 'uppercase' }}>
            {h}
          </div>
        ))}
      </div>
      {aulas.map((aula, i) => {
        let qtdSlides = 0
        try { const s = JSON.parse(aula.slides || '[]'); qtdSlides = Array.isArray(s) ? s.length : 0 } catch {}
        const status = aula.status || 'concluida'
        const statusCor = { concluida: '#10b981', rascunho: '#f59e0b', editando: '#3b82f6' }[status] || '#10b981'
        const statusLabel = { concluida: 'Concluída', rascunho: 'Rascunho', editando: 'Editando' }[status] || 'Concluída'

        return (
          <div
            key={aula.id}
            onClick={() => router.push(`/aula/${aula.id}`)}
            style={{
              display: 'grid', gridTemplateColumns: '1fr 120px 80px 160px 90px',
              padding: '14px 22px', cursor: 'pointer',
              borderBottom: i < aulas.length - 1 ? '1px solid #f8faff' : 'none',
              transition: 'background 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#f8faff'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9, background: '#eff6ff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0
              }}>
                {icones[aula.disciplina] || '📖'}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#0f2b5b', fontSize: 13.5 }}>{aula.titulo || aula.tema || 'Sem título'}</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>{aula.disciplina} · {aula.nivel} · {aula.duracao}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{
                background: statusCor + '18', color: statusCor,
                borderRadius: 100, padding: '3px 10px',
                fontSize: 11, fontWeight: 700
              }}>
                ● {statusLabel}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 13, color: '#64748b', fontWeight: 600 }}>
              {qtdSlides > 0 ? `${qtdSlides} slides` : '—'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 12, color: '#94a3b8' }}>
              {formatarData(aula.created_at)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-end' }}>
              <span style={{ color: '#94a3b8', fontSize: 16, cursor: 'pointer' }} title="Editar">✎</span>
              <span style={{ color: '#94a3b8', fontSize: 16, cursor: 'pointer' }} title="Baixar">↓</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}