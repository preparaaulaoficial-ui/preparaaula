'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const DISCIPLINAS_BASICO = [
  'Matemática','Português','Ciências','História','Geografia',
  'Física','Química','Biologia','Inglês','Espanhol',
  'Artes','Educação Física','Filosofia','Sociologia','Religião',
]
const DISCIPLINAS_SUPERIOR = [
  'Administração','Contabilidade','Direito','Economia','Engenharia',
  'Medicina','Psicologia','Pedagogia','Nutrição','Arquitetura',
  'Tecnologia da Informação','Comunicação','Letras','Enfermagem','Fisioterapia',
]

const TURMAS = [
  { grupo:'Educação Infantil', opcoes:['Maternal','Jardim I','Jardim II','Pré-escola'] },
  { grupo:'Fundamental I', opcoes:['1º ano — EF','2º ano — EF','3º ano — EF','4º ano — EF','5º ano — EF'] },
  { grupo:'Fundamental II', opcoes:['6º ano — EF','7º ano — EF','8º ano — EF','9º ano — EF'] },
  { grupo:'Ensino Médio', opcoes:['1º ano — EM','2º ano — EM','3º ano — EM'] },
  { grupo:'EJA', opcoes:['EJA — Fase I','EJA — Fase II','EJA — Fase III'] },
  { grupo:'Ensino Superior', opcoes:[
    'Superior — 1º Período','Superior — 2º Período','Superior — 3º Período',
    'Superior — 4º Período','Superior — 5º Período','Superior — 6º Período',
    'Superior — 7º Período','Superior — 8º Período',
    'Pós-graduação','Mestrado','Doutorado',
  ]},
  { grupo:'Técnico', opcoes:['Técnico — Módulo I','Técnico — Módulo II','Técnico — Módulo III'] },
]

const DURACOES = ['20 minutos','30 minutos','40 minutos','50 minutos','1 hora','1h30','2 horas']

const ICONE_DISCIPLINA = {
  'Matemática':'📐','Português':'📖','Ciências':'🔬','História':'🏛️','Geografia':'🌍',
  'Física':'⚡','Química':'🧪','Biologia':'🧬','Inglês':'🇺🇸','Espanhol':'🇪🇸',
  'Artes':'🎨','Educação Física':'⚽','Filosofia':'🦉','Sociologia':'👥','Religião':'✝️',
  'Direito':'⚖️','Medicina':'🩺','Engenharia':'⚙️','Administração':'📊','Psicologia':'🧠',
  'Pedagogia':'🎓','Nutrição':'🥗','Arquitetura':'🏗️','Tecnologia da Informação':'💻',
}

const COR_DISCIPLINA = {
  'Matemática':'#3b82f6','Português':'#8b5cf6','Ciências':'#10b981','História':'#f59e0b',
  'Geografia':'#06b6d4','Física':'#6366f1','Química':'#ec4899','Biologia':'#22c55e',
  'Inglês':'#ef4444','Artes':'#f97316','Educação Física':'#14b8a6','Filosofia':'#a855f7',
}

const LOGO_SIDEBAR = "data:image/png;base64,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"
const LOGO_LIGHT = "data:image/png;base64,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"

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
  const [stats, setStats] = useState({ aulasMes:0, slidesGerados:0, horasEconomizadas:0, exerciciosGerados:0, limitesMes:20, aulasUsadas:0 })

  const [form, setForm] = useState({
    descricao: '',
    disciplina: 'Ciências',
    turma: '8º ano — EF',
    duracao: '50 minutos',
    estilo_turma: '',
    objetivos: '',
    recursos: [],
    perfil_turma: '',
    metodologia: '',
    objetivo_aula: '',
  })

  useEffect(() => { carregarDados() }, [])

  async function carregarDados() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data: perfil } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (!perfil?.plano_ativo) { router.push('/planos'); return }

    setUsuario(perfil)

    const { data: minhasAulas } = await supabase
      .from('aulas').select('*').eq('user_id', user.id).order('created_at', { ascending: false })

    const lista = minhasAulas || []
    setAulas(lista)

    const mesAtual = new Date().toISOString().slice(0,7)
    const aulasMes = lista.filter(a => a.created_at?.slice(0,7) === mesAtual).length

    let totalSlides = 0, totalEx = 0
    for (const a of lista) {
      try { const s = JSON.parse(a.slides||'[]'); totalSlides += Array.isArray(s)?s.length:0 } catch {}
      try { const e = JSON.parse(a.exercicios||'[]'); totalEx += Array.isArray(e)?e.length:0 } catch {}
    }

    const limites = { starter:20, profissional:35, escola:60 }
    const limite = limites[perfil?.plano] || 20
    const renovacao = new Date(); renovacao.setMonth(renovacao.getMonth()+1,1)

    setStats({
      aulasMes, slidesGerados: totalSlides,
      horasEconomizadas: Math.round(lista.length*1.5),
      exerciciosGerados: totalEx,
      limitesMes: limite,
      aulasUsadas: perfil?.aulas_mes || 0,
      renovacao: renovacao.toLocaleDateString('pt-BR',{day:'numeric',month:'long'}),
    })
    setLoading(false)
  }

  async function handleGerarAula() {
    if (!form.descricao.trim()) { alert('Descreva sua aula!'); return }
    if (stats.aulasUsadas >= stats.limitesMes) { alert(`Limite de ${stats.limitesMes} aulas atingido. Faça upgrade!`); return }

    setGerando(true); setProgresso(0)
    const iv = setInterval(() => setProgresso(p => p >= 85 ? (clearInterval(iv),p) : p + Math.random()*7), 900)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/gerar-aula', {
        method: 'POST',
        headers: { 'Content-Type':'application/json', 'Authorization':`Bearer ${session.access_token}` },
        body: JSON.stringify({
          tema: form.descricao,
          disciplina: form.disciplina,
          nivel: form.turma,
          duracao: form.duracao,
          turma: form.turma,
          estilo_turma: form.estilo_turma,
          objetivos_adicionais: form.objetivos,
          recursos_disponiveis: form.recursos,
          perfil_turma: form.perfil_turma,
          metodologia: form.metodologia,
          objetivo_aula: form.objetivo_aula,
          quantidade_slides: 14,
        })
      })

      clearInterval(iv); setProgresso(100)
      const data = await res.json()

      if (!res.ok || data.erro) { alert('Erro: ' + (data.erro||'Tente novamente')); setGerando(false); setProgresso(0); return }

      setTimeout(() => {
        setGerando(false); setProgresso(0)
        if (data.aula?.id) router.push(`/aula/${data.aula.id}`)
        else { carregarDados(); setActiveNav('minhas-aulas') }
      }, 500)
    } catch {
      clearInterval(iv)
      alert('Erro de conexão.')
      setGerando(false); setProgresso(0)
    }
  }

  async function handleLogout() { await supabase.auth.signOut(); router.push('/login') }

  const aulasFiltradas = aulas
    .filter(a => filtro==='concluidas'?(a.status==='concluida'||!a.status):filtro==='rascunhos'?a.status==='rascunho':true)
    .filter(a => !busca || (a.titulo||a.tema||'').toLowerCase().includes(busca.toLowerCase()) || (a.disciplina||'').toLowerCase().includes(busca.toLowerCase()))

  const getHora = () => { const h=new Date().getHours(); return h<12?'Bom dia':h<18?'Boa tarde':'Boa noite' }
  const formatData = (iso) => {
    if(!iso) return ''
    const d=new Date(iso), hoje=new Date(), ontem=new Date()
    ontem.setDate(ontem.getDate()-1)
    const t = d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})
    if(d.toDateString()===hoje.toDateString()) return `Hoje, ${t}`
    if(d.toDateString()===ontem.toDateString()) return `Ontem, ${t}`
    return d.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'})+', '+t
  }

  const nome1 = usuario?.nome?.split(' ')[0] || 'Professor'
  const iniciais = (usuario?.nome||'GC').split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase()
  const nomePlano = {starter:'Starter',profissional:'Profissional',escola:'Escola'}[usuario?.plano]||'Starter'
  const pct = Math.min((stats.aulasUsadas/stats.limitesMes)*100,100)

  if (loading) return (
    <div style={{minHeight:'100vh',background:'#f0f4ff',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'sans-serif'}}>
      <div style={{textAlign:'center'}}>
        <img src={LOGO_LIGHT} style={{width:64,height:64,marginBottom:16,borderRadius:16}} />
        <p style={{color:'#152664',fontWeight:700,fontSize:16}}>Carregando...</p>
      </div>
    </div>
  )

  const sS = { width:'100%',padding:'10px 14px',border:'1.5px solid #e2e8f0',borderRadius:10,fontSize:14,outline:'none',background:'white',color:'#374151',boxSizing:'border-box' }

  const navSections = [
    { label:'PRINCIPAL', items:[
      { id:'inicio', label:'Início', emoji:'🏠' },
      { id:'nova-aula', label:'Nova Aula', emoji:'✨', badge:'IA' },
      { id:'minhas-aulas', label:'Minhas Aulas', emoji:'📁' },
    ]},
    { label:'FERRAMENTAS', items:[
      { id:'slides', label:'Slides', emoji:'📊' },
      { id:'planos-aula', label:'Planos de Aula', emoji:'📋' },
      { id:'exercicios', label:'Exercícios', emoji:'✏️' },
      { id:'roteiros', label:'Roteiros', emoji:'🎙️' },
    ]},
    { label:'CONTA', items:[
      { id:'plano', label:'Plano & Assinatura', emoji:'💳' },
      { id:'config', label:'Configurações', emoji:'⚙️' },
    ]},
  ]

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#f4f7ff',fontFamily:"'Mulish',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:rgba(21,38,100,0.15);border-radius:4px;}
        .nav-btn:hover{background:rgba(255,255,255,0.1)!important;}
        .aula-row:hover{background:#f8faff!important;}
        .stat-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(21,38,100,0.1)!important;}
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside style={{width:232,background:'#152664',minHeight:'100vh',display:'flex',flexDirection:'column',position:'fixed',left:0,top:0,bottom:0,zIndex:100}}>
        {/* Logo */}
        <div style={{padding:'22px 18px 18px',borderBottom:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',gap:10}}>
          <img src={LOGO_SIDEBAR} alt="Prepara Aula" style={{width:36,height:36,borderRadius:10,objectFit:'cover'}} />
          <span style={{fontSize:16,fontWeight:800,color:'white',letterSpacing:'-0.01em'}}>Prepara Aula</span>
        </div>

        {/* Nav */}
        <nav style={{flex:1,padding:'12px 10px',overflowY:'auto'}}>
          {navSections.map(sec => (
            <div key={sec.label}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.12em',color:'rgba(255,255,255,0.3)',padding:'14px 10px 6px',textTransform:'uppercase'}}>
                {sec.label}
              </div>
              {sec.items.map(item => (
                <button key={item.id}
                  className="nav-btn"
                  onClick={() => { if(item.id==='sair'){handleLogout();return} setActiveNav(item.id) }}
                  style={{
                    width:'100%',display:'flex',alignItems:'center',gap:10,
                    padding:'9px 10px',borderRadius:9,border:'none',marginBottom:2,
                    background: activeNav===item.id ? 'rgba(255,255,255,0.13)' : 'transparent',
                    color: activeNav===item.id ? 'white' : 'rgba(255,255,255,0.6)',
                    fontSize:13.5,fontWeight:activeNav===item.id?700:500,
                    cursor:'pointer',textAlign:'left',transition:'all 0.15s',
                    borderLeft: activeNav===item.id ? '3px solid rgba(203,231,254,0.7)' : '3px solid transparent',
                  }}
                >
                  <span style={{fontSize:16,width:20,textAlign:'center',flexShrink:0}}>{item.emoji}</span>
                  <span style={{flex:1}}>{item.label}</span>
                  {item.badge && (
                    <span style={{background:'#1a56db',color:'white',fontSize:9,fontWeight:800,padding:'2px 7px',borderRadius:100,letterSpacing:'0.05em'}}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Usuário */}
        <div style={{padding:'14px 16px',borderTop:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:34,height:34,borderRadius:'50%',background:'rgba(203,231,254,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:'#cbe7fe',flexShrink:0}}>
            {iniciais}
          </div>
          <div style={{overflow:'hidden',flex:1}}>
            <div style={{fontSize:13,fontWeight:700,color:'white',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{usuario?.nome||'Professor'}</div>
            <div style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Plano {nomePlano}</div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{flex:1,marginLeft:232,minHeight:'100vh',display:'flex',flexDirection:'column'}}>
        {/* Topbar */}
        <header style={{background:'white',height:64,padding:'0 32px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid #e8eef8',position:'sticky',top:0,zIndex:50,gap:16}}>
          <div style={{position:'relative',flex:1,maxWidth:380}}>
            <span style={{position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',color:'#94a3b8',fontSize:14}}>🔍</span>
            <input type="text" placeholder="Buscar aulas, disciplinas..."
              value={busca} onChange={e=>{setBusca(e.target.value);if(e.target.value)setActiveNav('minhas-aulas')}}
              style={{width:'100%',height:38,paddingLeft:38,paddingRight:14,border:'1.5px solid #e8eef8',borderRadius:10,fontSize:13,outline:'none',background:'#f8faff'}}
            />
          </div>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div style={{background:'#eff6ff',color:'#1a56db',borderRadius:8,padding:'5px 12px',fontSize:12,fontWeight:700}}>
              {stats.aulasUsadas}/{stats.limitesMes} aulas
            </div>
            <div style={{width:36,height:36,borderRadius:'50%',background:'#152664',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:'white',cursor:'pointer'}}>
              {iniciais}
            </div>
          </div>
        </header>

        {/* Conteúdo + Painel Lateral */}
        <div style={{display:'flex',flex:1,gap:0}}>
          {/* Área principal */}
          <div style={{flex:1,padding:'28px 32px',minWidth:0}}>
            {renderConteudo()}
          </div>

          {/* Painel lateral direito — só na home/nova aula */}
          {(activeNav==='inicio'||activeNav==='nova-aula') && (
            <aside style={{width:280,padding:'28px 20px 28px 0',flexShrink:0}}>
              {/* Uso do plano */}
              <div style={{background:'white',borderRadius:16,padding:'20px 20px',border:'1px solid #e8eef8',marginBottom:16,boxShadow:'0 2px 12px rgba(21,38,100,0.05)'}}>
                <div style={{fontWeight:800,color:'#0f2b5b',fontSize:15,marginBottom:4}}>Uso do plano</div>
                <div style={{fontSize:12,color:'#94a3b8',marginBottom:16}}>Ciclo atual · Renova em 1º de {stats.renovacao?.split(' de ')[1]||'abril'}</div>

                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                  <span style={{fontSize:13,color:'#374151',fontWeight:600}}>Aulas criadas</span>
                  <span style={{fontSize:13,fontWeight:800,color:'#0f2b5b'}}>{stats.aulasUsadas} / {stats.limitesMes}</span>
                </div>
                <div style={{background:'#f1f5f9',borderRadius:100,height:7,overflow:'hidden',marginBottom:14}}>
                  <div style={{
                    height:'100%',borderRadius:100,
                    background: pct>80?'linear-gradient(90deg,#f59e0b,#ef4444)':'linear-gradient(90deg,#152664,#1a56db)',
                    width:`${pct}%`,transition:'width 0.5s ease'
                  }}/>
                </div>

                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{background:'#eff6ff',color:'#1a56db',borderRadius:100,padding:'4px 12px',fontSize:12,fontWeight:700}}>{nomePlano}</span>
                  <button onClick={()=>router.push('/planos')} style={{fontSize:13,color:'#1a56db',fontWeight:700,background:'none',border:'none',cursor:'pointer'}}>
                    Fazer upgrade →
                  </button>
                </div>
              </div>

              {/* Dicas rápidas */}
              <div style={{background:'white',borderRadius:16,padding:'20px',border:'1px solid #e8eef8',boxShadow:'0 2px 12px rgba(21,38,100,0.05)'}}>
                <div style={{fontWeight:800,color:'#0f2b5b',fontSize:15,marginBottom:4}}>Dicas rápidas</div>
                <div style={{fontSize:12,color:'#94a3b8',marginBottom:16}}>Para melhores resultados</div>

                {[
                  { emoji:'🎯', titulo:'Seja específico no prompt', desc:'Mencione tema, turma, tempo e objetivos da aula.' },
                  { emoji:'💬', titulo:'Informe o estilo da turma', desc:'Ex: "turma tímida" ou "gostam de debates".' },
                  { emoji:'📌', titulo:'Inclua a BNCC desejada', desc:'Cite a habilidade (EF08CI08) para mais precisão.' },
                ].map((d,i) => (
                  <div key={i} style={{display:'flex',gap:12,marginBottom:i<2?16:0}}>
                    <div style={{width:38,height:38,background:'#f0f4ff',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>
                      {d.emoji}
                    </div>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:'#0f2b5b',marginBottom:2}}>{d.titulo}</div>
                      <div style={{fontSize:12,color:'#94a3b8',lineHeight:1.5}}>{d.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          )}
        </div>
      </main>
    </div>
  )

  function renderConteudo() {
    if (activeNav==='inicio'||activeNav==='nova-aula') {
      return (
        <>
          {/* Cabeçalho */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24}}>
            <div>
              <h1 style={{fontSize:24,fontWeight:800,color:'#0f2b5b',margin:'0 0 4px'}}>{getHora()}, {nome1} 👋</h1>
              <p style={{fontSize:13,color:'#94a3b8',margin:0}}>
                {new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})} · Plano {nomePlano}
              </p>
            </div>
            <button onClick={()=>setActiveNav('nova-aula')} style={{
              background:'linear-gradient(135deg,#152664,#1a56db)',color:'white',border:'none',
              borderRadius:12,padding:'11px 22px',fontWeight:700,fontSize:14,cursor:'pointer',
              display:'flex',alignItems:'center',gap:8,boxShadow:'0 4px 16px rgba(21,38,100,0.25)'
            }}>+ Nova aula</button>
          </div>

          {/* Stats — só se tiver aulas */}
          {aulas.length > 0 && (
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:24}}>
              {[
                {label:'Aulas este mês',value:stats.aulasMes,icon:'📊',cor:'#3b82f6'},
                {label:'Slides gerados',value:stats.slidesGerados,icon:'🖼️',cor:'#8b5cf6'},
                {label:'Horas economizadas',value:`${stats.horasEconomizadas}h`,icon:'⏱️',cor:'#10b981'},
                {label:'Exercícios gerados',value:stats.exerciciosGerados,icon:'📝',cor:'#f59e0b'},
              ].map((s,i)=>(
                <div key={i} className="stat-card" style={{
                  background:'white',borderRadius:14,padding:'18px 20px',
                  border:'1px solid #e8eef8',transition:'all 0.2s',boxShadow:'0 2px 8px rgba(21,38,100,0.04)'
                }}>
                  <div style={{fontSize:22,marginBottom:8}}>{s.icon}</div>
                  <div style={{fontSize:26,fontWeight:800,color:'#0f2b5b'}}>{s.value}</div>
                  <div style={{fontSize:12,color:'#94a3b8',marginTop:3}}>{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Formulário */}
          <div style={{background:'white',borderRadius:20,border:'1px solid #e8eef8',marginBottom:24,boxShadow:'0 2px 12px rgba(21,38,100,0.05)',overflow:'hidden'}}>

            {/* Header do card */}
            <div style={{padding:'20px 24px 0'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18}}>
                <div>
                  <h2 style={{fontSize:16,fontWeight:800,color:'#0f2b5b',margin:'0 0 2px'}}>✦ Nova aula com IA</h2>
                  <p style={{fontSize:13,color:'#94a3b8',margin:0}}>Descreva sua aula e deixe a IA fazer o resto.</p>
                </div>
                <div style={{display:'flex',gap:6}}>
                  {[{l:'Slides',i:'📊'},{l:'BNCC',i:'📋'},{l:'Roteiro',i:'🎙️'},{l:'Exercícios',i:'📝'}].map(c=>(
                    <div key={c.l} style={{background:'#f0f4ff',color:'#1a56db',borderRadius:100,padding:'4px 10px',fontSize:11,fontWeight:700,display:'flex',alignItems:'center',gap:4}}>
                      {c.i} {c.l}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tema da aula */}
              <div style={{marginBottom:16}}>
                <label style={{fontSize:11,fontWeight:700,letterSpacing:'0.09em',textTransform:'uppercase',color:'#152664',display:'block',marginBottom:7}}>
                  📌 Tema da aula
                </label>
                <textarea
                  placeholder="Ex: Sistema circulatório para o 8º ano, 50 minutos. Turma participativa, gosta de experimentos práticos..."
                  value={form.descricao}
                  onChange={e=>setForm({...form,descricao:e.target.value})}
                  rows={3}
                  style={{width:'100%',padding:'13px 15px',border:'1.5px solid #e2e8f0',borderRadius:12,fontSize:14,outline:'none',resize:'none',fontFamily:'inherit',color:'#374151',boxSizing:'border-box',lineHeight:1.6,background:'white'}}
                  onFocus={e=>e.target.style.borderColor='#1a56db'}
                  onBlur={e=>e.target.style.borderColor='#e2e8f0'}
                />
              </div>

              {/* Selects */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:0}}>
                <div>
                  <label style={{fontSize:11,fontWeight:700,letterSpacing:'0.07em',textTransform:'uppercase',color:'#152664',display:'block',marginBottom:6}}>🎓 Disciplina</label>
                  <select value={form.disciplina} onChange={e=>setForm({...form,disciplina:e.target.value})} style={sS}>
                    <optgroup label="─ Ensino Básico ─">
                      {DISCIPLINAS_BASICO.map(d=><option key={d}>{d}</option>)}
                    </optgroup>
                    <optgroup label="─ Ensino Superior ─">
                      {DISCIPLINAS_SUPERIOR.map(d=><option key={d}>{d}</option>)}
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label style={{fontSize:11,fontWeight:700,letterSpacing:'0.07em',textTransform:'uppercase',color:'#152664',display:'block',marginBottom:6}}>👥 Turma / Série</label>
                  <select value={form.turma} onChange={e=>setForm({...form,turma:e.target.value})} style={sS}>
                    {TURMAS.map(g=>(
                      <optgroup key={g.grupo} label={`─ ${g.grupo} ─`}>
                        {g.opcoes.map(o=><option key={o}>{o}</option>)}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{fontSize:11,fontWeight:700,letterSpacing:'0.07em',textTransform:'uppercase',color:'#152664',display:'block',marginBottom:6}}>⏱️ Duração</label>
                  <select value={form.duracao} onChange={e=>setForm({...form,duracao:e.target.value})} style={sS}>
                    {DURACOES.map(d=><option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Divisor com texto */}
            <div style={{display:'flex',alignItems:'center',gap:12,padding:'18px 24px'}}>
              <div style={{flex:1,height:1,background:'#f1f5f9'}}/>
              <span style={{fontSize:11,fontWeight:700,color:'#94a3b8',letterSpacing:'0.08em',textTransform:'uppercase',whiteSpace:'nowrap'}}>
                Personalizar aula
              </span>
              <div style={{flex:1,height:1,background:'#f1f5f9'}}/>
            </div>

            {/* Perguntas direcionadoras — grid de cards */}
            <div style={{padding:'0 24px 20px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>

              {/* Perfil da turma */}
              <div style={{background:'#f8faff',borderRadius:14,padding:'14px 16px',border:'1px solid #eef2ff'}}>
                <label style={{fontSize:11,fontWeight:700,color:'#152664',display:'block',marginBottom:10,letterSpacing:'0.06em',textTransform:'uppercase'}}>
                  💬 Como é sua turma?
                </label>
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                  {['Participativa','Tímida','Agitada','Focada','Diversificada','Tem dificuldades'].map(o=>{
                    const sel=form.perfil_turma===o
                    return (
                      <button key={o} onClick={()=>setForm({...form,perfil_turma:sel?'':o})}
                        style={{padding:'5px 11px',borderRadius:100,fontSize:12,fontWeight:600,cursor:'pointer',border:sel?'1.5px solid #1a56db':'1.5px solid #dde4f0',background:sel?'#152664':'white',color:sel?'white':'#64748b',transition:'all 0.15s'}}>
                        {o}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Metodologia */}
              <div style={{background:'#f8faff',borderRadius:14,padding:'14px 16px',border:'1px solid #eef2ff'}}>
                <label style={{fontSize:11,fontWeight:700,color:'#152664',display:'block',marginBottom:10,letterSpacing:'0.06em',textTransform:'uppercase'}}>
                  🧪 Metodologia preferida?
                </label>
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                  {['Expositiva','Debate','Experimento','Gamificação','Trabalho em grupo','Resolução de problemas'].map(o=>{
                    const sel=form.metodologia===o
                    return (
                      <button key={o} onClick={()=>setForm({...form,metodologia:sel?'':o})}
                        style={{padding:'5px 11px',borderRadius:100,fontSize:12,fontWeight:600,cursor:'pointer',border:sel?'1.5px solid #1a56db':'1.5px solid #dde4f0',background:sel?'#152664':'white',color:sel?'white':'#64748b',transition:'all 0.15s'}}>
                        {o}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Objetivo da aula */}
              <div style={{background:'#f8faff',borderRadius:14,padding:'14px 16px',border:'1px solid #eef2ff'}}>
                <label style={{fontSize:11,fontWeight:700,color:'#152664',display:'block',marginBottom:10,letterSpacing:'0.06em',textTransform:'uppercase'}}>
                  🎯 Objetivo principal?
                </label>
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                  {['Introduzir o tema','Aprofundar conteúdo','Revisar para prova','Fixar aprendizado','Avaliar conhecimento'].map(o=>{
                    const sel=form.objetivo_aula===o
                    return (
                      <button key={o} onClick={()=>setForm({...form,objetivo_aula:sel?'':o})}
                        style={{padding:'5px 11px',borderRadius:100,fontSize:12,fontWeight:600,cursor:'pointer',border:sel?'1.5px solid #1a56db':'1.5px solid #dde4f0',background:sel?'#152664':'white',color:sel?'white':'#64748b',transition:'all 0.15s'}}>
                        {o}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Recursos */}
              <div style={{background:'#f8faff',borderRadius:14,padding:'14px 16px',border:'1px solid #eef2ff'}}>
                <label style={{fontSize:11,fontWeight:700,color:'#152664',display:'block',marginBottom:10,letterSpacing:'0.06em',textTransform:'uppercase'}}>
                  🖥️ Recursos disponíveis?
                </label>
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                  {['Projetor','Quadro branco','Laboratório','Computadores','Tablets','Só impresso'].map(r=>{
                    const sel=form.recursos.includes(r)
                    return (
                      <button key={r} onClick={()=>setForm({...form,recursos:sel?form.recursos.filter(x=>x!==r):[...form.recursos,r]})}
                        style={{padding:'5px 11px',borderRadius:100,fontSize:12,fontWeight:600,cursor:'pointer',border:sel?'1.5px solid #1a56db':'1.5px solid #dde4f0',background:sel?'#152664':'white',color:sel?'white':'#64748b',transition:'all 0.15s'}}>
                        {r}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Habilidade BNCC */}
              <div style={{background:'#f8faff',borderRadius:14,padding:'14px 16px',border:'1px solid #eef2ff'}}>
                <label style={{fontSize:11,fontWeight:700,color:'#152664',display:'block',marginBottom:8,letterSpacing:'0.06em',textTransform:'uppercase'}}>
                  📌 Habilidade BNCC <span style={{color:'#94a3b8',fontWeight:400,textTransform:'none',fontSize:11}}>(opcional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: EF08CI08, EM13CNT101..."
                  value={form.objetivos}
                  onChange={e=>setForm({...form,objetivos:e.target.value})}
                  style={{...sS,background:'white',height:38}}
                />
              </div>

              {/* Observações livres */}
              <div style={{background:'#f8faff',borderRadius:14,padding:'14px 16px',border:'1px solid #eef2ff'}}>
                <label style={{fontSize:11,fontWeight:700,color:'#152664',display:'block',marginBottom:8,letterSpacing:'0.06em',textTransform:'uppercase'}}>
                  💡 Observações extras <span style={{color:'#94a3b8',fontWeight:400,textTransform:'none',fontSize:11}}>(opcional)</span>
                </label>
                <input
                  type="text"
                  placeholder='Ex: "incluir curiosidade histórica", "usar exemplos do cotidiano"'
                  value={form.estilo_turma}
                  onChange={e=>setForm({...form,estilo_turma:e.target.value})}
                  style={{...sS,background:'white',height:38}}
                />
              </div>
            </div>

            {/* Footer do card — botão */}
            <div style={{padding:'16px 24px',background:'#f8faff',borderTop:'1px solid #eef2ff',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div style={{fontSize:12,color:'#94a3b8'}}>
                {[form.perfil_turma,form.metodologia,form.objetivo_aula,...form.recursos].filter(Boolean).length > 0
                  ? <span style={{color:'#10b981',fontWeight:600}}>✓ {[form.perfil_turma,form.metodologia,form.objetivo_aula,...form.recursos].filter(Boolean).length} preferências selecionadas</span>
                  : 'Selecione preferências para uma aula mais personalizada'
                }
              </div>
              <button
                onClick={handleGerarAula}
                disabled={gerando||stats.aulasUsadas>=stats.limitesMes}
                style={{
                  background:gerando||stats.aulasUsadas>=stats.limitesMes?'#94a3b8':'linear-gradient(135deg,#152664,#1a56db)',
                  color:'white',border:'none',borderRadius:12,padding:'12px 28px',
                  fontWeight:700,fontSize:14,cursor:gerando?'wait':stats.aulasUsadas>=stats.limitesMes?'not-allowed':'pointer',
                  display:'flex',alignItems:'center',gap:8,
                  boxShadow:gerando?'none':'0 4px 16px rgba(21,38,100,0.25)',transition:'all 0.2s'
                }}
              >
                {gerando ? '⟳ Gerando...' : '⚡ Gerar aula'}
              </button>
            </div>

            {/* Progresso */}
            {gerando && (
              <div style={{padding:'0 24px 20px'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:7}}>
                  <span style={{fontSize:13,color:'#64748b'}}>
                    {progresso<30?'🤖 Analisando contexto...':progresso<60?'📊 Criando slides...':progresso<85?'📋 Montando plano...':'✅ Finalizando...'}
                  </span>
                  <span style={{fontSize:12,color:'#94a3b8'}}>{Math.round(progresso)}%</span>
                </div>
                <div style={{background:'#f1f5f9',borderRadius:100,height:6,overflow:'hidden'}}>
                  <div style={{height:'100%',borderRadius:100,background:'linear-gradient(90deg,#152664,#1a56db)',width:`${progresso}%`,transition:'width 0.4s ease'}}/>
                </div>
              </div>
            )}
          </div>

          {/* Aulas recentes */}
          {aulas.length > 0 && (
            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <h2 style={{fontSize:16,fontWeight:800,color:'#0f2b5b',margin:0}}>Aulas recentes</h2>
                <button onClick={()=>setActiveNav('minhas-aulas')} style={{fontSize:13,color:'#1a56db',background:'none',border:'none',cursor:'pointer',fontWeight:700}}>Ver todas →</button>
              </div>
              <TabelaAulas aulas={aulas.slice(0,5)} router={router} icones={ICONE_DISCIPLINA} cores={COR_DISCIPLINA} formatData={formatData}/>
            </div>
          )}

          {aulas.length===0 && (
            <div style={{background:'white',borderRadius:20,padding:52,textAlign:'center',border:'2px dashed #e2e8f0'}}>
              <div style={{fontSize:44,marginBottom:14}}>📝</div>
              <h3 style={{color:'#0f2b5b',marginBottom:8,fontSize:17}}>Nenhuma aula ainda</h3>
              <p style={{color:'#94a3b8',fontSize:14}}>Descreva sua aula acima e clique em <strong>Gerar aula</strong> para começar!</p>
            </div>
          )}
        </>
      )
    }

    if (activeNav==='minhas-aulas') return (
      <>
        <div style={{marginBottom:22}}>
          <h1 style={{fontSize:22,fontWeight:800,color:'#0f2b5b',margin:'0 0 4px'}}>Minhas Aulas</h1>
          <p style={{color:'#94a3b8',fontSize:13}}>{aulas.length} aula{aulas.length!==1?'s':''} criada{aulas.length!==1?'s':''}</p>
        </div>
        <div style={{display:'flex',gap:10,marginBottom:18,flexWrap:'wrap'}}>
          <input type="text" placeholder="Buscar..." value={busca} onChange={e=>setBusca(e.target.value)}
            style={{flex:1,minWidth:180,padding:'9px 14px',border:'1.5px solid #e2e8f0',borderRadius:10,fontSize:13,outline:'none'}}
          />
          {['todas','concluidas','rascunhos'].map(f=>(
            <button key={f} onClick={()=>setFiltro(f)} style={{
              padding:'9px 16px',borderRadius:10,border:'none',fontSize:13,fontWeight:600,cursor:'pointer',
              background:filtro===f?'#152664':'#f1f5f9',color:filtro===f?'white':'#64748b'
            }}>
              {f==='todas'?'Todas':f==='concluidas'?'Concluídas':'Rascunhos'}
            </button>
          ))}
        </div>
        {aulasFiltradas.length===0
          ? <div style={{textAlign:'center',padding:52,color:'#94a3b8'}}><div style={{fontSize:36,marginBottom:10}}>🔍</div><p>Nenhuma aula encontrada</p></div>
          : <TabelaAulas aulas={aulasFiltradas} router={router} icones={ICONE_DISCIPLINA} cores={COR_DISCIPLINA} formatData={formatData}/>
        }
      </>
    )

    const secoes = {
      slides:{titulo:'Slides',icon:'📊',campo:'slides'},
      'planos-aula':{titulo:'Planos de Aula',icon:'📋',campo:'plano_aula'},
      exercicios:{titulo:'Exercícios',icon:'✏️',campo:'exercicios'},
      roteiros:{titulo:'Roteiros',icon:'🎙️',campo:'atividade'},
    }

    if (secoes[activeNav]) {
      const sec = secoes[activeNav]
      const lista = aulas.filter(a=>a[sec.campo])
      return (
        <>
          <div style={{marginBottom:22}}>
            <h1 style={{fontSize:22,fontWeight:800,color:'#0f2b5b',margin:'0 0 4px'}}>{sec.icon} {sec.titulo}</h1>
            <p style={{color:'#94a3b8',fontSize:13}}>{lista.length} item{lista.length!==1?'s':''}</p>
          </div>
          {lista.length===0
            ? <div style={{background:'white',borderRadius:20,padding:52,textAlign:'center',border:'2px dashed #e2e8f0'}}><div style={{fontSize:36,marginBottom:12}}>📭</div><p style={{color:'#94a3b8'}}>Nenhum conteúdo ainda. Gere uma aula para ver aqui.</p></div>
            : <TabelaAulas aulas={lista} router={router} icones={ICONE_DISCIPLINA} cores={COR_DISCIPLINA} formatData={formatData}/>
          }
        </>
      )
    }

    if (activeNav==='plano') return (
      <>
        <h1 style={{fontSize:22,fontWeight:800,color:'#0f2b5b',marginBottom:24}}>Plano & Assinatura</h1>
        <div style={{background:'white',borderRadius:20,padding:32,border:'1px solid #e8eef8',maxWidth:480}}>
          <div style={{fontSize:13,color:'#94a3b8',marginBottom:6}}>Plano atual</div>
          <div style={{fontSize:28,fontWeight:800,color:'#0f2b5b',marginBottom:4}}>{nomePlano}</div>
          <div style={{fontSize:14,color:'#94a3b8',marginBottom:24}}>{stats.aulasUsadas} de {stats.limitesMes} aulas usadas este mês</div>
          <a href="/planos" style={{display:'inline-flex',alignItems:'center',gap:8,background:'linear-gradient(135deg,#152664,#1a56db)',color:'white',borderRadius:10,padding:'11px 22px',fontWeight:700,fontSize:14,textDecoration:'none'}}>
            Ver planos e fazer upgrade →
          </a>
        </div>
      </>
    )

    if (activeNav==='config') return (
      <>
        <h1 style={{fontSize:22,fontWeight:800,color:'#0f2b5b',marginBottom:24}}>Configurações</h1>
        <div style={{background:'white',borderRadius:20,padding:32,border:'1px solid #e8eef8',maxWidth:480}}>
          <div style={{fontSize:15,fontWeight:700,color:'#0f2b5b',marginBottom:4}}>Conta</div>
          <div style={{fontSize:13,color:'#94a3b8',marginBottom:20}}>Gerencie suas informações pessoais</div>
          <div style={{marginBottom:14}}>
            <label style={{fontSize:12,fontWeight:600,color:'#374151',display:'block',marginBottom:5}}>Nome</label>
            <input defaultValue={usuario?.nome||''} style={{width:'100%',padding:'10px 14px',border:'1.5px solid #e2e8f0',borderRadius:10,fontSize:14,outline:'none'}} readOnly/>
          </div>
          <div>
            <label style={{fontSize:12,fontWeight:600,color:'#374151',display:'block',marginBottom:5}}>E-mail</label>
            <input defaultValue={usuario?.email||''} style={{width:'100%',padding:'10px 14px',border:'1.5px solid #e2e8f0',borderRadius:10,fontSize:14,outline:'none'}} readOnly/>
          </div>
        </div>
      </>
    )

    return null
  }
}

function TabelaAulas({aulas,router,icones,cores,formatData}) {
  return (
    <div style={{background:'white',borderRadius:16,border:'1px solid #e8eef8',overflow:'hidden'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 110px 70px 150px 80px',padding:'10px 20px',borderBottom:'1px solid #f1f5f9'}}>
        {['AULA','STATUS','SLIDES','CRIADA EM',''].map((h,i)=>(
          <div key={i} style={{fontSize:10,fontWeight:700,letterSpacing:'0.08em',color:'#94a3b8',textTransform:'uppercase'}}>{h}</div>
        ))}
      </div>
      {aulas.map((aula,i)=>{
        let qtd=0; try{const s=JSON.parse(aula.slides||'[]');qtd=Array.isArray(s)?s.length:0}catch{}
        const status=aula.status||'concluida'
        const statusCor={concluida:'#10b981',rascunho:'#f59e0b',editando:'#3b82f6'}[status]||'#10b981'
        const statusLabel={concluida:'Concluída',rascunho:'Rascunho',editando:'Editando'}[status]||'Concluída'
        const cor=cores[aula.disciplina]||'#3b82f6'
        return (
          <div key={aula.id} className="aula-row"
            onClick={()=>router.push(`/aula/${aula.id}`)}
            style={{display:'grid',gridTemplateColumns:'1fr 110px 70px 150px 80px',padding:'13px 20px',cursor:'pointer',borderBottom:i<aulas.length-1?'1px solid #f8faff':'none',transition:'background 0.15s'}}
          >
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:36,height:36,borderRadius:9,background:cor+'18',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>
                {icones[aula.disciplina]||'📖'}
              </div>
              <div>
                <div style={{fontWeight:700,color:'#0f2b5b',fontSize:13}}>{aula.titulo||aula.tema||'Sem título'}</div>
                <div style={{fontSize:11,color:'#94a3b8'}}>{aula.disciplina} · {aula.nivel} · {aula.duracao}</div>
              </div>
            </div>
            <div style={{display:'flex',alignItems:'center'}}>
              <span style={{background:statusCor+'18',color:statusCor,borderRadius:100,padding:'3px 10px',fontSize:11,fontWeight:700}}>● {statusLabel}</span>
            </div>
            <div style={{display:'flex',alignItems:'center',fontSize:13,color:'#64748b',fontWeight:600}}>{qtd>0?`${qtd} slides`:'—'}</div>
            <div style={{display:'flex',alignItems:'center',fontSize:12,color:'#94a3b8'}}>{formatData(aula.created_at)}</div>
            <div style={{display:'flex',alignItems:'center',gap:10,justifyContent:'flex-end'}}>
              <span style={{color:'#94a3b8',fontSize:15,cursor:'pointer'}} title="Editar">✎</span>
              <span style={{color:'#94a3b8',fontSize:15,cursor:'pointer'}} title="Baixar">↓</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}