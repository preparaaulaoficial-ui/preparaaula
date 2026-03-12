'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser]           = useState(null)
  const [profile, setProfile]     = useState(null)
  const [prompt, setPrompt]       = useState('')
  const [disciplina, setDisciplina] = useState('Ciências')
  const [turma, setTurma]         = useState('8º ano — EF')
  const [duracao, setDuracao]     = useState('50 minutos')
  const [genModal, setGenModal]   = useState(false)
  const [activeStep, setActiveStep] = useState(-1)
  const [doneSteps, setDoneSteps] = useState([])
  const [progress, setProgress]   = useState(0)
  const [genDone, setGenDone]     = useState(false)
  const [filter, setFilter]       = useState('Todas')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const timerRef = useRef(null)

  const STEPS = [
    {icon:'🧠', label:'Analisando tema e contexto pedagógico'},
    {icon:'📊', label:'Gerando estrutura dos slides'},
    {icon:'📋', label:'Criando plano de aula e alinhamento BNCC'},
    {icon:'🎙️', label:'Elaborando roteiro do professor'},
    {icon:'📝', label:'Criando exercícios com gabarito'},
  ]
  const DURATIONS = [600, 900, 800, 700, 800]

  useEffect(() => {
    loadUser()
  }, [])

  async function loadUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    setUser(user)
    const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (prof && !prof.plano_ativo) { router.push('/planos'); return }
    setProfile(prof)
  }

  function openGenModal() {
    setGenModal(true)
    setActiveStep(-1)
    setDoneSteps([])
    setProgress(0)
    setGenDone(false)
    runStep(0)
  }

  function runStep(idx) {
    if (idx >= STEPS.length) {
      setActiveStep(-1)
      setProgress(100)
      setGenDone(true)
      timerRef.current = setTimeout(() => setGenModal(false), 1800)
      return
    }
    setActiveStep(idx)
    setProgress(Math.round(((idx + 0.5) / STEPS.length) * 100))
    timerRef.current = setTimeout(() => {
      setDoneSteps(d => [...d, idx])
      runStep(idx + 1)
    }, DURATIONS[idx])
  }

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const nomeUsuario = profile?.nome || user?.email?.split('@')[0] || 'Professor'
  const iniciais    = nomeUsuario.split(' ').slice(0,2).map(n => n[0]).join('').toUpperCase()
  const planoNome   = profile?.plano ? profile.plano.charAt(0).toUpperCase() + profile.plano.slice(1) : 'Starter'
  const aulasUsadas = profile?.aulas_mes || 0
  const aulasTotal  = profile?.plano === 'profissional' ? 35 : profile?.plano === 'escola' ? 60 : 20

  const aulas = [
    {icon:'🌿',bg:'#DCFCE7',nome:'Fotossíntese',info:'Ciências · 7º ano · 50 min',status:'done',slides:'18 slides',data:'Hoje, 09:14'},
    {icon:'📜',bg:'#FEF9C3',nome:'Revolução Industrial',info:'História · 9º ano · 50 min',status:'editing',slides:'20 slides',data:'Ontem, 15:32'},
    {icon:'🔢',bg:'#cbe7fe',nome:'Equações do 2º Grau',info:'Matemática · 8º ano · 50 min',status:'done',slides:'16 slides',data:'10/03, 11:05'},
    {icon:'📖',bg:'#FFF7ED',nome:'Gêneros Textuais',info:'Português · 6º ano · 45 min',status:'draft',slides:'12 slides',data:'09/03, 08:50'},
    {icon:'🌍',bg:'#F0FDF4',nome:'Biomas Brasileiros',info:'Geografia · 7º ano · 50 min',status:'done',slides:'19 slides',data:'07/03, 14:22'},
  ]

  const aulasFiltradas = filter === 'Todas' ? aulas
    : filter === 'Concluídas' ? aulas.filter(a => a.status === 'done')
    : aulas.filter(a => a.status === 'draft')

  return (
    <div style={{fontFamily:"'Inter',sans-serif",height:'100vh',overflow:'hidden',background:'#F8FAFC'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        :root{
          --indigo:#152664;--indigo-light:#1e3580;--indigo-50:#cbe7fe;--indigo-100:#a8d8fd;
          --violet:#152664;--violet-light:#1e3580;--peach:#f4e3d0;
          --slate-900:#0F172A;--slate-800:#1E293B;--slate-700:#334155;
          --slate-600:#475569;--slate-500:#64748B;--slate-400:#94A3B8;
          --slate-300:#CBD5E1;--slate-200:#E2E8F0;--slate-100:#F1F5F9;--slate-50:#F8FAFC;
          --white:#FFFFFF;--success:#10B981;--success-bg:#ECFDF5;--success-border:#A7F3D0;
          --amber:#F59E0B;--amber-bg:#FFFBEB;--danger:#EF4444;--danger-bg:#FEF2F2;
          --sidebar-w:248px;--topbar-h:64px;--radius:12px;--radius-lg:18px;--radius-xl:22px;
          --shadow-sm:0 1px 3px rgba(0,0,0,.05);
          --shadow:0 4px 16px rgba(0,0,0,.07),0 2px 6px rgba(0,0,0,.04);
          --shadow-lg:0 12px 40px rgba(15,23,42,.1),0 4px 12px rgba(15,23,42,.06);
          --shadow-indigo:0 6px 24px rgba(21,38,100,.3);
          --transition:all .2s cubic-bezier(.4,0,.2,1);
        }
        html{-webkit-font-smoothing:antialiased;}
        body{font-family:'Inter',sans-serif;color:var(--slate-900);background:var(--slate-50);}
        a{color:inherit;text-decoration:none;}
        button{font-family:inherit;cursor:pointer;border:none;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:var(--slate-200);border-radius:99px;}

        .app{display:flex;height:100vh;overflow:hidden;}

        /* SIDEBAR */
        .sidebar{width:var(--sidebar-w);flex-shrink:0;background:#152664;display:flex;flex-direction:column;height:100vh;overflow:hidden;position:relative;z-index:50;}
        .sidebar::before{content:'';position:absolute;top:0;left:0;right:0;height:220px;background:linear-gradient(180deg,rgba(244,227,208,.08) 0%,transparent 100%);pointer-events:none;}
        .sidebar-logo{display:flex;align-items:center;gap:10px;padding:22px 20px 20px;font-weight:800;font-size:1.05rem;color:#fff;position:relative;z-index:1;border-bottom:1px solid rgba(255,255,255,.07);margin-bottom:8px;}
        .sidebar-logo-mark{width:32px;height:32px;border-radius:9px;flex-shrink:0;background:linear-gradient(135deg,var(--indigo),var(--violet));display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:var(--shadow-indigo);}
        .sidebar-section-label{font-size:.65rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.25);padding:12px 20px 6px;}
        .sidebar-nav{flex:1;overflow-y:auto;padding:4px 10px;}
        .nav-item{display:flex;align-items:center;gap:11px;padding:10px 12px;border-radius:10px;font-size:.875rem;font-weight:500;color:rgba(255,255,255,.55);cursor:pointer;transition:var(--transition);position:relative;user-select:none;margin-bottom:2px;}
        .nav-item:hover{background:rgba(255,255,255,.07);color:rgba(255,255,255,.88);}
        .nav-item.active{background:rgba(21,38,100,.3);color:#fff;font-weight:600;}
        .nav-item.active::before{content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);width:3px;height:18px;background:var(--indigo-light);border-radius:0 3px 3px 0;}
        .nav-icon{font-size:1rem;flex-shrink:0;width:20px;text-align:center;}
        .nav-badge{margin-left:auto;background:var(--peach);color:var(--indigo);font-size:.65rem;font-weight:800;padding:2px 7px;border-radius:99px;}
        .sidebar-divider{height:1px;background:rgba(255,255,255,.07);margin:10px 16px;}
        .sidebar-bottom{padding:14px 10px;border-top:1px solid rgba(255,255,255,.07);}
        .user-chip{display:flex;align-items:center;gap:10px;padding:10px;border-radius:10px;cursor:pointer;transition:var(--transition);}
        .user-chip:hover{background:rgba(255,255,255,.07);}
        .user-avatar{width:34px;height:34px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,var(--indigo),var(--violet-light));display:flex;align-items:center;justify-content:center;font-size:.78rem;font-weight:800;color:white;}
        .user-name{font-size:.82rem;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .user-plan{font-size:.7rem;color:rgba(255,255,255,.38);}

        /* MAIN */
        .main-col{flex:1;display:flex;flex-direction:column;overflow:hidden;}
        .topbar{height:var(--topbar-h);background:var(--white);border-bottom:1px solid var(--slate-100);display:flex;align-items:center;padding:0 28px;gap:16px;flex-shrink:0;position:relative;z-index:10;}
        .topbar-title{font-size:1rem;font-weight:700;color:var(--slate-900);}
        .search-wrap{display:flex;align-items:center;gap:9px;background:var(--slate-50);border:1.5px solid var(--slate-100);border-radius:10px;padding:0 14px;height:38px;flex:1;max-width:320px;transition:var(--transition);}
        .search-wrap:focus-within{border-color:var(--indigo);background:var(--white);box-shadow:0 0 0 3px rgba(21,38,100,.09);}
        .search-input{border:none;outline:none;background:transparent;font-family:'Inter',sans-serif;font-size:.875rem;color:var(--slate-900);flex:1;}
        .search-input::placeholder{color:var(--slate-400);}
        .topbar-spacer{flex:1;}
        .topbar-actions{display:flex;align-items:center;gap:8px;}
        .icon-btn{width:38px;height:38px;border-radius:10px;background:transparent;display:flex;align-items:center;justify-content:center;color:var(--slate-500);transition:var(--transition);position:relative;}
        .icon-btn:hover{background:var(--slate-100);color:var(--slate-700);}
        .notif-dot{position:absolute;top:8px;right:8px;width:7px;height:7px;border-radius:50%;background:var(--danger);border:1.5px solid var(--white);}
        .topbar-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--indigo),var(--violet-light));display:flex;align-items:center;justify-content:center;font-size:.78rem;font-weight:800;color:white;cursor:pointer;border:2px solid var(--indigo-100);}
        .page-content{flex:1;overflow-y:auto;padding:32px 32px 48px;display:flex;flex-direction:column;gap:28px;}
        .welcome-row{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;}
        .welcome-text h1{font-size:1.45rem;font-weight:800;letter-spacing:-.02em;color:var(--slate-900);margin-bottom:5px;}
        .welcome-text p{font-size:.875rem;color:var(--slate-500);}
        .btn-new-lesson{display:inline-flex;align-items:center;gap:8px;padding:11px 22px;border-radius:var(--radius);background:linear-gradient(135deg,var(--indigo),var(--violet));color:#fff;font-size:.875rem;font-weight:700;box-shadow:var(--shadow-indigo);transition:var(--transition);flex-shrink:0;}
        .btn-new-lesson:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(21,38,100,.38);filter:brightness(1.06);}
        .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
        .stat-card{background:var(--white);border:1.5px solid var(--slate-100);border-radius:var(--radius-lg);padding:22px 24px;transition:var(--transition);}
        .stat-card:hover{box-shadow:var(--shadow);border-color:var(--slate-200);}
        .stat-card-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px;}
        .stat-icon{width:40px;height:40px;border-radius:11px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:18px;}
        .si-indigo{background:var(--indigo-50);}.si-violet{background:#F5F3FF;}.si-green{background:var(--success-bg);}.si-amber{background:var(--amber-bg);}
        .stat-trend{font-size:.72rem;font-weight:600;padding:3px 8px;border-radius:99px;display:flex;align-items:center;gap:3px;}
        .trend-up{background:var(--success-bg);color:var(--success);}.trend-same{background:var(--slate-100);color:var(--slate-500);}
        .stat-value{font-size:1.9rem;font-weight:900;letter-spacing:-.03em;color:var(--slate-900);margin-bottom:4px;}
        .stat-label{font-size:.8rem;color:var(--slate-500);font-weight:500;}
        .two-col{display:grid;grid-template-columns:1fr 360px;gap:20px;}
        .create-card{background:var(--white);border:1.5px solid var(--slate-100);border-radius:var(--radius-xl);overflow:hidden;}
        .create-card-head{padding:20px 24px 0;display:flex;align-items:center;justify-content:space-between;}
        .create-card-head h2{font-size:1rem;font-weight:700;}
        .create-card-head p{font-size:.8rem;color:var(--slate-500);margin-top:3px;}
        .create-body{padding:20px 24px 24px;display:flex;flex-direction:column;gap:14px;}
        .prompt-area{border:1.5px solid var(--slate-200);border-radius:var(--radius);padding:14px 16px;background:var(--slate-50);transition:var(--transition);position:relative;}
        .prompt-area:focus-within{border-color:var(--indigo);background:var(--white);box-shadow:0 0 0 3px rgba(21,38,100,.09);}
        .prompt-label{font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--indigo);margin-bottom:8px;}
        .prompt-textarea{width:100%;border:none;outline:none;resize:none;background:transparent;font-family:'Inter',sans-serif;font-size:.9rem;color:var(--slate-800);line-height:1.6;min-height:72px;}
        .prompt-textarea::placeholder{color:var(--slate-400);}
        .create-options{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;}
        .create-opt-label{font-size:.78rem;font-weight:600;color:var(--slate-700);margin-bottom:5px;}
        .create-opt-select{width:100%;height:38px;padding:0 28px 0 10px;border:1.5px solid var(--slate-200);border-radius:8px;background:#fff;font-family:'Inter',sans-serif;font-size:.82rem;color:var(--slate-700);outline:none;cursor:pointer;transition:border-color .18s;appearance:none;background-image:url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2394A3B8' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;}
        .create-opt-select:focus{border-color:var(--indigo);box-shadow:0 0 0 3px rgba(21,38,100,.09);}
        .create-footer{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;}
        .create-chips{display:flex;gap:8px;flex-wrap:wrap;}
        .chip{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;border-radius:99px;font-size:.72rem;font-weight:600;border:1.5px solid transparent;cursor:pointer;transition:var(--transition);}
        .chip-outline{border-color:var(--slate-200);color:var(--slate-600);background:var(--white);}
        .chip-outline:hover{border-color:var(--indigo);color:var(--indigo);}
        .chip-filled{background:var(--indigo-50);border-color:var(--indigo-100);color:var(--indigo);}
        .btn-generate{display:inline-flex;align-items:center;gap:8px;padding:11px 22px;border-radius:var(--radius);background:linear-gradient(135deg,var(--indigo),var(--violet));color:#fff;font-size:.875rem;font-weight:700;box-shadow:var(--shadow-indigo);transition:var(--transition);}
        .btn-generate:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(21,38,100,.38);filter:brightness(1.06);}
        .info-card{background:var(--white);border:1.5px solid var(--slate-100);border-radius:var(--radius-xl);padding:22px;display:flex;flex-direction:column;}
        .info-card-head{margin-bottom:18px;}
        .info-card-head h2{font-size:.9375rem;font-weight:700;margin-bottom:3px;}
        .info-card-head p{font-size:.78rem;color:var(--slate-500);}
        .plan-usage{margin-bottom:20px;}
        .usage-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
        .usage-label{font-size:.8rem;font-weight:600;color:var(--slate-700);}
        .usage-count{font-size:.8rem;color:var(--slate-500);}
        .usage-count strong{color:var(--slate-900);}
        .usage-bar{height:7px;background:var(--slate-100);border-radius:99px;overflow:hidden;}
        .usage-fill{height:100%;border-radius:99px;background:linear-gradient(90deg,var(--indigo),var(--violet));transition:width .6s cubic-bezier(.22,1,.36,1);}
        .plan-chip-row{display:flex;align-items:center;justify-content:space-between;}
        .plan-name-chip{font-size:.75rem;font-weight:700;padding:4px 12px;border-radius:99px;background:var(--peach);color:var(--indigo);}
        .plan-upgrade{font-size:.78rem;font-weight:600;color:var(--indigo);}
        .plan-upgrade:hover{text-decoration:underline;}
        .info-divider{height:1px;background:var(--slate-100);margin:18px 0;}
        .tips-list{display:flex;flex-direction:column;gap:12px;}
        .tip-item{display:flex;align-items:flex-start;gap:10px;}
        .tip-icon{width:30px;height:30px;border-radius:9px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:14px;}
        .ti-blue{background:var(--indigo-50);}.ti-green{background:var(--success-bg);}.ti-amber{background:var(--amber-bg);}
        .tip-text strong{display:block;font-size:.78rem;font-weight:700;color:var(--slate-800);margin-bottom:1px;}
        .tip-text span{font-size:.72rem;color:var(--slate-500);line-height:1.4;}
        .lessons-card{background:var(--white);border:1.5px solid var(--slate-100);border-radius:var(--radius-xl);overflow:hidden;}
        .lessons-head{padding:20px 24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;border-bottom:1px solid var(--slate-100);}
        .lessons-head h2{font-size:.9375rem;font-weight:700;}
        .lessons-filters{display:flex;align-items:center;gap:8px;}
        .filter-btn{padding:6px 14px;border-radius:99px;font-size:.775rem;font-weight:600;background:transparent;color:var(--slate-500);transition:var(--transition);}
        .filter-btn:hover{background:var(--slate-100);color:var(--slate-700);}
        .filter-btn.active{background:var(--indigo-50);color:var(--indigo);}
        .lessons-table{width:100%;border-collapse:collapse;}
        .lessons-table th{padding:11px 20px;text-align:left;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--slate-400);background:var(--slate-50);border-bottom:1px solid var(--slate-100);}
        .lessons-table th:first-child{padding-left:24px;}
        .lessons-table th:last-child{padding-right:24px;text-align:right;}
        .lessons-table td{padding:14px 20px;font-size:.875rem;color:var(--slate-700);border-bottom:1px solid var(--slate-50);vertical-align:middle;}
        .lessons-table td:first-child{padding-left:24px;}
        .lessons-table td:last-child{padding-right:24px;text-align:right;}
        .lessons-table tr:last-child td{border-bottom:none;}
        .lessons-table tr:hover td{background:var(--slate-50);}
        .lesson-subject{display:flex;align-items:center;gap:12px;}
        .lesson-icon{width:36px;height:36px;border-radius:10px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:16px;}
        .lesson-name{font-size:.875rem;font-weight:600;color:var(--slate-900);}
        .lesson-grade{font-size:.75rem;color:var(--slate-500);margin-top:1px;}
        .badge-status{display:inline-flex;align-items:center;gap:5px;font-size:.72rem;font-weight:600;padding:4px 10px;border-radius:99px;}
        .bs-done{background:var(--success-bg);color:var(--success);}
        .bs-editing{background:var(--indigo-50);color:var(--indigo);}
        .bs-draft{background:var(--slate-100);color:var(--slate-500);}
        .lesson-meta{font-size:.78rem;color:var(--slate-400);}
        .row-actions{display:flex;align-items:center;justify-content:flex-end;gap:4px;}
        .row-btn{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--slate-400);transition:var(--transition);background:transparent;}
        .row-btn:hover{background:var(--slate-100);color:var(--slate-700);}
        .lessons-footer{padding:14px 24px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--slate-100);font-size:.78rem;color:var(--slate-400);}
        .btn-see-all{font-size:.78rem;font-weight:600;color:var(--indigo);background:none;transition:color .15s;}
        .btn-see-all:hover{color:#0d1b52;}
        .mobile-sidebar-toggle{display:none;align-items:center;justify-content:center;width:38px;height:38px;border-radius:10px;background:var(--slate-100);color:var(--slate-700);}

        /* GEN MODAL */
        .gen-overlay{position:fixed;inset:0;z-index:100;background:rgba(15,23,42,.55);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:24px;opacity:0;pointer-events:none;transition:opacity .25s;}
        .gen-overlay.show{opacity:1;pointer-events:all;}
        .gen-modal{background:var(--white);border-radius:var(--radius-xl);padding:36px 36px 32px;width:100%;max-width:520px;box-shadow:0 32px 80px rgba(15,23,42,.22);transform:translateY(16px);transition:transform .3s cubic-bezier(.22,1,.36,1);}
        .gen-overlay.show .gen-modal{transform:none;}
        .gen-modal-top{text-align:center;margin-bottom:30px;}
        .gen-spinner-wrap{width:64px;height:64px;margin:0 auto 18px;border-radius:18px;background:linear-gradient(135deg,var(--indigo-50),#e6f4fe);display:flex;align-items:center;justify-content:center;}
        .gen-spinner{width:30px;height:30px;border:3px solid var(--indigo-100);border-top-color:var(--indigo);border-radius:50%;animation:spin .75s linear infinite;}
        @keyframes spin{to{transform:rotate(360deg)}}
        .gen-modal-top h3{font-size:1.1rem;font-weight:800;margin-bottom:6px;}
        .gen-modal-top p{font-size:.875rem;color:var(--slate-500);}
        .gen-steps{display:flex;flex-direction:column;gap:10px;margin-bottom:28px;}
        .gen-step{display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:var(--radius);font-size:.875rem;font-weight:500;color:var(--slate-500);background:var(--slate-50);border:1.5px solid var(--slate-100);transition:all .3s;}
        .gen-step.done{background:var(--success-bg);border-color:var(--success-border);color:#065F46;font-weight:600;}
        .gen-step.active{background:var(--indigo-50);border-color:var(--indigo-100);color:var(--indigo);font-weight:600;}
        .gen-step-icon{font-size:1rem;width:20px;text-align:center;flex-shrink:0;}
        .gen-step-check{margin-left:auto;width:20px;height:20px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:.65rem;}
        .gen-step.done .gen-step-check{background:var(--success);color:white;}
        .gen-step.active .gen-step-check{background:var(--indigo-100);}
        .gen-progress-bar{height:6px;background:var(--slate-100);border-radius:99px;overflow:hidden;}
        .gen-progress-fill{height:100%;border-radius:99px;background:linear-gradient(90deg,var(--indigo),var(--violet));transition:width .4s cubic-bezier(.22,1,.36,1);}

        @media(max-width:1100px){.stats-grid{grid-template-columns:repeat(2,1fr);}.two-col{grid-template-columns:1fr;}.info-card{display:none;}}
        @media(max-width:860px){.sidebar{position:fixed;left:-280px;transition:left .3s;}.sidebar.open{left:0;box-shadow:var(--shadow-lg);}.mobile-sidebar-toggle{display:flex;}.page-content{padding:20px 18px 40px;}.topbar{padding:0 18px;}}
        @media(max-width:640px){.stats-grid{grid-template-columns:1fr 1fr;}.create-options{grid-template-columns:1fr;}.welcome-row{flex-direction:column;align-items:flex-start;}}
      `}</style>

      <div className="app">
        {/* SIDEBAR */}
        <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
          <div className="sidebar-logo">
            <div className="sidebar-logo-mark">✦</div>
            Prepara Aula
          </div>
          <nav className="sidebar-nav">
            <div className="sidebar-section-label">Principal</div>
            <div className="nav-item active"><span className="nav-icon">🏠</span> Início</div>
            <div className="nav-item"><span className="nav-icon">✨</span> Nova Aula <span className="nav-badge">IA</span></div>
            <div className="nav-item"><span className="nav-icon">📁</span> Minhas Aulas</div>
            <div className="sidebar-divider"></div>
            <div className="sidebar-section-label">Ferramentas</div>
            <div className="nav-item"><span className="nav-icon">📊</span> Slides</div>
            <div className="nav-item"><span className="nav-icon">📋</span> Planos de Aula</div>
            <div className="nav-item"><span className="nav-icon">📝</span> Exercícios</div>
            <div className="nav-item"><span className="nav-icon">🎙️</span> Roteiros</div>
            <div className="sidebar-divider"></div>
            <div className="sidebar-section-label">Conta</div>
            <div className="nav-item"><span className="nav-icon">💳</span> Plano & Assinatura</div>
            <div className="nav-item" onClick={async () => { await supabase.auth.signOut(); router.push('/login') }}>
              <span className="nav-icon">🚪</span> Sair
            </div>
          </nav>
          <div className="sidebar-bottom">
            <div className="user-chip">
              <div className="user-avatar">{iniciais}</div>
              <div style={{flex:1,minWidth:0}}>
                <div className="user-name">{nomeUsuario}</div>
                <div className="user-plan">Plano {planoNome}</div>
              </div>
              <svg style={{color:'rgba(255,255,255,.3)',flexShrink:0}} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main-col">
          <header className="topbar">
            <button className="mobile-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div className="search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input className="search-input" type="text" placeholder="Buscar aulas, disciplinas..."/>
            </div>
            <div className="topbar-spacer"></div>
            <div className="topbar-actions">
              <button className="icon-btn">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                <span className="notif-dot"></span>
              </button>
              <button className="icon-btn">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </button>
              <div className="topbar-avatar">{iniciais}</div>
            </div>
          </header>

          <div className="page-content">
            {/* Welcome */}
            <div className="welcome-row">
              <div className="welcome-text">
                <h1>Bom dia, {nomeUsuario.split(' ')[0]} 👋</h1>
                <p>{new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})} · Plano {planoNome}</p>
              </div>
              <button className="btn-new-lesson" onClick={openGenModal}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Nova aula
              </button>
            </div>

            {/* Stats */}
            <div className="stats-grid">
              {[
                {icon:'📊',bg:'si-indigo',val:'28',label:'Aulas criadas este mês',trend:'↑ 12%',tClass:'trend-up'},
                {icon:'🖼️',bg:'si-violet',val:'463',label:'Slides gerados',trend:'↑ 8%',tClass:'trend-up'},
                {icon:'⏱️',bg:'si-green',val:'56h',label:'Horas economizadas',trend:'↑ 94%',tClass:'trend-up'},
                {icon:'📝',bg:'si-amber',val:'140',label:'Exercícios gerados',trend:'= igual',tClass:'trend-same'},
              ].map((s,i) => (
                <div key={i} className="stat-card">
                  <div className="stat-card-top">
                    <div className={`stat-icon ${s.bg}`}>{s.icon}</div>
                    <div className={`stat-trend ${s.tClass}`}>{s.trend}</div>
                  </div>
                  <div className="stat-value">{s.val}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Two-col */}
            <div className="two-col">
              {/* Create box */}
              <div className="create-card">
                <div className="create-card-head">
                  <div>
                    <h2>✨ Nova aula com IA</h2>
                    <p>Descreva sua aula e deixe a IA fazer o resto.</p>
                  </div>
                </div>
                <div className="create-body">
                  <div className="prompt-area">
                    <div className="prompt-label">Descreva sua aula</div>
                    <textarea
                      className="prompt-textarea"
                      value={prompt}
                      onChange={e => setPrompt(e.target.value)}
                      placeholder="Ex: Sistema circulatório para o 8º ano do ensino fundamental, 50 minutos. Turma participativa, gosto de perguntas interativas..."
                    />
                  </div>
                  <div className="create-options">
                    <div>
                      <div className="create-opt-label">Disciplina</div>
                      <select className="create-opt-select" value={disciplina} onChange={e => setDisciplina(e.target.value)}>
                        {['Ciências','Biologia','História','Matemática','Português','Geografia','Física','Química'].map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <div className="create-opt-label">Turma / Série</div>
                      <select className="create-opt-select" value={turma} onChange={e => setTurma(e.target.value)}>
                        {['6º ano — EF','7º ano — EF','8º ano — EF','9º ano — EF','1º ano — EM','2º ano — EM','3º ano — EM'].map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <div className="create-opt-label">Duração</div>
                      <select className="create-opt-select" value={duracao} onChange={e => setDuracao(e.target.value)}>
                        {['45 minutos','50 minutos','90 minutos','100 minutos','2 aulas'].map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="create-footer">
                    <div className="create-chips">
                      <span className="chip chip-filled">📊 Slides</span>
                      <span className="chip chip-filled">📋 Plano BNCC</span>
                      <span className="chip chip-filled">🎙️ Roteiro</span>
                      <span className="chip chip-outline">📝 Exercícios</span>
                    </div>
                    <button className="btn-generate" onClick={openGenModal}>⚡ Gerar aula</button>
                  </div>
                </div>
              </div>

              {/* Info card */}
              <div className="info-card">
                <div className="info-card-head"><h2>Uso do plano</h2><p>Ciclo atual · Renova em 1º de abril</p></div>
                <div className="plan-usage">
                  <div className="usage-row">
                    <span className="usage-label">Aulas criadas</span>
                    <span className="usage-count"><strong>{aulasUsadas}</strong> / {aulasTotal}</span>
                  </div>
                  <div className="usage-bar">
                    <div className="usage-fill" style={{width:`${Math.min((aulasUsadas/aulasTotal)*100,100)}%`}}></div>
                  </div>
                </div>
                <div className="plan-chip-row">
                  <span className="plan-name-chip">{planoNome}</span>
                  <a href="/planos" className="plan-upgrade">Fazer upgrade →</a>
                </div>
                <div className="info-divider"></div>
                <div className="info-card-head"><h2>Dicas rápidas</h2><p>Para melhores resultados</p></div>
                <div className="tips-list">
                  {[
                    {icon:'✍️',bg:'ti-blue',t:'Seja específico no prompt',s:'Mencione tema, turma, tempo e objetivos da aula.'},
                    {icon:'🎯',bg:'ti-green',t:'Informe o estilo da turma',s:'Ex: "turma tímida" ou "gostam de debates".'},
                    {icon:'💡',bg:'ti-amber',t:'Inclua a BNCC desejada',s:'Cite a habilidade (EF08CI08) para mais precisão.'},
                  ].map((tip,i) => (
                    <div key={i} className="tip-item">
                      <div className={`tip-icon ${tip.bg}`}>{tip.icon}</div>
                      <div className="tip-text"><strong>{tip.t}</strong><span>{tip.s}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Lessons table */}
            <div className="lessons-card">
              <div className="lessons-head">
                <h2>Aulas recentes</h2>
                <div className="lessons-filters">
                  {['Todas','Concluídas','Rascunhos'].map(f => (
                    <button key={f} className={`filter-btn${filter===f?' active':''}`} onClick={() => setFilter(f)}>{f}</button>
                  ))}
                </div>
              </div>
              <table className="lessons-table">
                <thead>
                  <tr><th>Aula</th><th>Status</th><th>Slides</th><th>Criada em</th><th></th></tr>
                </thead>
                <tbody>
                  {aulasFiltradas.map((a,i) => (
                    <tr key={i}>
                      <td>
                        <div className="lesson-subject">
                          <div className="lesson-icon" style={{background:a.bg}}>{a.icon}</div>
                          <div><div className="lesson-name">{a.nome}</div><div className="lesson-grade">{a.info}</div></div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge-status ${a.status==='done'?'bs-done':a.status==='editing'?'bs-editing':'bs-draft'}`}>
                          ● {a.status==='done'?'Concluída':a.status==='editing'?'Editando':'Rascunho'}
                        </span>
                      </td>
                      <td><span className="lesson-meta">{a.slides}</span></td>
                      <td><span className="lesson-meta">{a.data}</span></td>
                      <td>
                        <div className="row-actions">
                          {[
                            <svg key="e" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
                            <svg key="d" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
                            <svg key="m" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>,
                          ].map((icon,j) => <button key={j} className="row-btn">{icon}</button>)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="lessons-footer">
                <span>Exibindo {aulasFiltradas.length} de 28 aulas</span>
                <button className="btn-see-all">Ver todas as aulas →</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GENERATION MODAL */}
      <div className={`gen-overlay${genModal?' show':''}`} onClick={e => { if(genDone && e.target.classList.contains('gen-overlay')) setGenModal(false) }}>
        <div className="gen-modal">
          <div className="gen-modal-top">
            <div className="gen-spinner-wrap">
              {genDone
                ? <div style={{fontSize:'2rem'}}>🎉</div>
                : <div className="gen-spinner"></div>
              }
            </div>
            <h3>{genDone ? 'Aula criada com sucesso!' : 'Gerando sua aula com IA...'}</h3>
            <p>{genDone ? 'Seus slides, plano de aula, roteiro e exercícios estão prontos.' : 'Aguarde enquanto a IA prepara tudo para você.'}</p>
          </div>
          <div className="gen-steps">
            {STEPS.map((s,i) => (
              <div key={i} className={`gen-step${doneSteps.includes(i)?' done':activeStep===i?' active':''}`}>
                <span className="gen-step-icon">{s.icon}</span>
                <span>{s.label}</span>
                <div className="gen-step-check">{doneSteps.includes(i) ? '✓' : ''}</div>
              </div>
            ))}
          </div>
          <div className="gen-progress-bar">
            <div className="gen-progress-fill" style={{width:`${progress}%`}}></div>
          </div>
        </div>
      </div>
    </div>
  )
}