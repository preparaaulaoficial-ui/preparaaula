export default function Home() {
  const CAKTO_STARTER      = 'https://pay.cakto.com.br/zybn2t8_802724'
  const CAKTO_PROFISSIONAL = 'https://pay.cakto.com.br/ay95nr9_802729'
  const CAKTO_ESCOLA       = 'https://pay.cakto.com.br/9hsh5ar_802731'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Mulish:wght@300;400;500;600&display=swap');
        :root{--navy:#152664;--sky:#cbe7fe;--cream:#f4e3d0;--black:#0d0d0d;--white:#ffffff;--navy2:#1c3278;--cream2:#ecdcc8;--muted:rgba(21,38,100,0.45);}
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{font-family:'Mulish',sans-serif;background:var(--white);color:var(--black);overflow-x:hidden;-webkit-font-smoothing:antialiased;}
        nav{position:fixed;top:0;left:0;right:0;z-index:200;height:72px;padding:0 56px;display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,0.94);backdrop-filter:blur(16px);border-bottom:1px solid rgba(21,38,100,0.07);}
        .logo{display:flex;align-items:center;gap:11px;text-decoration:none;}
        .logo-mark{width:38px;height:38px;border-radius:11px;background:var(--navy);display:flex;align-items:center;justify-content:center;}
        .logo-mark svg{width:20px;height:20px;}
        .logo-name{font-family:'Playfair Display',serif;font-size:19px;color:var(--navy);letter-spacing:-0.01em;}
        .nav-menu{display:flex;align-items:center;gap:32px;list-style:none;}
        .nav-menu a{font-size:13.5px;font-weight:500;color:var(--navy);opacity:0.55;text-decoration:none;transition:opacity 0.2s;}
        .nav-menu a:hover{opacity:1;}
        .nav-btn{height:40px;padding:0 22px;background:var(--navy);color:var(--white)!important;opacity:1!important;border-radius:100px;font-weight:600!important;font-size:13px!important;display:inline-flex;align-items:center;gap:6px;transition:background 0.2s,transform 0.2s!important;}
        .nav-btn:hover{background:var(--navy2)!important;transform:translateY(-1px)!important;}
        .hero{min-height:100vh;background:var(--navy);padding-top:72px;display:grid;grid-template-columns:1fr 1fr;align-items:stretch;position:relative;overflow:hidden;}
        .hero-left{padding:100px 64px 100px 56px;display:flex;flex-direction:column;justify-content:center;position:relative;z-index:2;}
        .hero-eyebrow{display:inline-flex;align-items:center;gap:9px;margin-bottom:36px;opacity:0;animation:up 0.7s ease 0.1s forwards;}
        .eyebrow-dot{width:7px;height:7px;border-radius:50%;background:var(--sky);animation:blink 2.4s infinite;}
        @keyframes blink{0%,100%{opacity:1;}50%{opacity:0.3;}}
        .eyebrow-text{font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--sky);opacity:0.8;}
        .hero-h1{font-family:'Playfair Display',serif;font-size:clamp(50px,5.5vw,78px);color:var(--white);line-height:1.06;letter-spacing:-0.03em;margin-bottom:28px;opacity:0;animation:up 0.7s ease 0.2s forwards;}
        .hero-h1 em{font-style:italic;color:var(--cream);}
        .hero-sub{font-size:17px;font-weight:300;color:rgba(255,255,255,0.55);line-height:1.75;max-width:420px;margin-bottom:48px;opacity:0;animation:up 0.7s ease 0.3s forwards;}
        .hero-actions{display:flex;align-items:center;gap:14px;flex-wrap:wrap;opacity:0;animation:up 0.7s ease 0.4s forwards;}
        .btn-hero{height:52px;padding:0 32px;border-radius:100px;font-size:14.5px;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:8px;transition:all 0.22s;border:none;cursor:pointer;}
        .btn-hero-primary{background:var(--cream);color:var(--navy);}
        .btn-hero-primary:hover{background:var(--cream2);transform:translateY(-2px);box-shadow:0 12px 32px rgba(244,227,208,0.22);}
        .btn-hero-ghost{background:transparent;color:rgba(255,255,255,0.65);border:1px solid rgba(255,255,255,0.2);}
        .btn-hero-ghost:hover{border-color:rgba(255,255,255,0.5);color:#fff;}
        .hero-stats{display:flex;gap:40px;margin-top:64px;padding-top:40px;border-top:1px solid rgba(255,255,255,0.1);opacity:0;animation:up 0.7s ease 0.5s forwards;}
        .stat-val{font-family:'Playfair Display',serif;font-size:34px;letter-spacing:-0.03em;color:var(--cream);}
        .stat-label{font-size:12px;color:rgba(255,255,255,0.4);margin-top:3px;line-height:1.4;}
        .hero-right{position:relative;background:rgba(255,255,255,0.03);border-left:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;justify-content:center;overflow:hidden;opacity:0;animation:fadeIn 1s ease 0.6s forwards;}
        @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
        .hero-mockup{width:78%;max-width:400px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.11);border-radius:20px;overflow:hidden;backdrop-filter:blur(8px);box-shadow:0 32px 80px rgba(0,0,0,0.4);}
        .mh{background:rgba(255,255,255,0.07);padding:14px 18px;display:flex;align-items:center;gap:7px;border-bottom:1px solid rgba(255,255,255,0.07);}
        .dot{width:10px;height:10px;border-radius:50%;}
        .dr{background:#ff5f57;}.dy{background:#febc2e;}.dg{background:#28c840;}
        .mb{padding:22px 20px;}
        .ml{font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-bottom:10px;}
        .mf{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:12px 16px;font-size:13px;color:rgba(255,255,255,0.7);margin-bottom:10px;font-weight:300;}
        .mf-a{border-color:var(--sky);color:var(--white);}
        .mg{display:flex;align-items:center;gap:10px;margin:14px 0;font-size:12px;color:var(--sky);font-weight:500;}
        .tdots span{display:inline-block;width:5px;height:5px;border-radius:50%;background:var(--sky);animation:bounce 1.2s infinite;}
        .tdots span:nth-child(2){animation-delay:0.2s;}.tdots span:nth-child(3){animation-delay:0.4s;}
        @keyframes bounce{0%,60%,100%{transform:translateY(0);}30%{transform:translateY(-5px);}}
        .ms{background:#1c3278;border-radius:10px;padding:14px;margin-bottom:8px;border:1px solid rgba(203,231,254,0.13);}
        .sb{height:7px;border-radius:4px;background:rgba(255,255,255,0.11);margin-bottom:7px;}
        .sb.w{width:80%;}.sb.m{width:60%;}.sb.s{width:40%;background:rgba(203,231,254,0.18);}
        .sr{height:5px;border-radius:3px;background:rgba(255,255,255,0.07);margin-top:4px;}
        .mfoot{padding:14px 18px;border-top:1px solid rgba(255,255,255,0.06);display:flex;justify-content:space-between;align-items:center;}
        .mtag{font-size:10px;background:rgba(203,231,254,0.1);color:var(--sky);border-radius:5px;padding:4px 10px;font-weight:600;letter-spacing:0.06em;}
        .mcnt{font-size:10px;color:rgba(255,255,255,0.28);}
        .blob{position:absolute;border-radius:50%;pointer-events:none;}
        .b1{width:500px;height:500px;background:radial-gradient(circle,rgba(203,231,254,0.07) 0%,transparent 70%);top:-150px;right:-100px;animation:drift 9s ease-in-out infinite;}
        .b2{width:300px;height:300px;background:radial-gradient(circle,rgba(244,227,208,0.05) 0%,transparent 70%);bottom:10%;left:55%;animation:drift 7s ease-in-out infinite reverse;}
        @keyframes drift{0%,100%{transform:translateY(0);}50%{transform:translateY(-18px);}}
        @keyframes up{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
        .ticker{background:var(--sky);height:46px;overflow:hidden;display:flex;align-items:center;}
        .ticker-inner{display:flex;align-items:center;animation:tick 28s linear infinite;white-space:nowrap;}
        @keyframes tick{from{transform:translateX(0);}to{transform:translateX(-50%);}}
        .ti{display:inline-flex;align-items:center;gap:10px;padding:0 28px;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--navy);opacity:0.6;}
        .ts{width:4px;height:4px;border-radius:50%;background:var(--navy);opacity:0.3;flex-shrink:0;}
        .sec{padding:104px 56px;}
        .tag{display:inline-flex;align-items:center;gap:7px;font-size:10.5px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--navy);opacity:0.45;margin-bottom:18px;}
        .tdot{width:5px;height:5px;border-radius:50%;background:currentColor;opacity:1;}
        .heading{font-family:'Playfair Display',serif;font-size:clamp(38px,4.2vw,58px);color:var(--navy);letter-spacing:-0.03em;line-height:1.08;margin-bottom:18px;}
        .heading em{font-style:italic;color:var(--muted);}
        .hl{color:var(--white);}.hl em{color:rgba(244,227,208,0.6);}
        .subtext{font-size:16.5px;font-weight:300;color:rgba(13,13,13,0.5);line-height:1.75;max-width:460px;}
        .sl{color:rgba(255,255,255,0.45);}
        .how-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;margin-top:64px;background:rgba(21,38,100,0.07);border-radius:22px;overflow:hidden;}
        .how-card{background:#fff;padding:52px 44px;transition:background 0.3s;cursor:default;}
        .how-card:hover{background:var(--cream);}
        .how-num{font-family:'Playfair Display',serif;font-size:80px;line-height:1;letter-spacing:-0.05em;color:rgba(21,38,100,0.07);margin-bottom:28px;}
        .how-icon{width:50px;height:50px;border-radius:14px;background:var(--navy);display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:22px;}
        .how-card h3{font-family:'Playfair Display',serif;font-size:22px;color:var(--navy);letter-spacing:-0.02em;margin-bottom:12px;}
        .how-card p{font-size:14.5px;font-weight:300;color:rgba(13,13,13,0.52);line-height:1.75;}
        .feat-sec{background:var(--navy);padding:104px 56px;}
        .feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;margin-top:64px;background:rgba(255,255,255,0.07);border-radius:22px;overflow:hidden;}
        .feat-card{background:rgba(255,255,255,0.03);padding:44px 38px;transition:background 0.3s;}
        .feat-card:hover{background:rgba(203,231,254,0.06);}
        .feat-icon{font-size:30px;margin-bottom:20px;display:block;}
        .feat-card h3{font-family:'Playfair Display',serif;font-size:19px;color:var(--cream);letter-spacing:-0.02em;margin-bottom:10px;}
        .feat-card p{font-size:14px;font-weight:300;color:rgba(255,255,255,0.42);line-height:1.75;}
        .test-sec{background:var(--cream);padding:104px 56px;}
        .test-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:64px;}
        .test-card{background:#fff;border-radius:20px;padding:38px;display:flex;flex-direction:column;justify-content:space-between;transition:transform 0.25s,box-shadow 0.25s;}
        .test-card:hover{transform:translateY(-5px);box-shadow:0 20px 60px rgba(21,38,100,0.1);}
        .test-stars{color:#d4a017;font-size:13px;margin-bottom:14px;}
        .test-qm{font-family:'Playfair Display',serif;font-size:56px;color:var(--navy);opacity:0.1;line-height:0.8;margin-bottom:14px;}
        .test-card p{font-size:14.5px;font-weight:300;color:rgba(13,13,13,0.62);line-height:1.75;margin-bottom:28px;flex:1;}
        .test-author{display:flex;align-items:center;gap:12px;}
        .test-av{width:42px;height:42px;border-radius:50%;background:var(--navy);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:17px;color:var(--cream);}
        .test-name{font-size:13.5px;font-weight:600;color:var(--navy);}
        .test-role{font-size:12px;font-weight:300;color:rgba(13,13,13,0.4);margin-top:2px;}
        .price-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:64px;align-items:start;}
        .price-card{border-radius:20px;padding:40px 36px;border:1.5px solid rgba(21,38,100,0.1);transition:all 0.28s;}
        .price-card:hover{border-color:var(--navy);transform:translateY(-5px);box-shadow:0 24px 60px rgba(21,38,100,0.1);}
        .price-card.hi{background:var(--navy);border-color:var(--navy);}
        .price-card.hi:hover{box-shadow:0 24px 60px rgba(21,38,100,0.28);}
        .pbadge{display:inline-block;background:var(--cream);color:var(--navy);font-size:10.5px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:5px 14px;border-radius:100px;margin-bottom:26px;}
        .pname{font-family:'Playfair Display',serif;font-size:22px;color:var(--navy);margin-bottom:6px;letter-spacing:-0.02em;}
        .hi .pname{color:var(--cream);}
        .pdesc{font-size:13px;font-weight:300;color:rgba(13,13,13,0.48);margin-bottom:28px;}
        .hi .pdesc{color:rgba(255,255,255,0.45);}
        .pval{font-family:'Playfair Display',serif;font-size:52px;color:var(--navy);letter-spacing:-0.04em;line-height:1;margin-bottom:4px;}
        .hi .pval{color:#fff;}
        .pper{font-size:13px;color:rgba(13,13,13,0.38);margin-bottom:32px;}
        .hi .pper{color:rgba(255,255,255,0.38);}
        .plist{list-style:none;margin-bottom:36px;}
        .plist li{display:flex;align-items:flex-start;gap:10px;font-size:14px;font-weight:300;color:rgba(13,13,13,0.62);padding:9px 0;border-bottom:1px solid rgba(21,38,100,0.06);line-height:1.5;}
        .hi .plist li{color:rgba(255,255,255,0.62);border-bottom-color:rgba(255,255,255,0.08);}
        .plist li:last-child{border-bottom:none;}
        .ck{color:var(--navy);font-size:14px;}
        .hi .ck{color:var(--sky);}
        .btn-p{display:flex;align-items:center;justify-content:center;width:100%;height:48px;border-radius:100px;border:none;cursor:pointer;font-size:14px;font-weight:600;text-decoration:none;transition:all 0.22s;}
        .btn-po{background:transparent;color:var(--navy);border:1.5px solid rgba(21,38,100,0.2);}
        .btn-po:hover{background:var(--navy);color:#fff;}
        .btn-pf{background:var(--cream);color:var(--navy);}
        .btn-pf:hover{background:var(--cream2);transform:translateY(-1px);}
        .faq-grid{display:grid;grid-template-columns:1fr 1fr;gap:2px;margin-top:64px;background:rgba(21,38,100,0.06);border-radius:22px;overflow:hidden;}
        .faq-item{background:#fff;padding:38px 44px;transition:background 0.25s;}
        .faq-item:hover{background:#f7f9ff;}
        .faq-q{font-family:'Playfair Display',serif;font-size:18px;color:var(--navy);letter-spacing:-0.02em;margin-bottom:12px;}
        .faq-a{font-size:14px;font-weight:300;color:rgba(13,13,13,0.5);line-height:1.75;}
        .cta-sec{background:var(--navy);padding:120px 56px;text-align:center;position:relative;overflow:hidden;}
        .cta-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:600px;height:600px;background:radial-gradient(circle,rgba(203,231,254,0.09) 0%,transparent 65%);pointer-events:none;}
        .cta-actions{display:flex;justify-content:center;gap:14px;flex-wrap:wrap;position:relative;z-index:1;}
        footer{background:var(--black);padding:64px 56px 40px;}
        .footer-top{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:52px;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:32px;gap:48px;flex-wrap:wrap;}
        .footer-brand .logo-name{color:var(--cream);}
        .footer-tag{font-size:13px;font-weight:300;color:rgba(255,255,255,0.3);margin-top:10px;line-height:1.6;}
        .footer-cols{display:flex;gap:56px;flex-wrap:wrap;}
        .footer-col h5{font-size:10.5px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.28);margin-bottom:18px;}
        .footer-col a{display:block;font-size:14px;font-weight:300;color:rgba(255,255,255,0.48);text-decoration:none;margin-bottom:11px;transition:color 0.2s;}
        .footer-col a:hover{color:rgba(255,255,255,0.88);}
        .footer-bot{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;}
        .footer-copy{font-size:12px;font-weight:300;color:rgba(255,255,255,0.22);}
        @media(max-width:960px){
          nav{padding:0 24px;}
          .nav-menu li:not(:last-child):not(:nth-last-child(2)){display:none;}
          .hero{grid-template-columns:1fr;min-height:auto;}
          .hero-right{display:none;}
          .hero-left{padding:80px 24px 64px;}
          .sec,.feat-sec,.test-sec,.cta-sec{padding:64px 24px;}
          .how-grid,.feat-grid{grid-template-columns:1fr;}
          .test-grid,.price-grid{grid-template-columns:1fr;}
          .faq-grid{grid-template-columns:1fr;}
          footer{padding:48px 24px 32px;}
          .footer-top{flex-direction:column;gap:32px;}
          .footer-bot{flex-direction:column;text-align:center;}
        }
      `}</style>

      <nav>
        <a href="/" className="logo">
          <div className="logo-mark">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M20 3C14 5 10 11 7 16C6 18 5 21 5 21C7 19 9 18 11 17.5C11 17.5 10 14 14 10C17 7 20 3 20 3Z" fill="#f4e3d0"/>
              <path d="M5 21C5.5 20 6.5 19.2 7.5 18.8" stroke="#f4e3d0" strokeWidth="1.3" strokeLinecap="round"/>
              <path d="M3.5 22.5C4.5 22 5.8 21.4 7 21" stroke="#f4e3d0" strokeWidth="1" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="logo-name">Prepara Aula</span>
        </a>
        <ul className="nav-menu">
          <li><a href="#como-funciona">Como funciona</a></li>
          <li><a href="#recursos">Recursos</a></li>
          <li><a href="#planos">Planos</a></li>
          <li><a href="/login">Entrar</a></li>
          <li><a href={CAKTO_PROFISSIONAL} target="_blank" className="nav-btn">Começar agora →</a></li>
        </ul>
      </nav>

      <section className="hero">
        <div className="blob b1"></div>
        <div className="blob b2"></div>
        <div className="hero-left">
          <div className="hero-eyebrow"><div className="eyebrow-dot"></div><span className="eyebrow-text">IA para Educadores Brasileiros</span></div>
          <h1 className="hero-h1">Sua aula<br/><em>pronta</em><br/>em minutos.</h1>
          <p className="hero-sub">Descreva o tema, a turma e o tempo disponível — e a IA gera slides, plano de aula, roteiro do professor e exercícios alinhados à BNCC.</p>
          <div className="hero-actions">
            <a href={CAKTO_PROFISSIONAL} target="_blank" className="btn-hero btn-hero-primary">Criar minha primeira aula →</a>
            <a href="#como-funciona" className="btn-hero btn-hero-ghost">Como funciona</a>
          </div>
          <div className="hero-stats">
            <div><div className="stat-val">3 min</div><div className="stat-label">Tempo médio<br/>por aula</div></div>
            <div><div className="stat-val">20+</div><div className="stat-label">Slides por<br/>apresentação</div></div>
            <div><div className="stat-val">100%</div><div className="stat-label">Alinhado<br/>à BNCC</div></div>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-mockup">
            <div className="mh"><div className="dot dr"></div><div className="dot dy"></div><div className="dot dg"></div></div>
            <div className="mb">
              <div className="ml">Descreva sua aula</div>
              <div className="mf mf-a">Revolução Industrial · 9º ano · 50 min</div>
              <div className="mf">Disciplina: História · Ens. Fundamental</div>
              <div className="mg"><div className="tdots"><span></span><span></span><span></span></div>Gerando sua aula completa...</div>
              <div className="ms"><div className="sb w"></div><div className="sb m"></div><div className="sb s"></div><div className="sr" style={{width:'100%',marginTop:'10px'}}></div><div className="sr" style={{width:'75%'}}></div><div className="sr" style={{width:'55%'}}></div></div>
              <div className="ms" style={{opacity:0.5}}><div className="sb w"></div><div className="sb s"></div><div className="sr" style={{width:'100%',marginTop:'10px'}}></div><div className="sr" style={{width:'65%'}}></div></div>
            </div>
            <div className="mfoot"><span className="mtag">✦ BNCC incluída</span><span className="mcnt">Slide 1 / 16</span></div>
          </div>
        </div>
      </section>

      <div className="ticker">
        <div className="ticker-inner">
          {['Matemática','Português','História','Geografia','Ciências','Biologia','Física','Química','Filosofia','Sociologia','Inglês','Artes','Educação Física','Matemática','Português','História','Geografia','Ciências','Biologia','Física','Química','Filosofia','Sociologia','Inglês','Artes','Educação Física'].map((s,i) => (
            <span key={i} className="ti">{s}<span className="ts"></span></span>
          ))}
        </div>
      </div>

      <section className="sec" id="como-funciona">
        <div className="tag"><span className="tdot"></span> Como funciona</div>
        <h2 className="heading">Três passos para<br/><em>uma aula completa</em></h2>
        <p className="subtext">Sem templates genéricos. A IA entende o seu contexto e cria do zero — para a sua turma, no seu tempo.</p>
        <div className="how-grid">
          <div className="how-card"><div className="how-num">01</div><div className="how-icon">✍️</div><h3>Descreva sua aula</h3><p>Escreva em linguagem natural: o que quer ensinar, para qual turma e quanto tempo tem disponível.</p></div>
          <div className="how-card"><div className="how-num">02</div><div className="how-icon">🤖</div><h3>IA gera em segundos</h3><p>O sistema cria slides completos, plano pedagógico, roteiro do professor e exercícios com gabarito.</p></div>
          <div className="how-card"><div className="how-num">03</div><div className="how-icon">🎯</div><h3>Exporte e use</h3><p>Edite o que quiser, baixe em PowerPoint e leve para a sala de aula. Tudo em minutos.</p></div>
        </div>
      </section>

      <section className="feat-sec" id="recursos">
        <div className="tag" style={{color:'var(--sky)',opacity:0.7}}><span className="tdot"></span> Recursos</div>
        <h2 className="heading hl">Tudo que o professor<br/><em>precisa, em um lugar</em></h2>
        <p className="subtext sl">Cada aula segue estrutura pedagógica completa — introdução, desenvolvimento, atividade e revisão.</p>
        <div className="feat-grid">
          <div className="feat-card"><span className="feat-icon">📊</span><h3>Slides prontos</h3><p>Até 20 slides com estrutura pedagógica, design profissional e conteúdo didático de qualidade.</p></div>
          <div className="feat-card"><span className="feat-icon">📋</span><h3>Plano de aula + BNCC</h3><p>Objetivos, competências e habilidades da BNCC preenchidos automaticamente para cada aula.</p></div>
          <div className="feat-card"><span className="feat-icon">🎙️</span><h3>Roteiro do professor</h3><p>O que falar em cada slide: pontos-chave, perguntas para engajar a turma e dicas práticas.</p></div>
          <div className="feat-card"><span className="feat-icon">📝</span><h3>Exercícios + gabarito</h3><p>5 exercícios por aula — múltipla escolha e dissertativas — com gabarito completo e comentado.</p></div>
          <div className="feat-card"><span className="feat-icon">💾</span><h3>Exportação PowerPoint</h3><p>Baixe em .pptx e edite no PowerPoint, Google Slides ou Keynote. Compatibilidade total.</p></div>
          <div className="feat-card"><span className="feat-icon">🎨</span><h3>6 paletas de cores</h3><p>Personalize com a identidade da sua escola. Disponível no plano Escola.</p></div>
        </div>
      </section>

      <section className="test-sec">
        <div className="tag" style={{opacity:0.5}}><span className="tdot"></span> Depoimentos</div>
        <h2 className="heading">O que os professores<br/><em>estão dizendo</em></h2>
        <div className="test-grid">
          <div className="test-card"><div><div className="test-stars">★★★★★</div><div className="test-qm">"</div><p>Antes eu gastava 2 horas preparando uma aula. Agora levo 5 minutos. O conteúdo gerado é melhor do que eu fazia manualmente.</p></div><div className="test-author"><div className="test-av">A</div><div><div className="test-name">Ana Paula S.</div><div className="test-role">Professora de Biologia · SP</div></div></div></div>
          <div className="test-card"><div><div className="test-stars">★★★★★</div><div className="test-qm">"</div><p>O roteiro do professor é incrível. Ele sugere perguntas que nunca me ocorreriam e minha turma ficou muito mais engajada.</p></div><div className="test-author"><div className="test-av">M</div><div><div className="test-name">Marcos R.</div><div className="test-role">Professor de História · BH</div></div></div></div>
          <div className="test-card"><div><div className="test-stars">★★★★★</div><div className="test-qm">"</div><p>Preparei 30 aulas para o semestre inteiro em um dia. O que levaria semanas ficou pronto rapidamente. Vale cada centavo.</p></div><div className="test-author"><div className="test-av">C</div><div><div className="test-name">Carla M.</div><div className="test-role">Coordenadora Pedagógica · RJ</div></div></div></div>
        </div>
      </section>

      <section className="sec" id="planos">
        <div className="tag"><span className="tdot"></span> Planos</div>
        <h2 className="heading">Menos de <em>R$3</em><br/>por aula completa</h2>
        <p className="subtext">Sem fidelidade. Cancele quando quiser. PIX, cartão ou boleto.</p>
        <div className="price-grid">
          <div className="price-card">
            <div className="pname">Starter</div><div className="pdesc">Para começar a usar IA nas suas aulas</div>
            <div className="pval">R$57</div><div className="pper">por mês</div>
            <ul className="plist">
              <li><span className="ck">✓</span> 20 aulas por mês</li>
              <li><span className="ck">✓</span> Até 20 slides por aula</li>
              <li><span className="ck">✓</span> Plano de aula + BNCC</li>
              <li><span className="ck">✓</span> Exercícios com gabarito</li>
              <li><span className="ck">✓</span> Exportação PowerPoint</li>
              <li><span className="ck">✓</span> Suporte por e-mail</li>
            </ul>
            <a href={CAKTO_STARTER} target="_blank" className="btn-p btn-po">Assinar Starter →</a>
          </div>
          <div className="price-card hi">
            <div className="pbadge">⭐ Mais popular</div>
            <div className="pname">Profissional</div><div className="pdesc">Para professores que usam IA todo dia</div>
            <div className="pval">R$97</div><div className="pper">por mês</div>
            <ul className="plist">
              <li><span className="ck">✓</span> 35 aulas por mês</li>
              <li><span className="ck">✓</span> Até 20 slides por aula</li>
              <li><span className="ck">✓</span> Plano de aula + BNCC</li>
              <li><span className="ck">✓</span> Exercícios com gabarito</li>
              <li><span className="ck">✓</span> Exportação PowerPoint</li>
              <li><span className="ck">✓</span> Edição de slides</li>
              <li><span className="ck">✓</span> Suporte prioritário</li>
            </ul>
            <a href={CAKTO_PROFISSIONAL} target="_blank" className="btn-p btn-pf">Assinar Profissional →</a>
          </div>
          <div className="price-card">
            <div className="pname">Escola</div><div className="pdesc">Para coordenadores e escolas inteiras</div>
            <div className="pval">R$197</div><div className="pper">por mês</div>
            <ul className="plist">
              <li><span className="ck">✓</span> 60 aulas por mês</li>
              <li><span className="ck">✓</span> Até 20 slides por aula</li>
              <li><span className="ck">✓</span> Plano de aula + BNCC</li>
              <li><span className="ck">✓</span> Exercícios com gabarito</li>
              <li><span className="ck">✓</span> Exportação PowerPoint</li>
              <li><span className="ck">✓</span> Edição de slides</li>
              <li><span className="ck">✓</span> 6 paletas de cores</li>
              <li><span className="ck">✓</span> Suporte via WhatsApp</li>
            </ul>
            <a href={CAKTO_ESCOLA} target="_blank" className="btn-p btn-po">Assinar Escola →</a>
          </div>
        </div>
      </section>

      <section className="sec" id="faq" style={{background:'#f7f9ff',paddingTop:'80px',paddingBottom:'80px'}}>
        <div className="tag"><span className="tdot"></span> Dúvidas</div>
        <h2 className="heading">Perguntas<br/><em>frequentes</em></h2>
        <div className="faq-grid">
          <div className="faq-item"><div className="faq-q">Como funciona o acesso?</div><p className="faq-a">Após assinar, você recebe um link por e-mail para criar sua senha e acessar o dashboard. O acesso é liberado automaticamente em minutos.</p></div>
          <div className="faq-item"><div className="faq-q">Posso cancelar quando quiser?</div><p className="faq-a">Sim. Basta enviar um e-mail para suporte@preparaaula.com.br antes da próxima cobrança. Sem burocracia, sem multa.</p></div>
          <div className="faq-item"><div className="faq-q">O conteúdo é alinhado à BNCC?</div><p className="faq-a">Sim. Cada aula gerada inclui objetivos, competências e habilidades da BNCC correspondentes à disciplina e nível escolar informados.</p></div>
          <div className="faq-item"><div className="faq-q">Posso editar os slides gerados?</div><p className="faq-a">Nos planos Profissional e Escola você edita diretamente na plataforma. Todos os planos exportam em PowerPoint para edição livre.</p></div>
          <div className="faq-item"><div className="faq-q">Quais formas de pagamento?</div><p className="faq-a">Aceitamos PIX (sem taxa), cartão de crédito e boleto bancário. Pagamento processado com segurança pela Cakto.</p></div>
          <div className="faq-item"><div className="faq-q">O limite de aulas reseta todo mês?</div><p className="faq-a">Sim. No primeiro dia de cada mês o contador zera automaticamente, independente de quando você assinou.</p></div>
        </div>
      </section>

      <section className="cta-sec">
        <div className="cta-glow"></div>
        <div className="tag" style={{color:'var(--sky)',opacity:0.7,marginBottom:'20px',display:'flex',justifyContent:'center'}}><span className="tdot"></span> Comece hoje</div>
        <h2 className="heading hl" style={{margin:'0 auto 20px'}}>Comece hoje.<br/><em>Sua próxima aula</em><br/>em 3 minutos.</h2>
        <p className="subtext sl" style={{margin:'0 auto 48px',textAlign:'center'}}>Professores que usam IA preparam aulas melhores<br/>em muito menos tempo.</p>
        <div className="cta-actions">
          <a href={CAKTO_PROFISSIONAL} target="_blank" className="btn-hero btn-hero-primary">Escolher meu plano →</a>
          <a href="/login" className="btn-hero btn-hero-ghost">Já tenho conta</a>
        </div>
      </section>

      <footer>
        <div className="footer-top">
          <div className="footer-brand">
            <a href="/" className="logo">
              <div className="logo-mark">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M20 3C14 5 10 11 7 16C6 18 5 21 5 21C7 19 9 18 11 17.5C11 17.5 10 14 14 10C17 7 20 3 20 3Z" fill="#f4e3d0"/>
                  <path d="M5 21C5.5 20 6.5 19.2 7.5 18.8" stroke="#f4e3d0" strokeWidth="1.3" strokeLinecap="round"/>
                  <path d="M3.5 22.5C4.5 22 5.8 21.4 7 21" stroke="#f4e3d0" strokeWidth="1" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="logo-name">Prepara Aula</span>
            </a>
            <p className="footer-tag">Sua aula pronta em minutos.<br/>Inteligência artificial para educadores brasileiros.</p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <h5>Produto</h5>
              <a href="#como-funciona">Como funciona</a>
              <a href="#recursos">Recursos</a>
              <a href="#planos">Planos</a>
            </div>
            <div className="footer-col">
              <h5>Conta</h5>
              <a href="/login">Entrar</a>
            </div>
            <div className="footer-col">
              <h5>Suporte</h5>
              <a href="mailto:suporte@preparaaula.com.br">suporte@preparaaula.com.br</a>
            </div>
          </div>
        </div>
        <div className="footer-bot">
          <span className="footer-copy">© 2026 Prepara Aula · Todos os direitos reservados</span>
          <span className="footer-copy">Pagamentos via Cakto · Desenvolvido com IA</span>
        </div>
      </footer>
    </>
  )
}