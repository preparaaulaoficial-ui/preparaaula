'use client'
import { useEffect } from 'react'
import Head from 'next/head'

const CAKTO_STARTER      = 'https://pay.cakto.com.br/zybn2t8_802724'
const CAKTO_PROFISSIONAL = 'https://pay.cakto.com.br/ay95nr9_802729'
const CAKTO_ESCOLA       = 'https://pay.cakto.com.br/9hsh5ar_802731'

const ICON_SRC = 'data:image/png;base64,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'

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    const nav = document.getElementById('nav')
    const onScroll = () => nav && nav.classList.toggle('scrolled', window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    document.querySelectorAll('details').forEach(d => {
      d.addEventListener('toggle', () => {
        if (d.open) document.querySelectorAll('details').forEach(o => { if (o !== d) o.removeAttribute('open') })
      })
    })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <Head>
        <meta name="facebook-domain-verification" content="5f2incu6srrtkgaekezffyumb3zhkd" />
      </Head>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        :root{
          --indigo:#152664;--indigo-600:#0d1b52;--indigo-light:#1e3580;
          --indigo-50:#cbe7fe;--indigo-100:#a8d8fd;
          --violet:#152664;--violet-light:#1e3580;
          --peach:#f4e3d0;--peach-dark:#e8c9a8;
          --slate-900:#0a0a0a;--slate-800:#1a1a2e;--slate-700:#2d3748;
          --slate-600:#4a5568;--slate-500:#64748B;--slate-400:#94A3B8;
          --slate-200:#E2E8F0;--slate-100:#F1F5F9;--slate-50:#F8FAFC;
          --white:#FFFFFF;--success:#10B981;--amber:#F59E0B;
          --radius-sm:8px;--radius:12px;--radius-lg:18px;--radius-xl:24px;
          --shadow-sm:0 1px 3px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.04);
          --shadow:0 4px 16px rgba(0,0,0,.07),0 2px 6px rgba(0,0,0,.04);
          --shadow-lg:0 16px 48px rgba(15,23,42,.12),0 4px 16px rgba(15,23,42,.06);
          --shadow-xl:0 32px 80px rgba(15,23,42,.16);
          --shadow-indigo:0 8px 32px rgba(21,38,100,.3);
          --transition:all .22s cubic-bezier(.4,0,.2,1);
        }
        html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased;}
        body{font-family:'Inter',sans-serif;color:var(--slate-900);background:var(--white);line-height:1.6;overflow-x:hidden;}
        img,svg{display:block;max-width:100%;}
        a{color:inherit;text-decoration:none;}
        button{font-family:inherit;cursor:pointer;}
        ::-webkit-scrollbar{width:6px;}
        ::-webkit-scrollbar-track{background:var(--slate-100);}
        ::-webkit-scrollbar-thumb{background:var(--slate-200);border-radius:99px;}

        .display-1{font-size:clamp(2.6rem,5.5vw,4rem);font-weight:900;line-height:1.08;letter-spacing:-.035em;}
        .display-2{font-size:clamp(1.9rem,3.5vw,2.75rem);font-weight:800;line-height:1.15;letter-spacing:-.025em;}
        .h3{font-size:clamp(1.05rem,1.8vw,1.2rem);font-weight:700;line-height:1.35;}
        .body-lg{font-size:1.075rem;color:var(--slate-600);line-height:1.7;}
        .body{font-size:.9375rem;color:var(--slate-600);line-height:1.7;}
        .overline{font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;}

        .container{width:100%;max-width:1160px;margin:0 auto;padding:0 28px;}

        .reveal{opacity:0;transform:translateY(28px);transition:opacity .65s cubic-bezier(.22,1,.36,1),transform .65s cubic-bezier(.22,1,.36,1);}
        .reveal.visible{opacity:1;transform:none;}
        .reveal-delay-1{transition-delay:.1s;}
        .reveal-delay-2{transition-delay:.2s;}
        .reveal-delay-3{transition-delay:.3s;}
        .reveal-delay-4{transition-delay:.4s;}
        .reveal-delay-5{transition-delay:.5s;}
        .reveal-delay-6{transition-delay:.6s;}

        .badge{display:inline-flex;align-items:center;gap:6px;padding:5px 13px;border-radius:999px;font-size:.75rem;font-weight:700;letter-spacing:.04em;}
        .badge-indigo{background:var(--indigo-50);color:var(--indigo);border:1px solid var(--indigo-100);}
        .badge-white{background:rgba(244,227,208,.18);color:var(--peach);border:1px solid rgba(244,227,208,.35);backdrop-filter:blur(4px);}

        .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:13px 26px;border-radius:var(--radius);font-size:.9375rem;font-weight:600;transition:var(--transition);border:none;white-space:nowrap;}
        .btn-xl{padding:15px 32px;font-size:1rem;}
        .btn-primary{background:linear-gradient(135deg,var(--indigo) 0%,var(--violet) 100%);color:var(--white);box-shadow:var(--shadow-indigo);}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(21,38,100,.38);filter:brightness(1.06);}
        .btn-secondary{background:var(--white);color:var(--slate-700);box-shadow:var(--shadow);border:1.5px solid var(--slate-200);}
        .btn-secondary:hover{border-color:var(--indigo);color:var(--indigo);transform:translateY(-1px);}
        .btn-ghost-white{background:rgba(255,255,255,.12);color:rgba(255,255,255,.88);border:1.5px solid rgba(255,255,255,.25);backdrop-filter:blur(4px);}
        .btn-ghost-white:hover{background:rgba(255,255,255,.2);color:var(--white);}
        .btn-group{display:flex;flex-wrap:wrap;align-items:center;gap:12px;}

        .section-header{text-align:center;max-width:660px;margin:0 auto 72px;}
        .section-header .badge{margin-bottom:18px;}
        .section-header h2{margin-bottom:18px;}
        .section-header p{font-size:1.075rem;color:var(--slate-500);}

        /* NAV */
        #nav{position:sticky;top:0;z-index:200;background:rgba(255,255,255,.85);backdrop-filter:blur(16px) saturate(180%);border-bottom:1px solid rgba(226,232,240,.8);transition:box-shadow .3s;}
        #nav.scrolled{box-shadow:0 4px 24px rgba(15,23,42,.06);}
        .nav-inner{display:flex;align-items:center;gap:40px;height:70px;}
        .nav-logo{display:flex;align-items:center;gap:10px;font-weight:800;font-size:1.1rem;color:var(--slate-900);flex-shrink:0;}
        .nav-logo-mark{width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;overflow:hidden;}
        .nav-logo-mark img{width:34px;height:34px;object-fit:cover;border-radius:9px;}
        .nav-links{display:flex;align-items:center;gap:30px;list-style:none;flex:1;}
        .nav-links a{font-size:.875rem;font-weight:500;color:var(--slate-500);transition:color .15s;}
        .nav-links a:hover{color:var(--slate-900);}
        .nav-right{display:flex;align-items:center;gap:10px;margin-left:auto;}
        .nav-login{font-size:.875rem;font-weight:500;color:var(--slate-600);padding:8px 16px;border-radius:var(--radius-sm);transition:color .15s;}
        .nav-login:hover{color:var(--indigo);}

        /* HERO */
        #hero{position:relative;overflow:hidden;padding:88px 0 0;background:linear-gradient(168deg,#FAFCFF 0%,var(--indigo-50) 55%,#fdf1e8 100%);}
        .hero-blob{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none;}
        .hero-blob-1{width:600px;height:600px;background:radial-gradient(circle,rgba(21,38,100,.12) 0%,transparent 70%);top:-200px;right:-100px;}
        .hero-blob-2{width:500px;height:500px;background:radial-gradient(circle,rgba(21,38,100,.1) 0%,transparent 70%);bottom:0;left:-150px;}
        .hero-inner{position:relative;z-index:1;display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center;}
        .hero-content .badge{margin-bottom:24px;}
        .hero-content h1{margin-bottom:22px;}
        .hero-content h1 em{font-style:normal;color:var(--indigo);}
        .hero-content p{margin-bottom:36px;max-width:480px;}
        .hero-stats{display:flex;gap:0;margin-top:44px;padding-top:40px;border-top:1px solid rgba(21,38,100,.12);}
        .hero-stat{flex:1;text-align:center;padding:0 20px;border-right:1px solid rgba(21,38,100,.12);}
        .hero-stat:first-child{padding-left:0;text-align:left;}
        .hero-stat:last-child{border-right:none;}
        .hero-stat strong{display:block;font-size:2.2rem;font-weight:900;line-height:1;color:var(--indigo);margin-bottom:4px;}
        .hero-stat span{font-size:.8rem;color:var(--slate-500);font-weight:500;}
        .hero-visual{position:relative;padding-bottom:32px;}
        .mockup-window{background:var(--white);border-radius:var(--radius-xl);box-shadow:var(--shadow-xl),0 0 0 1px var(--slate-100);overflow:hidden;}
        .mockup-titlebar{height:44px;background:var(--slate-50);border-bottom:1px solid var(--slate-100);display:flex;align-items:center;padding:0 16px;gap:7px;}
        .m-dot{width:11px;height:11px;border-radius:50%;}
        .m-dot-r{background:#FF5F57;}.m-dot-y{background:#FEBC2E;}.m-dot-g{background:#28C840;}
        .mockup-url{flex:1;margin:0 12px;background:var(--white);border:1px solid var(--slate-200);border-radius:6px;height:24px;display:flex;align-items:center;padding:0 10px;font-size:.68rem;color:var(--slate-400);}
        .mockup-content{padding:20px;display:flex;flex-direction:column;gap:14px;}
        .mockup-layout{display:flex;gap:14px;}
        .mockup-sidebar{width:140px;flex-shrink:0;background:var(--slate-50);border-radius:10px;padding:14px 10px;display:flex;flex-direction:column;gap:6px;}
        .mockup-nav-item{display:flex;align-items:center;gap:7px;padding:7px 10px;border-radius:7px;font-size:.7rem;font-weight:500;color:var(--slate-500);}
        .mockup-nav-item.active{background:var(--indigo-50);color:var(--indigo);font-weight:600;}
        .mockup-nav-dot{width:7px;height:7px;border-radius:50%;background:var(--slate-300);flex-shrink:0;}
        .mockup-nav-item.active .mockup-nav-dot{background:var(--indigo);}
        .mockup-main{flex:1;display:flex;flex-direction:column;gap:12px;}
        .mockup-prompt-box{background:linear-gradient(135deg,var(--indigo-50),#F5F3FF);border:1.5px solid var(--indigo-100);border-radius:10px;padding:14px;}
        .mockup-prompt-label{font-size:.62rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--indigo);margin-bottom:7px;}
        .mockup-prompt-text{font-size:.72rem;color:var(--slate-700);line-height:1.5;}
        .mockup-cursor{display:inline-block;width:1.5px;height:11px;background:var(--indigo);vertical-align:middle;animation:blink 1.1s step-end infinite;}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        .mockup-progress{display:flex;align-items:center;gap:10px;background:var(--white);border:1px solid var(--slate-100);border-radius:8px;padding:10px 12px;}
        .mockup-progress-bar-wrap{flex:1;height:4px;background:var(--slate-100);border-radius:99px;overflow:hidden;}
        .mockup-progress-bar{height:100%;width:72%;background:linear-gradient(90deg,var(--indigo),var(--violet));border-radius:99px;animation:progress-fill 2.5s ease-in-out infinite alternate;}
        @keyframes progress-fill{from{width:20%}to{width:92%}}
        .mockup-progress-label{font-size:.65rem;font-weight:600;color:var(--indigo);white-space:nowrap;}
        .mockup-cards-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
        .mockup-card{background:var(--slate-50);border-radius:9px;padding:11px;border:1px solid var(--slate-100);}
        .mockup-card.done{background:#F0FDF4;border-color:#BBF7D0;}
        .mockup-card-icon{font-size:.95rem;margin-bottom:5px;}
        .mockup-card-name{font-size:.68rem;font-weight:700;color:var(--slate-800);}
        .mockup-card-status{font-size:.6rem;color:var(--slate-400);margin-top:2px;}
        .mockup-card.done .mockup-card-status{color:#16A34A;font-weight:600;}
        .float-chip{position:absolute;z-index:2;background:var(--white);border-radius:14px;padding:10px 14px;box-shadow:var(--shadow-lg);border:1px solid var(--slate-100);display:flex;align-items:center;gap:10px;animation:float-updown 4s ease-in-out infinite;}
        @keyframes float-updown{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        .float-chip-1{bottom:16px;left:-40px;animation-delay:0s;}
        .float-chip-2{top:40px;right:-32px;animation-delay:1.5s;}
        .chip-icon{width:34px;height:34px;border-radius:10px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:16px;}
        .chip-icon-green{background:#DCFCE7;}.chip-icon-indigo{background:var(--indigo-50);}
        .chip-text strong{display:block;font-size:.78rem;font-weight:700;color:var(--slate-900);}
        .chip-text span{font-size:.68rem;color:var(--slate-500);}

        /* PROBLEM */
        #problem{padding:100px 0;background:var(--white);}
        .problem-grid{display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center;}
        .problem-content h2{margin-bottom:20px;}
        .problem-content p{margin-bottom:36px;}
        .problem-cards{display:flex;flex-direction:column;gap:14px;}
        .problem-card{display:flex;align-items:flex-start;gap:14px;padding:18px 22px;background:var(--slate-50);border:1.5px solid var(--slate-100);border-radius:var(--radius);transition:var(--transition);}
        .problem-card:hover{border-color:var(--indigo-100);background:var(--indigo-50);}
        .problem-icon{width:42px;height:42px;border-radius:11px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:18px;background:var(--white);box-shadow:var(--shadow-sm);}
        .problem-card-text strong{display:block;font-size:.9rem;font-weight:700;color:var(--slate-800);margin-bottom:3px;}
        .problem-card-text span{font-size:.82rem;color:var(--slate-500);}
        .time-card{background:var(--white);border-radius:var(--radius-xl);padding:32px;box-shadow:var(--shadow-lg);border:1px solid var(--slate-100);text-align:center;}
        .time-card-label{font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--slate-400);margin-bottom:16px;}
        .time-before{font-size:4rem;font-weight:900;color:var(--slate-200);line-height:1;}
        .time-after{font-size:4rem;font-weight:900;line-height:1;color:var(--indigo);}
        .time-comparison{display:flex;align-items:center;justify-content:center;gap:20px;margin:8px 0 16px;}
        .time-arrow{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--indigo),var(--violet));display:flex;align-items:center;justify-content:center;color:white;font-size:18px;}
        .time-sub{font-size:.82rem;color:var(--slate-500);}

        /* HOW */
        #como-funciona{padding:100px 0;background:var(--slate-50);}
        .steps-list{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;position:relative;}
        .steps-list::before{content:'';position:absolute;top:48px;left:calc(16.66% + 24px);right:calc(16.66% + 24px);height:2px;border-top:2px dashed var(--indigo-100);z-index:0;}
        .step{position:relative;z-index:1;background:var(--white);border:1.5px solid var(--slate-100);border-radius:var(--radius-xl);padding:36px 32px;transition:var(--transition);}
        .step:hover{box-shadow:var(--shadow-lg);border-color:var(--indigo-100);transform:translateY(-4px);}
        .step-num-wrap{width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,var(--indigo),var(--violet));display:flex;align-items:center;justify-content:center;margin-bottom:24px;box-shadow:var(--shadow-indigo);}
        .step-num{font-size:.75rem;font-weight:900;color:white;letter-spacing:.03em;}
        .step h3{margin-bottom:10px;font-size:1.05rem;}
        .step p{font-size:.875rem;color:var(--slate-500);line-height:1.7;}

        /* FEATURES */
        #recursos{padding:100px 0;background:var(--white);}
        .features-bento{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
        .feature-tile{background:var(--slate-50);border:1.5px solid var(--slate-100);border-radius:var(--radius-xl);padding:32px;transition:var(--transition);}
        .feature-tile:hover{background:var(--white);border-color:var(--indigo-100);box-shadow:var(--shadow-lg);transform:translateY(-3px);}
        .feature-tile-icon{width:50px;height:50px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:20px;}
        .fi-1{background:var(--indigo-50);}.fi-2{background:#FFF7ED;}.fi-3{background:#F0FDF4;}
        .fi-4{background:#FFF1F2;}.fi-5{background:#FFFBEB;}.fi-6{background:#F0F9FF;}
        .feature-tile h3{font-size:1rem;margin-bottom:10px;}
        .feature-tile p{font-size:.875rem;color:var(--slate-500);line-height:1.65;}

        /* PREVIEW */
        #preview{padding:100px 0 0;background:linear-gradient(180deg,#060e24 0%,#152664 100%);overflow:hidden;}
        .preview-inner{text-align:center;}
        .preview-inner h2{color:var(--white);margin-bottom:16px;}
        .preview-inner p{color:rgba(255,255,255,.65);font-size:1.05rem;margin-bottom:56px;}
        .preview-screen{position:relative;max-width:900px;margin:0 auto;background:#0d1b3e;border-radius:var(--radius-xl) var(--radius-xl) 0 0;overflow:hidden;box-shadow:0 -16px 80px rgba(21,38,100,.35),0 0 0 1px rgba(255,255,255,.06);}
        .preview-topbar{height:48px;background:#060e24;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;gap:8px;padding:0 20px;}
        .p-dot{width:11px;height:11px;border-radius:50%;}
        .p-dot-r{background:#FF5F57;}.p-dot-y{background:#FEBC2E;}.p-dot-g{background:#28C840;}
        .preview-url{flex:1;margin:0 14px;background:rgba(255,255,255,.06);border-radius:7px;height:26px;display:flex;align-items:center;padding:0 12px;font-size:.7rem;color:rgba(255,255,255,.3);}
        .preview-body{display:grid;grid-template-columns:220px 1fr;min-height:380px;}
        .preview-side{background:#060e24;border-right:1px solid rgba(255,255,255,.06);padding:20px 14px;display:flex;flex-direction:column;gap:4px;}
        .p-nav{display:flex;align-items:center;gap:9px;padding:9px 12px;border-radius:8px;font-size:.72rem;font-weight:500;color:rgba(255,255,255,.45);}
        .p-nav.active{background:rgba(21,38,100,.25);color:rgba(255,255,255,.95);font-weight:600;}
        .p-nav-icon{font-size:.9rem;}
        .preview-main{padding:20px;display:flex;flex-direction:column;gap:16px;}
        .p-greeting{font-size:.82rem;color:rgba(255,255,255,.65);}
        .p-greeting strong{color:var(--white);}
        .p-create-box{background:rgba(21,38,100,.15);border:1.5px solid rgba(21,38,100,.4);border-radius:12px;padding:16px;}
        .p-label{font-size:.65rem;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:8px;}
        .p-input{font-size:.78rem;color:rgba(255,255,255,.85);line-height:1.5;}
        .p-cursor{display:inline-block;width:2px;height:12px;background:var(--indigo-light);vertical-align:middle;animation:blink 1s step-end infinite;margin-left:1px;}
        .p-btn{margin-top:12px;display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:8px;background:linear-gradient(135deg,var(--indigo),var(--violet));font-size:.74rem;font-weight:700;color:white;}
        .p-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
        .p-card{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:14px;}
        .p-card-icon{font-size:1.1rem;margin-bottom:7px;}
        .p-card-title{font-size:.7rem;font-weight:700;color:rgba(255,255,255,.85);margin-bottom:3px;}
        .p-card-desc{font-size:.62rem;color:rgba(255,255,255,.35);}
        .p-card-badge{margin-top:8px;display:inline-block;padding:3px 8px;background:rgba(16,185,129,.15);border:1px solid rgba(16,185,129,.3);border-radius:99px;font-size:.6rem;font-weight:700;color:#34D399;}

        /* TESTIMONIALS */
        #depoimentos{padding:100px 0;background:var(--indigo-50);}
        .testimonials-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;}
        .tcard{background:var(--white);border-radius:var(--radius-xl);padding:36px 32px;box-shadow:var(--shadow);border:1.5px solid var(--indigo-100);transition:var(--transition);display:flex;flex-direction:column;}
        .tcard:hover{box-shadow:var(--shadow-lg);transform:translateY(-4px);border-color:var(--indigo);}
        .tcard-stars{color:var(--amber);letter-spacing:2px;font-size:.9rem;margin-bottom:20px;}
        .tcard blockquote{font-size:.9375rem;color:var(--slate-700);line-height:1.75;font-style:italic;flex:1;padding-left:16px;border-left:3px solid var(--indigo-100);margin-bottom:28px;}
        .tcard-author{display:flex;align-items:center;gap:12px;}
        .tcard-avatar{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.88rem;font-weight:800;color:white;flex-shrink:0;}
        .av-1{background:linear-gradient(135deg,#4F46E5,#818CF8);}
        .av-2{background:linear-gradient(135deg,#7C3AED,#A78BFA);}
        .av-3{background:linear-gradient(135deg,#059669,#34D399);}
        .tcard-name{font-size:.88rem;font-weight:700;color:var(--slate-900);}
        .tcard-role{font-size:.75rem;color:var(--slate-400);}

        /* PRICING */
        #planos{padding:100px 0;background:var(--white);}
        .pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;align-items:start;}
        .pcard{border-radius:var(--radius-xl);padding:36px 32px;border:1.5px solid var(--slate-100);display:flex;flex-direction:column;transition:var(--transition);}
        .pcard:hover{box-shadow:var(--shadow-lg);}
        .pcard-popular{border:2px solid var(--indigo);box-shadow:0 0 0 4px var(--indigo-50),var(--shadow-lg);position:relative;}
        .pop-badge{position:absolute;top:-14px;left:50%;transform:translateX(-50%);background:var(--peach);color:var(--indigo);font-size:.7rem;font-weight:800;letter-spacing:.06em;padding:4px 14px;border-radius:99px;white-space:nowrap;box-shadow:0 2px 8px rgba(21,38,100,.15);}
        .pcard-tier{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--slate-400);margin-bottom:10px;}
        .pcard-popular .pcard-tier{color:var(--indigo);}
        .pcard-price{line-height:1;margin-bottom:6px;}
        .pcard-price sup{font-size:1rem;font-weight:700;color:var(--slate-500);vertical-align:super;}
        .pcard-price strong{font-size:3rem;font-weight:900;letter-spacing:-.04em;}
        .pcard-price em{font-style:normal;font-size:.82rem;color:var(--slate-400);}
        .pcard-tagline{font-size:.875rem;color:var(--slate-500);margin:12px 0;padding-bottom:22px;border-bottom:1px solid var(--slate-100);}
        .pcard-features{list-style:none;flex:1;display:flex;flex-direction:column;gap:12px;margin-bottom:32px;}
        .pcard-features li{display:flex;align-items:flex-start;gap:10px;font-size:.875rem;color:var(--slate-700);}
        .pcheck{color:var(--success);font-weight:800;flex-shrink:0;margin-top:1px;}
        .pricing-footnote{text-align:center;margin-top:28px;font-size:.85rem;color:var(--slate-400);}

        /* FAQ */
        #faq{padding:100px 0;background:var(--slate-50);}
        .faq-wrap{max-width:740px;margin:0 auto;}
        details{background:var(--white);border:1.5px solid var(--slate-100);border-radius:var(--radius-lg);margin-bottom:10px;transition:var(--transition);}
        details[open]{border-color:var(--indigo-100);box-shadow:0 4px 20px rgba(21,38,100,.07);}
        summary{padding:22px 24px;font-size:.9375rem;font-weight:600;color:var(--slate-900);cursor:pointer;list-style:none;display:flex;align-items:center;justify-content:space-between;gap:16px;}
        summary::-webkit-details-marker{display:none;}
        summary::after{content:'+';flex-shrink:0;font-size:1.4rem;font-weight:300;color:var(--slate-300);transition:transform .25s ease,color .15s;}
        details[open] summary{color:var(--indigo);}
        details[open] summary::after{transform:rotate(45deg);color:var(--indigo);}
        details p{padding:0 24px 22px;font-size:.9rem;color:var(--slate-500);line-height:1.75;}

        /* CTA FINAL */
        #cta-final{padding:100px 0;position:relative;overflow:hidden;background:linear-gradient(135deg,#060e24 0%,#152664 50%,#1a3278 100%);}
        #cta-final::before{content:'';position:absolute;inset:0;background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");}
        .cta-glow{position:absolute;top:-200px;left:50%;transform:translateX(-50%);width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(100,130,210,.2) 0%,transparent 65%);pointer-events:none;}
        .cta-final-content{position:relative;z-index:1;text-align:center;max-width:640px;margin:0 auto;}
        .cta-final-content h2{color:var(--white);margin-bottom:18px;}
        .cta-final-content p{color:rgba(255,255,255,.7);font-size:1.1rem;margin-bottom:44px;}
        .cta-final-content .btn-cta-white{background:var(--white);color:var(--indigo);box-shadow:0 8px 32px rgba(0,0,0,.25);display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:15px 32px;border-radius:var(--radius);font-size:1rem;font-weight:600;transition:var(--transition);border:none;}
        .cta-final-content .btn-cta-white:hover{background:var(--indigo-50);box-shadow:0 12px 40px rgba(0,0,0,.3);}

        /* FOOTER */
        footer{background:var(--slate-900);padding:64px 0 32px;}
        .footer-top{display:grid;grid-template-columns:2.5fr 1fr 1fr 1fr;gap:56px;margin-bottom:56px;}
        .footer-brand p{font-size:.875rem;color:rgba(255,255,255,.38);line-height:1.75;max-width:260px;}
        .footer-col h4{font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,.3);margin-bottom:18px;}
        .footer-col ul{list-style:none;display:flex;flex-direction:column;gap:10px;}
        .footer-col a{font-size:.875rem;color:rgba(255,255,255,.5);transition:color .15s;}
        .footer-col a:hover{color:var(--white);}
        .footer-bottom{border-top:1px solid rgba(255,255,255,.07);padding-top:28px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;}
        .footer-bottom p{font-size:.8rem;color:rgba(255,255,255,.25);}
        .footer-pills{display:flex;gap:8px;}
        .footer-pill{font-size:.7rem;color:rgba(255,255,255,.3);border:1px solid rgba(255,255,255,.1);padding:3px 10px;border-radius:99px;}

        @media(max-width:1040px){.features-bento{grid-template-columns:repeat(2,1fr);}.preview-body{grid-template-columns:180px 1fr;}}
        @media(max-width:900px){.hero-inner{grid-template-columns:1fr;}.hero-visual{display:none;}.problem-grid{grid-template-columns:1fr;}.steps-list{grid-template-columns:1fr;}.steps-list::before{display:none;}.testimonials-grid{grid-template-columns:1fr;}.pricing-grid{grid-template-columns:1fr;max-width:460px;margin:0 auto;}.footer-top{grid-template-columns:1fr 1fr;gap:36px;}.p-cards{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:640px){section,#hero{padding:72px 0;}#hero{padding-bottom:0;}.nav-links,.nav-login{display:none;}.hero-stats{flex-direction:column;gap:0;}.hero-stat{padding:16px 0;border-right:none;border-bottom:1px solid rgba(21,38,100,.12);text-align:left;}.hero-stat:last-child{border-bottom:none;}.features-bento{grid-template-columns:1fr;}.footer-top{grid-template-columns:1fr;}.footer-bottom{flex-direction:column;align-items:flex-start;}.preview-body{grid-template-columns:1fr;}.preview-side{display:none;}}
      `}</style>

      {/* NAV */}
      <nav id="nav">
        <div className="container">
          <div className="nav-inner">
            <a href="/" className="nav-logo">
              <div className="nav-logo-mark">
                <img src={ICON_SRC} alt="Prepara Aula" />
              </div>
              <span>Prepara Aula</span>
            </a>
            <ul className="nav-links">
              <li><a href="#como-funciona">Como funciona</a></li>
              <li><a href="#recursos">Recursos</a></li>
              <li><a href="#planos">Planos</a></li>
            </ul>
            <div className="nav-right">
              <a href="/login" className="nav-login">Entrar</a>
              <a href={CAKTO_PROFISSIONAL} target="_blank" className="btn btn-primary" style={{padding:'10px 20px',fontSize:'.875rem'}}>Começar agora →</a>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero">
        <div className="hero-blob hero-blob-1"></div>
        <div className="hero-blob hero-blob-2"></div>
        <div className="container">
          <div className="hero-inner">
            <div className="hero-content">
              <div className="badge badge-indigo reveal"><span>✨</span> IA para Educadores Brasileiros</div>
              <h1 className="display-1 reveal reveal-delay-1">Sua aula <em>pronta</em><br/>em minutos.</h1>
              <p className="body-lg reveal reveal-delay-2">Descreva o tema, a turma e o tempo disponível — e a IA gera slides, plano de aula, roteiro do professor e exercícios alinhados à BNCC.</p>
              <div className="btn-group reveal reveal-delay-3">
                <a href={CAKTO_PROFISSIONAL} target="_blank" className="btn btn-primary btn-xl">Criar minha primeira aula →</a>
                <a href="#como-funciona" className="btn btn-secondary btn-xl">Como funciona</a>
              </div>
              <div className="hero-stats reveal reveal-delay-4">
                <div className="hero-stat"><strong>3 min</strong><span>Tempo médio por aula</span></div>
                <div className="hero-stat"><strong>20+</strong><span>Slides por apresentação</span></div>
                <div className="hero-stat"><strong>100%</strong><span>Alinhado à BNCC</span></div>
              </div>
            </div>
            <div className="hero-visual reveal reveal-delay-2">
              <div className="float-chip float-chip-2">
                <div className="chip-icon chip-icon-indigo">✦</div>
                <div className="chip-text"><strong>IA Pedagógica</strong><span>Alinhada à BNCC</span></div>
              </div>
              <div className="mockup-window">
                <div className="mockup-titlebar">
                  <span className="m-dot m-dot-r"></span>
                  <span className="m-dot m-dot-y"></span>
                  <span className="m-dot m-dot-g"></span>
                  <div className="mockup-url">preparaaula.com.br/nova-aula</div>
                </div>
                <div className="mockup-content">
                  <div className="mockup-layout">
                    <div className="mockup-sidebar">
                      <div className="mockup-nav-item active"><span className="mockup-nav-dot"></span>Nova aula</div>
                      <div className="mockup-nav-item"><span className="mockup-nav-dot"></span>Minhas aulas</div>
                      <div className="mockup-nav-item"><span className="mockup-nav-dot"></span>Recursos</div>
                      <div className="mockup-nav-item"><span className="mockup-nav-dot"></span>Plano de aula</div>
                    </div>
                    <div className="mockup-main">
                      <div className="mockup-prompt-box">
                        <div className="mockup-prompt-label">Descreva sua aula</div>
                        <div className="mockup-prompt-text">Fotossíntese para 7º ano, 50 minutos. Foco no processo e importância para os ecossistemas.<span className="mockup-cursor"></span></div>
                      </div>
                      <div className="mockup-progress">
                        <div className="mockup-progress-bar-wrap"><div className="mockup-progress-bar"></div></div>
                        <div className="mockup-progress-label">⚡ Gerando...</div>
                      </div>
                      <div className="mockup-cards-grid">
                        <div className="mockup-card done"><div className="mockup-card-icon">📊</div><div className="mockup-card-name">Slides</div><div className="mockup-card-status">18 slides prontos ✓</div></div>
                        <div className="mockup-card done"><div className="mockup-card-icon">📋</div><div className="mockup-card-name">Plano de Aula</div><div className="mockup-card-status">BNCC alinhado ✓</div></div>
                        <div className="mockup-card done"><div className="mockup-card-icon">🎙️</div><div className="mockup-card-name">Roteiro</div><div className="mockup-card-status">Por slide ✓</div></div>
                        <div className="mockup-card done"><div className="mockup-card-icon">📝</div><div className="mockup-card-name">Exercícios</div><div className="mockup-card-status">5 questões + gabarito ✓</div></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="float-chip float-chip-1">
                <div className="chip-icon chip-icon-green">⚡</div>
                <div className="chip-text"><strong>Aula pronta em 2 min 47 s</strong><span>Pronta para exportar em PowerPoint</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section id="problem">
        <div className="container">
          <div className="problem-grid">
            <div className="problem-content">
              <div className="badge badge-indigo reveal" style={{marginBottom:'20px'}}>O problema</div>
              <h2 className="display-2 reveal reveal-delay-1">Preparar aulas consome tempo demais.</h2>
              <p className="body-lg reveal reveal-delay-2">O professor brasileiro passa horas por semana em tarefas repetitivas que deveriam levar minutos.</p>
              <div className="problem-cards">
                {[
                  {icon:'⏰',title:'Muito tempo preparando aulas',desc:'Horas gastas em criação manual de conteúdo todo começo de semana.'},
                  {icon:'🗂️',title:'Dificuldade para estruturar conteúdo',desc:'Sem uma estrutura clara, a aula perde fluidez e os alunos se perdem.'},
                  {icon:'🖼️',title:'Criação demorada de slides e atividades',desc:'Design, diagramação e elaboração de exercícios tomam horas preciosas.'},
                  {icon:'📅',title:'Falta de organização no planejamento',desc:'Planos pedagógicos manuais são incompletos e difíceis de manter.'},
                ].map((c,i) => (
                  <div key={i} className={`problem-card reveal reveal-delay-${i+1}`}>
                    <div className="problem-icon">{c.icon}</div>
                    <div className="problem-card-text"><strong>{c.title}</strong><span>{c.desc}</span></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="problem-visual reveal reveal-delay-2">
              <div className="time-card">
                <div className="time-card-label">Tempo de preparação por aula</div>
                <div className="time-comparison">
                  <div><div className="time-before">2h</div><div className="time-sub" style={{color:'var(--slate-300)'}}>Sem IA</div></div>
                  <div className="time-arrow">→</div>
                  <div><div className="time-after">3min</div><div className="time-sub" style={{color:'var(--indigo)',fontWeight:600}}>Com Prepara Aula</div></div>
                </div>
                <div className="time-sub">97% menos tempo investido</div>
                <div style={{marginTop:'24px',height:'8px',background:'var(--slate-100)',borderRadius:'99px',overflow:'hidden'}}>
                  <div style={{width:'3%',height:'100%',background:'linear-gradient(90deg,var(--indigo),var(--violet))',borderRadius:'99px'}}></div>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',marginTop:'6px'}}>
                  <span style={{fontSize:'.7rem',color:'var(--indigo)',fontWeight:700}}>3 min</span>
                  <span style={{fontSize:'.7rem',color:'var(--slate-300)'}}>2 horas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="como-funciona">
        <div className="container">
          <div className="section-header">
            <div className="badge badge-indigo reveal">Como funciona</div>
            <h2 className="display-2 reveal reveal-delay-1">Três passos para uma aula completa</h2>
            <p className="reveal reveal-delay-2">Sem templates genéricos. A IA entende o seu contexto e cria do zero — para a sua turma, no seu tempo.</p>
          </div>
          <div className="steps-list">
            {[
              {n:'01',t:'Descreva sua aula',p:'Escreva em linguagem natural: o que quer ensinar, para qual turma e quanto tempo tem disponível.'},
              {n:'02',t:'IA gera em segundos',p:'O sistema cria slides completos, plano pedagógico, roteiro do professor e exercícios com gabarito.'},
              {n:'03',t:'Exporte e use',p:'Edite o que quiser, baixe em PowerPoint e leve para a sala de aula. Tudo em minutos.'},
            ].map((s,i) => (
              <div key={i} className={`step reveal reveal-delay-${i+1}`}>
                <div className="step-num-wrap"><span className="step-num">{s.n}</span></div>
                <h3 className="h3" style={{marginBottom:'12px'}}>{s.t}</h3>
                <p className="body">{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="recursos">
        <div className="container">
          <div className="section-header">
            <div className="badge badge-indigo reveal">Recursos</div>
            <h2 className="display-2 reveal reveal-delay-1">Tudo que o professor precisa, em um lugar</h2>
            <p className="reveal reveal-delay-2">Cada aula segue estrutura pedagógica completa — introdução, desenvolvimento, atividade e revisão.</p>
          </div>
          <div className="features-bento">
            {[
              {icon:'📊',bg:'fi-1',t:'Slides prontos',p:'Até 20 slides com estrutura pedagógica, design profissional e conteúdo didático de qualidade.'},
              {icon:'📋',bg:'fi-2',t:'Plano de aula + BNCC',p:'Objetivos, competências e habilidades da BNCC preenchidos automaticamente para cada aula.'},
              {icon:'🎙️',bg:'fi-3',t:'Roteiro do professor',p:'O que falar em cada slide: pontos-chave, perguntas para engajar a turma e dicas práticas.'},
              {icon:'📝',bg:'fi-4',t:'Exercícios + gabarito',p:'5 exercícios por aula — múltipla escolha e dissertativas — com gabarito completo e comentado.'},
              {icon:'💾',bg:'fi-5',t:'Exportação PowerPoint',p:'Baixe em .pptx e edite no PowerPoint, Google Slides ou Keynote. Compatibilidade total.'},
              {icon:'🎨',bg:'fi-6',t:'6 paletas de cores',p:'Personalize com a identidade da sua escola. Disponível no plano Escola.'},
            ].map((f,i) => (
              <div key={i} className={`feature-tile reveal reveal-delay-${i+1}`}>
                <div className={`feature-tile-icon ${f.bg}`}>{f.icon}</div>
                <h3 className="h3" style={{marginBottom:'10px'}}>{f.t}</h3>
                <p className="body">{f.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREVIEW */}
      <section id="preview" style={{paddingTop:'100px'}}>
        <div className="container">
          <div className="preview-inner">
            <div className="badge badge-white reveal" style={{marginBottom:'20px'}}>Plataforma</div>
            <h2 className="display-2 reveal reveal-delay-1">Veja a plataforma em ação</h2>
            <p className="reveal reveal-delay-2">Interface limpa, resultado profissional. Do prompt à aula completa em minutos.</p>
            <div className="preview-screen reveal reveal-delay-3">
              <div className="preview-topbar">
                <span className="p-dot p-dot-r"></span><span className="p-dot p-dot-y"></span><span className="p-dot p-dot-g"></span>
                <div className="preview-url">preparaaula.com.br/dashboard</div>
              </div>
              <div className="preview-body">
                <div className="preview-side">
                  <div className="p-nav active"><span className="p-nav-icon">✨</span> Nova aula</div>
                  <div className="p-nav"><span className="p-nav-icon">📁</span> Minhas aulas</div>
                  <div className="p-nav"><span className="p-nav-icon">📊</span> Slides</div>
                  <div className="p-nav"><span className="p-nav-icon">📋</span> Planos</div>
                  <div className="p-nav"><span className="p-nav-icon">📝</span> Exercícios</div>
                  <div className="p-nav"><span className="p-nav-icon">⚙️</span> Configurações</div>
                </div>
                <div className="preview-main">
                  <div className="p-greeting">Olá, <strong>Profa. Ana Paula</strong> 👋 Qual aula vamos criar hoje?</div>
                  <div className="p-create-box">
                    <div className="p-label">Descreva sua aula</div>
                    <div className="p-input">Sistemas do corpo humano — circulatório — para o 8º ano. 50 minutos. Turma animada, gosto de perguntas interativas.<span className="p-cursor"></span></div>
                    <div className="p-btn">⚡ Gerar aula completa</div>
                  </div>
                  <div className="p-cards">
                    {[
                      {icon:'📊',title:'Slides',desc:'20 slides com design profissional'},
                      {icon:'📋',title:'Plano de Aula',desc:'Objetivos + BNCC EF08CI08'},
                      {icon:'🎙️',title:'Roteiro',desc:'Script completo por slide'},
                    ].map((c,i) => (
                      <div key={i} className="p-card">
                        <div className="p-card-icon">{c.icon}</div>
                        <div className="p-card-title">{c.title}</div>
                        <div className="p-card-desc">{c.desc}</div>
                        <div className="p-card-badge">Pronto ✓</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="depoimentos">
        <div className="container">
          <div className="section-header">
            <div className="badge badge-indigo reveal">Depoimentos</div>
            <h2 className="display-2 reveal reveal-delay-1">O que os professores estão dizendo</h2>
          </div>
          <div className="testimonials-grid">
            {[
              {av:'AP',cls:'av-1',stars:'★★★★★',q:'Antes eu gastava 2 horas preparando uma aula. Agora levo 5 minutos. O conteúdo gerado é melhor do que eu fazia manualmente.',name:'Ana Paula S.',role:'Professora de Biologia · SP'},
              {av:'MR',cls:'av-2',stars:'★★★★★',q:'O roteiro do professor é incrível. Ele sugere perguntas que nunca me ocorreriam e minha turma ficou muito mais engajada.',name:'Marcos R.',role:'Professor de História · BH'},
              {av:'CM',cls:'av-3',stars:'★★★★★',q:'Preparei 30 aulas para o semestre inteiro em um dia. O que levaria semanas ficou pronto rapidamente. Vale cada centavo.',name:'Carla M.',role:'Coordenadora Pedagógica · RJ'},
            ].map((t,i) => (
              <div key={i} className={`tcard reveal reveal-delay-${i+1}`}>
                <div className="tcard-stars">{t.stars}</div>
                <blockquote>"{t.q}"</blockquote>
                <div className="tcard-author">
                  <div className={`tcard-avatar ${t.cls}`}>{t.av}</div>
                  <div><div className="tcard-name">{t.name}</div><div className="tcard-role">{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="planos">
        <div className="container">
          <div className="section-header">
            <div className="badge badge-indigo reveal">Planos</div>
            <h2 className="display-2 reveal reveal-delay-1">Menos de R$3 por aula completa</h2>
            <p className="reveal reveal-delay-2">Sem fidelidade. Cancele quando quiser. PIX, cartão ou boleto.</p>
          </div>
          <div className="pricing-grid">
            <div className="pcard reveal reveal-delay-1">
              <div className="pcard-tier">Starter</div>
              <div className="pcard-price"><sup>R$</sup><strong>57</strong><em>/mês</em></div>
              <div className="pcard-tagline">Para começar a usar IA nas suas aulas</div>
              <ul className="pcard-features">
                {['20 aulas por mês','Até 20 slides por aula','Plano de aula + BNCC','Exercícios com gabarito','Exportação PowerPoint','Suporte por e-mail'].map((f,i) => <li key={i}><span className="pcheck">✓</span>{f}</li>)}
              </ul>
              <a href={CAKTO_STARTER} target="_blank" className="btn btn-secondary" style={{width:'100%'}}>Começar com Starter</a>
            </div>
            <div className="pcard pcard-popular reveal reveal-delay-2">
              <div className="pop-badge">⭐ MAIS POPULAR</div>
              <div className="pcard-tier">Profissional</div>
              <div className="pcard-price"><sup>R$</sup><strong>97</strong><em>/mês</em></div>
              <div className="pcard-tagline">Para professores que usam IA todo dia</div>
              <ul className="pcard-features">
                {['35 aulas por mês','Até 20 slides por aula','Plano de aula + BNCC','Exercícios com gabarito','Exportação PowerPoint','Edição de slides','Suporte prioritário'].map((f,i) => <li key={i}><span className="pcheck">✓</span>{f}</li>)}
              </ul>
              <a href={CAKTO_PROFISSIONAL} target="_blank" className="btn btn-primary" style={{width:'100%'}}>Escolher Profissional →</a>
            </div>
            <div className="pcard reveal reveal-delay-3">
              <div className="pcard-tier">Escola</div>
              <div className="pcard-price"><sup>R$</sup><strong>197</strong><em>/mês</em></div>
              <div className="pcard-tagline">Para coordenadores e escolas inteiras</div>
              <ul className="pcard-features">
                {['60 aulas por mês','Até 20 slides por aula','Plano de aula + BNCC','Exercícios com gabarito','Exportação PowerPoint','Edição de slides','6 paletas de cores','Suporte via WhatsApp'].map((f,i) => <li key={i}><span className="pcheck">✓</span>{f}</li>)}
              </ul>
              <a href={CAKTO_ESCOLA} target="_blank" className="btn btn-secondary" style={{width:'100%'}}>Escolher Escola</a>
            </div>
          </div>
          <p className="pricing-footnote reveal">Sem fidelidade · Cancele a qualquer momento · Pagamento seguro via Cakto</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq">
        <div className="container">
          <div className="section-header">
            <div className="badge badge-indigo reveal">FAQ</div>
            <h2 className="display-2 reveal reveal-delay-1">Perguntas frequentes</h2>
          </div>
          <div className="faq-wrap reveal reveal-delay-2">
            {[
              {q:'Como funciona o acesso?',a:'Após assinar, você recebe um link por e-mail para criar sua senha e acessar o dashboard. O acesso é liberado automaticamente em minutos.'},
              {q:'Posso cancelar quando quiser?',a:'Sim. Basta enviar um e-mail para suporte@preparaaula.com.br antes da próxima cobrança. Sem burocracia, sem multa.'},
              {q:'O conteúdo é alinhado à BNCC?',a:'Sim. Cada aula gerada inclui objetivos, competências e habilidades da BNCC correspondentes à disciplina e nível escolar informados.'},
              {q:'Posso editar os slides gerados?',a:'Nos planos Profissional e Escola você edita diretamente na plataforma. Todos os planos exportam em PowerPoint para edição livre.'},
              {q:'Quais formas de pagamento?',a:'Aceitamos PIX (sem taxa), cartão de crédito e boleto bancário. Pagamento processado com segurança pela Cakto.'},
              {q:'O limite de aulas reseta todo mês?',a:'Sim. No primeiro dia de cada mês o contador zera automaticamente, independente de quando você assinou.'},
            ].map((f,i) => (
              <details key={i}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section id="cta-final">
        <div className="cta-glow"></div>
        <div className="container">
          <div className="cta-final-content">
            <div className="badge badge-white reveal" style={{marginBottom:'24px'}}>Comece hoje</div>
            <h2 className="display-2 reveal reveal-delay-1">Comece hoje. Sua próxima aula em 3 minutos.</h2>
            <p className="reveal reveal-delay-2">Professores que usam IA preparam aulas melhores em muito menos tempo.</p>
            <div className="btn-group reveal reveal-delay-3" style={{justifyContent:'center'}}>
              <a href={CAKTO_PROFISSIONAL} target="_blank" className="btn-cta-white">Escolher meu plano →</a>
              <a href="/login" className="btn btn-ghost-white btn-xl">Já tenho conta</a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <a href="/" className="nav-logo" style={{marginBottom:'14px',display:'inline-flex'}}>
                <div className="nav-logo-mark">
                  <img src={ICON_SRC} alt="Prepara Aula" />
                </div>
                <span style={{color:'#fff',fontWeight:800,fontSize:'1.05rem'}}>Prepara Aula</span>
              </a>
              <p>Sua aula pronta em minutos.<br/>Inteligência artificial para educadores brasileiros.</p>
            </div>
            <div className="footer-col"><h4>Produto</h4><ul><li><a href="#como-funciona">Como funciona</a></li><li><a href="#recursos">Recursos</a></li><li><a href="#planos">Planos</a></li></ul></div>
            <div className="footer-col"><h4>Conta</h4><ul><li><a href="/login">Entrar</a></li></ul></div>
            <div className="footer-col"><h4>Suporte</h4><ul><li><a href="mailto:suporte@preparaaula.com.br">suporte@preparaaula.com.br</a></li></ul></div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Prepara Aula · Todos os direitos reservados</p>
            <div className="footer-pills">
              <span className="footer-pill">Pagamentos via Cakto</span>
              <span className="footer-pill">Desenvolvido com amor e carinho</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}