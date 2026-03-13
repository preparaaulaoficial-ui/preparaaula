'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'

// ─── GOOGLE FONTS ─────────────────────────────────────────────────────────────
// Adicione no app/layout.js:
// <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,700;0,900;1,300;1,700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

// ─── PALETAS ──────────────────────────────────────────────────────────────────
const PALETAS = {
  terracota: { primary: '#d4552a', dark: '#0f1923', cream: '#f5f0e8', gold: '#c9a84c', ink: '#1a1a2e' },
  oceano:    { primary: '#1a6eb5', dark: '#0a1628', cream: '#eef4fb', gold: '#7eb8e8', ink: '#0d2340' },
  floresta:  { primary: '#2d7a4f', dark: '#0c1f14', cream: '#eef6f0', gold: '#85c49a', ink: '#122b1c' },
  violeta:   { primary: '#6b35c4', dark: '#130d24', cream: '#f3eeff', gold: '#b89de8', ink: '#1e1040' },
  carmim:    { primary: '#b52042', dark: '#1a0a10', cream: '#fdeef2', gold: '#e88fa3', ink: '#2d0f18' },
  ardosia:   { primary: '#3d5a73', dark: '#0d1620', cream: '#edf2f5', gold: '#8aaec4', ink: '#1a2e3d' },
}

const ETAPAS_META = {
  introducao:      { label: 'Introdução',      cor: '#4a90d9' },
  desenvolvimento: { label: 'Desenvolvimento', cor: '#5aaa6a' },
  execucao:        { label: 'Execução',         cor: '#e0a030' },
  revisao:         { label: 'Revisão',          cor: '#a070d0' },
}

// ─── PPT CORES (hex sem #) ────────────────────────────────────────────────────
const PPT = {
  terracota: { p: 'd4552a', d: '0f1923', c: 'f5f0e8', g: 'c9a84c', i: '1a1a2e' },
  oceano:    { p: '1a6eb5', d: '0a1628', c: 'eef4fb', g: '7eb8e8', i: '0d2340' },
  floresta:  { p: '2d7a4f', d: '0c1f14', c: 'eef6f0', g: '85c49a', i: '122b1c' },
  violeta:   { p: '6b35c4', d: '130d24', c: 'f3eeff', g: 'b89de8', i: '1e1040' },
  carmim:    { p: 'b52042', d: '1a0a10', c: 'fdeef2', g: 'e88fa3', i: '2d0f18' },
  ardosia:   { p: '3d5a73', d: '0d1620', c: 'edf2f5', g: '8aaec4', i: '1a2e3d' },
}
const trunc = (s, n) => s && s.length > n ? s.slice(0, n - 1) + '…' : (s || '')

// ─── ÍCONES ───────────────────────────────────────────────────────────────────
const Prev    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15,18 9,12 15,6"/></svg>
const Next    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9,18 15,12 9,6"/></svg>
const IcGrid  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
const IcBook  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
const IcTask  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,11 12,14 22,4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
const IcPPT   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
const IcEdit  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
const IcClose = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IcMic   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
const IcBack  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15,18 9,12 15,6"/></svg>

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function getImageUrl(tema, titulo) {
  const kw = encodeURIComponent(tema || titulo || 'education science')
  return `https://source.unsplash.com/featured/800x600/?${kw}`
}

function getFallbackUrl(tema) {
  const hash = [...(tema || 'study')].reduce((a, c) => a + c.charCodeAt(0), 0)
  return `https://picsum.photos/seed/${hash}/800/600`
}

// ─── EXPORTAR PPTX ────────────────────────────────────────────────────────────
async function exportarPPT(slides, aula, palNome = 'terracota') {
  const pptxgen = (await import('pptxgenjs')).default
  const prs = new pptxgen()
  prs.layout  = 'LAYOUT_16x9'
  prs.title   = aula?.titulo || 'Apresentação'
  prs.subject = aula?.disciplina || ''
  prs.author  = 'Prepara Aula'

  const C     = PPT[palNome] || PPT.terracota
  const total = slides.length

  const rodape = (sl) => {
    sl.addShape(prs.shapes.RECTANGLE, { x:0, y:5.44, w:10, h:0.008, fill:{color:'e8e0d0'}, line:{color:'e8e0d0',width:0} })
    const meta = [aula?.disciplina, aula?.nivel].filter(Boolean).join(' · ')
    sl.addText(meta, { x:0.35, y:5.33, w:6, h:0.22, fontSize:7.5, color:'94a3b8', fontFace:'Calibri', margin:0 })
  }

  slides.forEach((s, idx) => {
    const sl     = prs.addSlide()
    const tipo   = s.tipo || 'conceito'
    const titulo = s.titulo || ''
    const cont   = s.conteudo || []
    const dest   = s.destaque || ''
    const num    = String(idx + 1).padStart(2, '0')
    const numT   = String(total).padStart(2, '0')
    const etapa  = { introducao:'Introdução', desenvolvimento:'Desenvolvimento', execucao:'Execução', revisao:'Revisão' }[s.etapa] || ''

    // ── CAPA ──────────────────────────────────────────────────────────────────
    if (tipo === 'capa' || idx === 0) {
      // Fundo esquerdo cream
      sl.addShape(prs.shapes.RECTANGLE, { x:0, y:0, w:5, h:5.625, fill:{color:C.c}, line:{color:C.c,width:0} })
      // Fundo direito dark
      sl.addShape(prs.shapes.RECTANGLE, { x:5, y:0, w:5, h:5.625, fill:{color:C.d}, line:{color:C.d,width:0} })
      // Faixa accent esquerda
      sl.addShape(prs.shapes.RECTANGLE, { x:0.38, y:0.38, w:0.04, h:0.5, fill:{color:C.p}, line:{color:C.p,width:0} })
      // Eyebrow
      const disc = [aula?.disciplina, aula?.nivel, aula?.duracao].filter(Boolean).join(' · ')
      sl.addText(disc.toUpperCase(), { x:0.5, y:0.38, w:4.2, h:0.22, fontSize:7, bold:true, color:C.p, fontFace:'Calibri', charSpacing:1.5, margin:0 })
      // Título
      sl.addText(trunc(titulo, 60), { x:0.38, y:0.78, w:4.3, h:2.6, fontSize:32, bold:true, color:C.i, fontFace:'Calibri', valign:'top', wrap:true, charSpacing:-1, margin:0 })
      // Subtítulo/pergunta
      if (cont[0]) sl.addText(trunc(cont[0], 80), { x:0.38, y:3.6, w:4.3, h:0.7, fontSize:11, color:C.i, fontFace:'Calibri', wrap:true, transparency:40, margin:0 })
      // Tag etapa
      sl.addShape(prs.shapes.ROUNDED_RECTANGLE, { x:0.38, y:4.5, w:1.3, h:0.28, fill:{color:C.i}, line:{color:C.i,width:0}, rectRadius:0.02 })
      sl.addText('● ' + (etapa || 'Introdução'), { x:0.38, y:4.49, w:1.3, h:0.3, fontSize:7, bold:true, color:C.c, fontFace:'Calibri', align:'center', valign:'middle', charSpacing:0.5, margin:0 })
      // Num grande fundo
      sl.addText(num, { x:5.05, y:0.1, w:2.0, h:1.6, fontSize:90, bold:true, color:C.p, fontFace:'Calibri', transparency:92, charSpacing:-4, margin:0 })
      // Bloco visual direito (placeholder colorido)
      sl.addShape(prs.shapes.RECTANGLE, { x:5.5, y:1.4, w:3.8, h:2.85, fill:{color:C.p,transparency:88}, line:{color:C.p,transparency:55,width:0.8} })
      sl.addText('🔬 ' + (aula?.tema || titulo), { x:5.5, y:1.4, w:3.8, h:2.85, fontSize:11, color:C.c, fontFace:'Calibri', align:'center', valign:'middle', transparency:35, wrap:true, margin:0 })
      // Slide num
      sl.addText(`${num} / ${numT}`, { x:5.1, y:5.22, w:0.9, h:0.2, fontSize:7.5, color:C.c, fontFace:'Calibri', transparency:60, margin:0 })
      return
    }

    // Fundo cream para todos os outros slides
    sl.background = { color: C.c }

    // Faixa esquerda accent
    sl.addShape(prs.shapes.RECTANGLE, { x:0, y:0, w:0.06, h:5.625, fill:{color:C.p}, line:{color:C.p,width:0} })

    // Header
    if (etapa) {
      sl.addText(etapa.toUpperCase(), { x:0.2, y:0.12, w:2, h:0.2, fontSize:6.5, bold:true, color:C.p, fontFace:'Calibri', charSpacing:1.5, transparency:30, margin:0 })
    }
    sl.addText(`${num} / ${numT}`, { x:9.3, y:0.12, w:0.6, h:0.2, fontSize:7, color:C.i, fontFace:'Calibri', align:'right', transparency:50, margin:0 })
    sl.addShape(prs.shapes.RECTANGLE, { x:0.2, y:0.42, w:9.6, h:0.008, fill:{color:C.i,transparency:88}, line:{color:C.i,width:0} })

    // ── REVISÃO — grid cards ──────────────────────────────────────────────────
    if (tipo === 'revisao') {
      sl.addText(trunc(titulo, 55), { x:0.2, y:0.5, w:9.6, h:0.7, fontSize:20, bold:true, color:C.i, fontFace:'Calibri', valign:'middle', charSpacing:-0.5, margin:0 })
      const items = cont.slice(0, 6)
      const cols  = Math.min(items.length, 3)
      const cardW = (9.2 / cols) - 0.1
      const cardH = items.length > 3 ? 1.6 : 3.2
      items.forEach((item, j) => {
        const col = j % cols
        const row = Math.floor(j / cols)
        const cx  = 0.2 + col * (cardW + 0.12)
        const cy  = 1.35 + row * (cardH + 0.1)
        sl.addShape(prs.shapes.RECTANGLE, { x:cx, y:cy, w:cardW, h:cardH, fill:{color:'FFFFFF'}, line:{color:C.i,transparency:88,width:0.5} })
        sl.addShape(prs.shapes.RECTANGLE, { x:cx, y:cy, w:cardW, h:0.045, fill:{color:C.p}, line:{color:C.p,width:0} })
        sl.addText(String(j+1).padStart(2,'0'), { x:cx+0.1, y:cy+0.07, w:0.5, h:0.35, fontSize:16, bold:true, color:C.p, fontFace:'Calibri', transparency:20, margin:0 })
        sl.addText(trunc(item.replace(/^\d+\s*[—\-.]\s*/,'').trim(), 120), { x:cx+0.1, y:cy+0.45, w:cardW-0.2, h:cardH-0.6, fontSize:10.5, color:C.i, fontFace:'Calibri', wrap:true, valign:'top', margin:0 })
      })
      rodape(sl)
      return
    }

    // ── DADO VISUAL ───────────────────────────────────────────────────────────
    if (tipo === 'dado_visual') {
      // Metade esquerda dark
      sl.addShape(prs.shapes.RECTANGLE, { x:0, y:0, w:4.2, h:5.625, fill:{color:C.d}, line:{color:C.d,width:0} })
      sl.addText(dest||'—', { x:0.3, y:0.8, w:3.6, h:2.5, fontSize:64, bold:true, color:C.c, fontFace:'Calibri', align:'center', valign:'middle', charSpacing:-3, wrap:true, margin:0 })
      sl.addShape(prs.shapes.RECTANGLE, { x:1.2, y:3.45, w:1.8, h:0.04, fill:{color:C.g}, line:{color:C.g,width:0} })
      sl.addText('DADO-CHAVE', { x:0.3, y:3.6, w:3.6, h:0.3, fontSize:7.5, bold:true, color:C.g, fontFace:'Calibri', align:'center', charSpacing:2, margin:0 })
      if (cont[0]) sl.addText(trunc(cont[0], 80), { x:0.3, y:4.05, w:3.6, h:0.9, fontSize:10, color:C.c, fontFace:'Calibri', align:'center', wrap:true, transparency:35, margin:0 })
      // Direita
      sl.addText(trunc(titulo, 60), { x:4.4, y:0.5, w:5.35, h:0.9, fontSize:18, bold:true, color:C.i, fontFace:'Calibri', valign:'top', wrap:true, charSpacing:-0.5, margin:0 })
      sl.addShape(prs.shapes.RECTANGLE, { x:4.4, y:1.55, w:5.35, h:0.008, fill:{color:C.i,transparency:88}, line:{color:C.i,width:0} })
      cont.slice(1, 6).forEach((item, j) => {
        const cy = 1.72 + j * 0.68
        sl.addShape(prs.shapes.RECTANGLE, { x:4.4, y:cy, w:0.22, h:0.22, fill:{color:C.p}, line:{color:C.p,width:0} })
        sl.addText(trunc(item, 100), { x:4.72, y:cy, w:5.05, h:0.56, fontSize:11, color:C.i, fontFace:'Calibri', valign:'middle', wrap:true, margin:0 })
      })
      rodape(sl)
      return
    }

    // ── EXECUÇÃO ──────────────────────────────────────────────────────────────
    if (tipo === 'execucao') {
      // Coluna esq accent
      sl.addShape(prs.shapes.RECTANGLE, { x:0, y:0, w:2.8, h:5.625, fill:{color:C.p}, line:{color:C.p,width:0} })
      sl.addText('✏️', { x:0.3, y:1.2, w:2.2, h:1.4, fontSize:40, align:'center', valign:'middle', margin:0 })
      if (dest) sl.addText(trunc(dest, 22), { x:0.18, y:2.7, w:2.44, h:1.2, fontSize:12, bold:true, color:'FFFFFF', fontFace:'Calibri', align:'center', wrap:true, margin:0 })
      sl.addText('ATIVIDADE', { x:0.18, y:5.0, w:2.44, h:0.32, fontSize:7, bold:true, color:'FFFFFF', fontFace:'Calibri', align:'center', charSpacing:1.5, transparency:45, margin:0 })
      // Conteúdo direita
      sl.addText(trunc(titulo, 60), { x:3.05, y:0.5, w:6.7, h:0.85, fontSize:20, bold:true, color:C.i, fontFace:'Calibri', valign:'top', wrap:true, charSpacing:-0.5, margin:0 })
      cont.slice(0, 6).forEach((item, j) => {
        const cy = 1.55 + j * 0.65
        sl.addShape(prs.shapes.ROUNDED_RECTANGLE, { x:3.05, y:cy, w:0.3, h:0.3, fill:{color:C.p}, line:{color:C.p,width:0}, rectRadius:0.05 })
        sl.addText(String(j+1), { x:3.05, y:cy, w:0.3, h:0.3, fontSize:10, bold:true, color:'FFFFFF', fontFace:'Calibri', align:'center', valign:'middle', margin:0 })
        sl.addText(trunc(item, 100), { x:3.45, y:cy, w:6.3, h:0.55, fontSize:11, color:C.i, fontFace:'Calibri', valign:'middle', wrap:true, margin:0 })
      })
      rodape(sl)
      return
    }

    // ── INTRODUÇÃO ────────────────────────────────────────────────────────────
    if (tipo === 'introducao') {
      sl.addShape(prs.shapes.RECTANGLE, { x:5.6, y:0, w:4.4, h:5.625, fill:{color:C.p}, line:{color:C.p,width:0} })
      sl.addShape(prs.shapes.OVAL, { x:6.5, y:-1.0, w:3.0, h:3.0, fill:{color:'FFFFFF',transparency:93}, line:{color:'FFFFFF',width:0} })
      sl.addText(trunc(titulo, 55), { x:0.2, y:0.5, w:5.2, h:0.9, fontSize:20, bold:true, color:C.i, fontFace:'Calibri', wrap:true, valign:'top', charSpacing:-0.5, margin:0 })
      cont.slice(0, 4).forEach((item, j) => {
        const cy = 1.7 + j * 0.7
        sl.addShape(prs.shapes.RECTANGLE, { x:0.2, y:cy+0.08, w:0.2, h:0.2, fill:{color:C.p}, line:{color:C.p,width:0} })
        sl.addText(trunc(item, 90), { x:0.5, y:cy, w:4.9, h:0.58, fontSize:11.5, color:C.i, fontFace:'Calibri', valign:'middle', wrap:true, margin:0 })
      })
      sl.addText('PARA PENSAR', { x:5.75, y:0.6, w:4.0, h:0.28, fontSize:7, bold:true, color:'FFFFFF', fontFace:'Calibri', charSpacing:1.5, transparency:40, margin:0 })
      cont.slice(4, 6).forEach((item, j) => {
        sl.addText(trunc(item, 100), { x:5.75, y:1.05+j*1.05, w:3.95, h:0.9, fontSize: j===0?13:11, bold: j===0, color:'FFFFFF', fontFace:'Calibri', wrap:true, valign:'top', transparency: j===0?0:25, margin:0 })
      })
      rodape(sl)
      return
    }

    // ── LAYOUT PADRÃO — editorial split ───────────────────────────────────────
    const isEven = idx % 2 === 0
    sl.addShape(prs.shapes.RECTANGLE, { x:0, y:0, w:3.4, h:5.625, fill:{color: isEven?C.c:'FFFFFF',transparency: isEven?0:0}, line:{color:C.i,transparency:92,width:0} })
    sl.addShape(prs.shapes.RECTANGLE, { x:0, y:0, w:3.4, h:5.625, fill:{color:C.p,transparency: isEven?91:0}, line:{color:C.i,width:0} })

    // Num fantasma
    sl.addText(num, { x:0.1, y:0.6, w:3.2, h:2.4, fontSize:96, bold:true, color: isEven?C.p:'FFFFFF', transparency:82, fontFace:'Calibri', align:'center', valign:'middle', charSpacing:-5, margin:0 })

    // Destaque
    if (dest) {
      sl.addText(trunc(dest, 14), { x:0.1, y:1.2, w:3.2, h:1.8, fontSize:40, bold:true, color: isEven?C.p:'FFFFFF', fontFace:'Calibri', align:'center', valign:'middle', charSpacing:-1.5, margin:0 })
      sl.addShape(prs.shapes.RECTANGLE, { x:1.1, y:3.1, w:1.2, h:0.04, fill:{color: isEven?C.p:'FFFFFF',transparency:50}, line:{color:C.p,width:0} })
      sl.addText('CONCEITO-CHAVE', { x:0.1, y:3.22, w:3.2, h:0.3, fontSize:6.5, bold:true, color: isEven?C.p:'FFFFFF', fontFace:'Calibri', align:'center', charSpacing:1.5, transparency:40, margin:0 })
    }

    // Direita
    sl.addShape(prs.shapes.RECTANGLE, { x:3.55, y:0.52, w:0.055, h:0.7, fill:{color:C.p}, line:{color:C.p,width:0} })
    sl.addText(trunc(titulo, 65), { x:3.72, y:0.5, w:6.0, h:0.85, fontSize:19, bold:true, color:C.i, fontFace:'Calibri', valign:'top', wrap:true, charSpacing:-0.5, margin:0 })
    sl.addShape(prs.shapes.RECTANGLE, { x:3.55, y:1.5, w:6.0, h:0.008, fill:{color:C.i,transparency:88}, line:{color:C.i,width:0} })
    cont.slice(0, 6).forEach((item, j) => {
      const cy = 1.65 + j * 0.64
      sl.addShape(prs.shapes.OVAL, { x:3.58, y:cy+0.06, w:0.18, h:0.18, fill:{color:C.p}, line:{color:C.p,width:0} })
      sl.addText(trunc(item, 110), { x:3.86, y:cy, w:5.85, h:0.56, fontSize:11.5, color: j===0?C.i:'374151', fontFace:'Calibri', valign:'middle', wrap:true, margin:0, bold: j===0 })
    })
    rodape(sl)
  })

  await prs.writeFile({ fileName: `${aula?.titulo || 'aula'}.pptx` })
}

// ─── SLIDE WEB: CAPA EDITORIAL ────────────────────────────────────────────────
function SlideCapa({ s, p, num, total, aula }) {
  const [imgSrc, setImgSrc] = useState(getImageUrl(aula?.tema, aula?.titulo))
  const etapaMeta = ETAPAS_META[s.etapa] || ETAPAS_META.introducao
  const disc = [aula?.disciplina, aula?.nivel, aula?.duracao].filter(Boolean).join(' · ')

  return (
    <div style={{ width:'100%', height:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', fontFamily:"'DM Sans', 'Plus Jakarta Sans', sans-serif", overflow:'hidden' }}>

      {/* ESQUERDA — cream */}
      <div style={{ background: p.cream, padding:'8% 7%', display:'flex', flexDirection:'column', justifyContent:'space-between', position:'relative', overflow:'hidden' }}>
        {/* Glow sutil */}
        <div style={{ position:'absolute', top:'-20%', left:'-10%', width:'140%', height:'50%', background:`radial-gradient(ellipse, ${p.primary}18 0%, transparent 70%)`, pointerEvents:'none' }} />

        {/* Eyebrow */}
        <div style={{ display:'flex', alignItems:'center', gap:8, position:'relative', zIndex:1 }}>
          <div style={{ width:24, height:2, background:p.primary, flexShrink:0 }} />
          <span style={{ fontSize:'clamp(7px,1.1vw,10px)', fontWeight:500, letterSpacing:'0.18em', textTransform:'uppercase', color:p.primary }}>{disc}</span>
        </div>

        {/* Título */}
        <div style={{ position:'relative', zIndex:1 }}>
          <h1 style={{ fontFamily:"'Fraunces', 'Georgia', serif", fontWeight:900, fontSize:'clamp(22px,4.8vw,52px)', lineHeight:0.95, color:p.ink, letterSpacing:'-0.03em', margin:0 }}>
            {s.titulo}
          </h1>
        </div>

        {/* Rodapé */}
        <div style={{ display:'flex', flexDirection:'column', gap:8, position:'relative', zIndex:1 }}>
          {s.conteudo?.[0] && (
            <p style={{ fontSize:'clamp(8px,1.1vw,12px)', color:`${p.ink}70`, lineHeight:1.55, margin:0 }}>{s.conteudo[0]}</p>
          )}
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'4px 10px', background:p.ink, color:p.cream, fontSize:'clamp(6px,0.85vw,9px)', letterSpacing:'0.14em', textTransform:'uppercase', width:'fit-content', borderRadius:2 }}>
            <span style={{ width:5, height:5, borderRadius:'50%', background:etapaMeta.cor, flexShrink:0 }} />
            {etapaMeta.label}
          </div>
        </div>
      </div>

      {/* DIREITA — dark */}
      <div style={{ background: p.dark, display:'flex', flexDirection:'column', alignItems:'flex-end', justifyContent:'flex-end', padding:'8% 7%', position:'relative', overflow:'hidden' }}>
        {/* Número fantasma */}
        <div style={{ position:'absolute', top:'3%', left:'5%', fontFamily:"'Fraunces','Georgia',serif", fontSize:'clamp(70px,15vw,160px)', fontWeight:900, color:`${p.primary}08`, lineHeight:1, letterSpacing:'-0.05em', userSelect:'none', pointerEvents:'none' }}>
          {String(num).padStart(2,'0')}
        </div>

        {/* Imagem do tema */}
        <div style={{ width:'75%', aspectRatio:'4/3', borderRadius:3, overflow:'hidden', position:'relative', zIndex:2, border:`1px solid ${p.primary}40`, boxShadow:'0 10px 40px rgba(0,0,0,0.6)' }}>
          <img
            src={imgSrc}
            alt={aula?.tema || s.titulo}
            style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', filter:'brightness(0.85) saturate(0.8)' }}
            onError={() => setImgSrc(getFallbackUrl(aula?.tema || s.titulo))}
          />
          {/* overlay tonal */}
          <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg, ${p.primary}22 0%, transparent 60%)`, pointerEvents:'none' }} />
        </div>

        {/* Slide num */}
        <div style={{ position:'absolute', bottom:'7%', left:'7%', fontSize:'clamp(7px,0.9vw,10px)', color:`${p.cream}35`, fontWeight:600, letterSpacing:'0.1em' }}>
          {String(num).padStart(2,'0')} / {String(total).padStart(2,'0')}
        </div>
      </div>
    </div>
  )
}

// ─── SLIDE WEB: CONTEÚDO PADRÃO ───────────────────────────────────────────────
function SlideConteudo({ s, p, num, total }) {
  const etapaMeta = ETAPAS_META[s.etapa]
  const isEven    = num % 2 === 0

  return (
    <div style={{ width:'100%', height:'100%', background: p.cream, position:'relative', overflow:'hidden', fontFamily:"'DM Sans','Plus Jakarta Sans',sans-serif" }}>
      {/* Faixa vertical accent */}
      <div style={{ position:'absolute', left:0, top:0, bottom:0, width:5, background:`linear-gradient(180deg, ${p.primary}, ${p.gold})` }} />
      {/* Número fantasma fundo */}
      <div style={{ position:'absolute', right:'-3%', top:'-8%', fontFamily:"'Fraunces','Georgia',serif", fontSize:'clamp(90px,20vw,220px)', fontWeight:900, color:`${p.ink}06`, lineHeight:1, userSelect:'none', pointerEvents:'none', letterSpacing:'-0.04em' }}>
        {String(num).padStart(2,'0')}
      </div>

      {/* Grid 1/3 */}
      <div style={{ position:'absolute', inset:0, display:'grid', gridTemplateColumns:'1fr 2.2fr' }}>

        {/* Coluna esquerda */}
        <div style={{ padding:'8% 5% 8% 6%', display:'flex', flexDirection:'column', justifyContent:'center', borderRight:`1px solid ${p.ink}12`, position:'relative' }}>
          {/* Etapa vertical */}
          {etapaMeta && (
            <div style={{ position:'absolute', left:'8%', top:'50%', transform:'translateY(-50%) rotate(-90deg)', transformOrigin:'center center', fontSize:'clamp(6px,0.85vw,8px)', fontWeight:500, letterSpacing:'0.22em', textTransform:'uppercase', color:`${p.ink}35`, whiteSpace:'nowrap' }}>
              {etapaMeta.label}
            </div>
          )}
          <div style={{ paddingLeft:'18%' }}>
            <h2 style={{ fontFamily:"'Fraunces','Georgia',serif", fontWeight:700, fontSize:'clamp(14px,2.8vw,30px)', lineHeight:1.1, color:p.ink, letterSpacing:'-0.02em', margin:0 }}>
              {s.titulo?.split(' ').slice(0,3).join(' ')}
            </h2>
            {s.titulo?.split(' ').length > 3 && (
              <p style={{ fontFamily:"'Fraunces','Georgia',serif", fontWeight:300, fontStyle:'italic', fontSize:'clamp(11px,2.1vw,22px)', color:p.primary, margin:'4px 0 0', lineHeight:1.1 }}>
                {s.titulo?.split(' ').slice(3).join(' ')}
              </p>
            )}
            {s.destaque && (
              <div style={{ marginTop:12, padding:'6px 10px', background:`${p.primary}14`, borderLeft:`2px solid ${p.primary}`, fontSize:'clamp(7px,1vw,10px)', color:p.primary, fontWeight:500, lineHeight:1.4 }}>
                {s.destaque}
              </div>
            )}
          </div>
        </div>

        {/* Coluna direita */}
        <div style={{ padding:'7% 6% 7% 4%', display:'flex', flexDirection:'column', justifyContent:'center', gap:'clamp(7px,1.4vh,14px)', overflow:'hidden' }}>
          {/* Header mini */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:2 }}>
            {etapaMeta && (
              <div style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 8px', background:`${etapaMeta.cor}18`, borderRadius:2, fontSize:'clamp(6px,0.85vw,8px)', fontWeight:700, color:etapaMeta.cor, letterSpacing:'0.1em', textTransform:'uppercase' }}>
                {etapaMeta.label}
              </div>
            )}
            <span style={{ fontSize:'clamp(7px,0.9vw,9px)', color:`${p.ink}30`, fontWeight:600 }}>
              {String(num).padStart(2,'0')} / {String(total).padStart(2,'0')}
            </span>
          </div>

          {/* Bullets */}
          {s.conteudo?.slice(0, 6).map((l, i) => (
            <div key={i} style={{ display:'flex', gap:'clamp(8px,1.5vw,14px)', alignItems:'flex-start' }}>
              <div style={{ width:'clamp(18px,2.3vw,26px)', height:'clamp(18px,2.3vw,26px)', borderRadius:'50%', background: i===0 ? p.primary : p.ink, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                <span style={{ fontFamily:"'Fraunces','Georgia',serif", fontSize:'clamp(7px,1vw,11px)', fontWeight:700, color: p.cream, lineHeight:1 }}>{i+1}</span>
              </div>
              <p style={{ fontSize:'clamp(9px,1.4vw,13.5px)', color: i===0 ? p.ink : `${p.ink}bb`, lineHeight:1.6, margin:0, fontWeight: i===0 ? 500 : 400, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
                {l}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── SLIDE WEB: DADO VISUAL ───────────────────────────────────────────────────
function SlideDadoVisual({ s, p, num, total }) {
  const etapaMeta = ETAPAS_META[s.etapa]
  return (
    <div style={{ width:'100%', height:'100%', display:'grid', gridTemplateColumns:'1.15fr 1fr', fontFamily:"'DM Sans','Plus Jakarta Sans',sans-serif", overflow:'hidden' }}>
      {/* Esquerda dark */}
      <div style={{ background:p.dark, padding:'7% 6%', display:'flex', flexDirection:'column', justifyContent:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', width:'80%', height:'130%', borderRadius:'50%', border:`1px solid ${p.cream}05`, top:'-15%', right:'-15%', pointerEvents:'none' }} />
        <div style={{ position:'absolute', width:'50%', height:'90%', borderRadius:'50%', border:`1px solid ${p.gold}08`, top:'5%', right:'0%', pointerEvents:'none' }} />
        <p style={{ fontSize:'clamp(6px,0.9vw,9px)', fontWeight:500, letterSpacing:'0.22em', textTransform:'uppercase', color:p.gold, marginBottom:'clamp(6px,1.5vh,16px)', position:'relative', zIndex:1 }}>Dado-chave</p>
        <div style={{ fontFamily:"'Fraunces','Georgia',serif", fontSize:'clamp(48px,10vw,110px)', fontWeight:900, color:p.cream, lineHeight:0.88, letterSpacing:'-0.05em', position:'relative', zIndex:1 }}>
          {s.destaque || '—'}
        </div>
        <div style={{ width:32, height:2, background:`${p.gold}60`, margin:'clamp(8px,2vh,20px) 0', position:'relative', zIndex:1 }} />
        {s.conteudo?.[0] && (
          <p style={{ fontSize:'clamp(8px,1.3vw,13px)', color:`${p.cream}60`, lineHeight:1.6, margin:0, maxWidth:'85%', position:'relative', zIndex:1 }}>{s.conteudo[0]}</p>
        )}
      </div>
      {/* Direita */}
      <div style={{ background:p.cream, padding:'7% 6% 7% 5%', display:'flex', flexDirection:'column', justifyContent:'center', borderLeft:`1px solid ${p.ink}08` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'clamp(10px,2vh,20px)' }}>
          {etapaMeta && <div style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 8px', background:`${etapaMeta.cor}16`, borderRadius:2, fontSize:'clamp(6px,0.85vw,8px)', fontWeight:700, color:etapaMeta.cor, letterSpacing:'0.1em', textTransform:'uppercase' }}>{etapaMeta.label}</div>}
          <span style={{ fontSize:'clamp(7px,0.9vw,9px)', color:`${p.ink}30` }}>{String(num).padStart(2,'0')} / {String(total).padStart(2,'0')}</span>
        </div>
        <h2 style={{ fontFamily:"'Fraunces','Georgia',serif", fontWeight:700, fontSize:'clamp(13px,2vw,20px)', color:p.ink, letterSpacing:'-0.02em', lineHeight:1.15, margin:'0 0 clamp(10px,2vh,18px)' }}>{s.titulo}</h2>
        <div style={{ display:'flex', flexDirection:'column', gap:'clamp(6px,1.2vh,11px)' }}>
          {s.conteudo?.slice(1, 5).map((l, i) => (
            <div key={i} style={{ padding:'clamp(7px,1.3vh,12px) clamp(9px,1.5vw,14px)', border:`1px solid ${p.ink}10`, borderRadius:2, background:'white' }}>
              <div style={{ fontFamily:"'Fraunces','Georgia',serif", fontSize:'clamp(12px,2vw,20px)', fontWeight:700, color:p.ink, letterSpacing:'-0.02em', lineHeight:1 }}>{l.split(':')[0]}</div>
              {l.includes(':') && <div style={{ fontSize:'clamp(7px,1vw,10px)', color:`${p.ink}55`, letterSpacing:'0.08em', textTransform:'uppercase', marginTop:2 }}>{l.split(':').slice(1).join(':').trim()}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── SLIDE WEB: EXECUÇÃO ──────────────────────────────────────────────────────
function SlideExecucao({ s, p, num, total }) {
  return (
    <div style={{ width:'100%', height:'100%', background:p.cream, display:'grid', gridTemplateColumns:'auto 1fr', fontFamily:"'DM Sans','Plus Jakarta Sans',sans-serif", overflow:'hidden' }}>
      {/* Coluna esq accent */}
      <div style={{ background:p.primary, width:'clamp(90px,15vw,160px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'6%', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-20%', left:'-20%', width:'130%', height:'60%', borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />
        <div style={{ fontSize:'clamp(24px,4vw,48px)', marginBottom:8, position:'relative', zIndex:1 }}>✏️</div>
        {s.destaque && <div style={{ fontSize:'clamp(8px,1.2vw,12px)', fontWeight:700, color:'rgba(255,255,255,0.9)', textAlign:'center', lineHeight:1.3, position:'relative', zIndex:1 }}>{s.destaque}</div>}
        <div style={{ position:'absolute', bottom:'8%', fontSize:'clamp(6px,0.8vw,8px)', color:'rgba(255,255,255,0.3)', fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase' }}>ATIVIDADE</div>
      </div>
      {/* Conteúdo */}
      <div style={{ padding:'6% 5%', display:'flex', flexDirection:'column', justifyContent:'center', overflow:'hidden' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'clamp(8px,1.8vh,16px)' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 8px', background:`${p.primary}14`, borderRadius:2, fontSize:'clamp(6px,0.85vw,8px)', fontWeight:700, color:p.primary, letterSpacing:'0.1em', textTransform:'uppercase' }}>Execução</div>
          <span style={{ fontSize:'clamp(7px,0.9vw,9px)', color:`${p.ink}30` }}>{String(num).padStart(2,'0')} / {String(total).padStart(2,'0')}</span>
        </div>
        <h2 style={{ fontFamily:"'Fraunces','Georgia',serif", fontWeight:700, fontSize:'clamp(13px,2.2vw,22px)', color:p.ink, letterSpacing:'-0.02em', lineHeight:1.15, margin:'0 0 clamp(8px,1.8vh,16px)' }}>{s.titulo}</h2>
        <div style={{ display:'flex', flexDirection:'column', gap:'clamp(7px,1.3vh,12px)', overflow:'hidden' }}>
          {s.conteudo?.slice(0,6).map((l, i) => (
            <div key={i} style={{ display:'flex', gap:'clamp(8px,1.4vw,12px)', alignItems:'flex-start' }}>
              <div style={{ minWidth:'clamp(20px,2.2vw,26px)', height:'clamp(20px,2.2vw,26px)', borderRadius:4, background:p.primary, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'clamp(8px,1vw,11px)', fontWeight:700, color:'#fff', flexShrink:0, marginTop:2 }}>{i+1}</div>
              <p style={{ fontSize:'clamp(9px,1.3vw,13px)', color: i===0?p.ink:`${p.ink}bb`, lineHeight:1.6, margin:0, fontWeight: i===0?500:400 }}>{l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── SLIDE WEB: INTRODUÇÃO ────────────────────────────────────────────────────
function SlideIntroducao({ s, p, num, total }) {
  return (
    <div style={{ width:'100%', height:'100%', display:'grid', gridTemplateColumns:'55% 45%', fontFamily:"'DM Sans','Plus Jakarta Sans',sans-serif", overflow:'hidden' }}>
      <div style={{ background:p.cream, padding:'7% 5% 7% 6%', display:'flex', flexDirection:'column', justifyContent:'center', borderRight:`1px solid ${p.ink}08` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'clamp(8px,1.8vh,16px)' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 8px', background:`${ETAPAS_META.introducao.cor}16`, borderRadius:2, fontSize:'clamp(6px,0.85vw,8px)', fontWeight:700, color:ETAPAS_META.introducao.cor, letterSpacing:'0.1em', textTransform:'uppercase' }}>Introdução</div>
          <span style={{ fontSize:'clamp(7px,0.9vw,9px)', color:`${p.ink}30` }}>{String(num).padStart(2,'0')} / {String(total).padStart(2,'0')}</span>
        </div>
        <h2 style={{ fontFamily:"'Fraunces','Georgia',serif", fontWeight:700, fontSize:'clamp(14px,2.4vw,24px)', color:p.ink, letterSpacing:'-0.02em', lineHeight:1.15, margin:'0 0 clamp(10px,2vh,18px)' }}>{s.titulo}</h2>
        <div style={{ display:'flex', flexDirection:'column', gap:'clamp(7px,1.3vh,11px)' }}>
          {s.conteudo?.slice(0,4).map((l, i) => (
            <div key={i} style={{ display:'flex', gap:'clamp(7px,1.2vw,11px)', alignItems:'flex-start' }}>
              <div style={{ width:'clamp(5px,0.7vw,7px)', height:'clamp(5px,0.7vw,7px)', borderRadius:'50%', background:p.primary, flexShrink:0, marginTop:'0.45em' }} />
              <p style={{ fontSize:'clamp(9px,1.3vw,13px)', color:`${p.ink}${i===0?'ee':'99'}`, lineHeight:1.6, margin:0 }}>{l}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background:p.primary, display:'flex', flexDirection:'column', justifyContent:'center', padding:'7% 6%', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-15%', right:'-15%', width:'75%', height:'70%', borderRadius:'50%', background:'rgba(255,255,255,0.06)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-10%', left:'-10%', width:'50%', height:'50%', borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }} />
        <div style={{ fontSize:'clamp(7px,0.9vw,9px)', color:'rgba(255,255,255,0.4)', fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', marginBottom:'clamp(8px,1.5vh,14px)', position:'relative', zIndex:1 }}>Para pensar</div>
        {s.conteudo?.slice(4,6).map((l, i) => (
          <p key={i} style={{ fontSize: i===0?'clamp(10px,1.7vw,16px)':'clamp(9px,1.3vw,13px)', color: i===0?'#fff':'rgba(255,255,255,0.55)', fontWeight: i===0?600:400, lineHeight:1.6, margin:'0 0 clamp(6px,1vh,10px)', position:'relative', zIndex:1 }}>{l}</p>
        ))}
        {s.destaque && (
          <div style={{ marginTop:'clamp(8px,1.5vh,14px)', padding:'8px 12px', background:'rgba(255,255,255,0.1)', borderRadius:2, fontSize:'clamp(8px,1.1vw,12px)', color:'rgba(255,255,255,0.85)', fontWeight:600, position:'relative', zIndex:1, width:'fit-content' }}>{s.destaque}</div>
        )}
      </div>
    </div>
  )
}

// ─── SLIDE WEB: REVISÃO ───────────────────────────────────────────────────────
function SlideRevisao({ s, p, num, total }) {
  const accentColors = [p.primary, p.gold, '#4a90d9', p.ink, '#5aaa6a', p.primary]
  return (
    <div style={{ width:'100%', height:'100%', background:'#f9f5ef', padding:'5% 6%', display:'flex', flexDirection:'column', gap:'clamp(8px,1.8vh,16px)', fontFamily:"'DM Sans','Plus Jakarta Sans',sans-serif", overflow:'hidden' }}>
      <div style={{ display:'flex', alignItems:'baseline', gap:'clamp(8px,1.5vw,14px)', flexShrink:0 }}>
        <h2 style={{ fontFamily:"'Fraunces','Georgia',serif", fontWeight:700, fontSize:'clamp(14px,2.4vw,24px)', color:p.ink, letterSpacing:'-0.02em', margin:0, whiteSpace:'nowrap' }}>{s.titulo}</h2>
        <div style={{ flex:1, height:1, background:`${p.ink}14` }} />
        <span style={{ fontFamily:"'Fraunces','Georgia',serif", fontSize:'clamp(8px,1.1vw,11px)', color:`${p.ink}35`, whiteSpace:'nowrap' }}>{String(num).padStart(2,'0')} / {String(total).padStart(2,'0')}</span>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:`repeat(${Math.min(s.conteudo?.length||3, 3)}, 1fr)`, gap:'clamp(6px,1vw,10px)', flex:1, overflow:'hidden' }}>
        {s.conteudo?.map((l, i) => {
          const texto = l.replace(/^\d+\s*[—\-.]\s*/,'').trim()
          const ac    = accentColors[i % accentColors.length]
          return (
            <div key={i} style={{ background:'white', border:`1px solid ${p.ink}10`, borderRadius:2, padding:'clamp(8px,1.5vh,14px) clamp(8px,1.2vw,12px)', display:'flex', flexDirection:'column', overflow:'hidden', position:'relative' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:ac }} />
              <div style={{ fontFamily:"'Fraunces','Georgia',serif", fontSize:'clamp(18px,3vw,32px)', fontWeight:900, color:`${p.ink}08`, lineHeight:1, marginBottom:4 }}>{String(i+1).padStart(2,'0')}</div>
              <p style={{ fontSize:'clamp(8px,1.1vw,11px)', color:p.ink, lineHeight:1.55, margin:0, flex:1, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:4, WebkitBoxOrient:'vertical' }}>{texto}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── SLIDE BASE — roteador ────────────────────────────────────────────────────
function SlideBase({ s, p, num, total, aula }) {
  const tipo = s.tipo || 'conceito'

  if (tipo === 'capa' || num === 1)        return <SlideCapa       s={s} p={p} num={num} total={total} aula={aula} />
  if (tipo === 'dado_visual')              return <SlideDadoVisual  s={s} p={p} num={num} total={total} />
  if (tipo === 'execucao')                 return <SlideExecucao    s={s} p={p} num={num} total={total} />
  if (tipo === 'introducao')               return <SlideIntroducao  s={s} p={p} num={num} total={total} />
  if (tipo === 'revisao')                  return <SlideRevisao     s={s} p={p} num={num} total={total} />
  return <SlideConteudo s={s} p={p} num={num} total={total} />
}

// ─── MODAL EDITOR ────────────────────────────────────────────────────────────
function ModalEditor({ slide, paleta, onSalvar, onFechar }) {
  const [titulo,   setTitulo]   = useState(slide.titulo   || '')
  const [destaque, setDestaque] = useState(slide.destaque || '')
  const [conteudo, setConteudo] = useState([...(slide.conteudo || [])])

  const inp = { width:'100%', padding:'9px 12px', border:'1.5px solid #e2e8f0', borderRadius:6, fontSize:13, outline:'none', boxSizing:'border-box', fontFamily:'inherit', color:'#0f172a' }
  const lbl = { fontSize:11, fontWeight:600, color:'#64748b', display:'block', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.08em' }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:400, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)' }}>
      <div style={{ background:'white', borderRadius:12, padding:28, width:'min(520px,92vw)', maxHeight:'85vh', overflowY:'auto', boxShadow:'0 32px 80px rgba(0,0,0,0.35)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
          <h3 style={{ margin:0, fontSize:15, fontWeight:700, color:'#0f172a' }}>Editar slide</h3>
          <button onClick={onFechar} style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8', display:'flex' }}><IcClose /></button>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div><label style={lbl}>Título</label><input value={titulo} onChange={e=>setTitulo(e.target.value)} style={inp} /></div>
          <div><label style={lbl}>Destaque (número / palavra grande)</label><input value={destaque} onChange={e=>setDestaque(e.target.value)} placeholder="Ex: 68%, 37 trilhões..." style={inp} /></div>
          <div>
            <label style={lbl}>Tópicos</label>
            {conteudo.map((l,i)=>(
              <div key={i} style={{ display:'flex', gap:7, marginBottom:7 }}>
                <textarea value={l} rows={2} onChange={e=>{const c=[...conteudo];c[i]=e.target.value;setConteudo(c)}} style={{ ...inp, resize:'vertical', flex:1 }} />
                <button onClick={()=>setConteudo(conteudo.filter((_,j)=>j!==i))} style={{ background:'#fee2e2', border:'none', borderRadius:6, padding:'0 10px', cursor:'pointer', color:'#ef4444', fontSize:14 }}>✕</button>
              </div>
            ))}
            <button onClick={()=>setConteudo([...conteudo,''])} style={{ fontSize:12, fontWeight:600, color:paleta.primary, background:`${paleta.primary}10`, border:`1px solid ${paleta.primary}25`, borderRadius:6, padding:'7px 14px', cursor:'pointer', fontFamily:'inherit' }}>+ Adicionar tópico</button>
          </div>
        </div>
        <div style={{ display:'flex', gap:9, marginTop:24 }}>
          <button onClick={onFechar} style={{ flex:1, padding:11, background:'#f1f5f9', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit', color:'#64748b' }}>Cancelar</button>
          <button onClick={()=>onSalvar({...slide,titulo,destaque,conteudo})} style={{ flex:2, padding:11, background:paleta.primary, color:'white', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>Salvar</button>
        </div>
      </div>
    </div>
  )
}

// ─── PAINEL ATIVIDADE ────────────────────────────────────────────────────────
function PainelAtividade({ atividade, paleta, onFechar }) {
  const [aba, setAba] = useState('descricao')
  if (!atividade?.titulo) return null
  const abas = [{ id:'descricao',label:'📋 Atividade' },{ id:'exercicios',label:'✍️ Exercícios' },{ id:'gabarito',label:'✅ Gabarito' }]
  return (
    <div style={{ position:'fixed', top:0, right:0, bottom:0, width:'min(480px,92vw)', background:'white', boxShadow:'-8px 0 40px rgba(0,0,0,0.25)', zIndex:200, display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'18px 20px', borderBottom:'1px solid #e2e8f0', background:paleta.primary, flexShrink:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div style={{ fontSize:9, color:'rgba(255,255,255,0.5)', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:4 }}>EXECUÇÃO</div>
            <h3 style={{ margin:0, fontSize:15, fontWeight:700, color:'white', lineHeight:1.3 }}>{atividade.titulo}</h3>
            {atividade.tempo && <div style={{ marginTop:5, fontSize:11, color:'rgba(255,255,255,0.5)', fontWeight:600 }}>⏱ {atividade.tempo}</div>}
          </div>
          <button onClick={onFechar} style={{ background:'rgba(255,255,255,0.12)', border:'none', borderRadius:7, padding:7, cursor:'pointer', color:'white', display:'flex', marginLeft:10 }}><IcClose /></button>
        </div>
      </div>
      <div style={{ display:'flex', borderBottom:'1px solid #e2e8f0', flexShrink:0 }}>
        {abas.map(a=>(
          <button key={a.id} onClick={()=>setAba(a.id)} style={{ flex:1, padding:'10px 4px', border:'none', borderBottom: aba===a.id?`2px solid ${paleta.primary}`:'2px solid transparent', background:'none', cursor:'pointer', fontSize:12, fontWeight:600, color: aba===a.id?paleta.primary:'#64748b', fontFamily:'inherit' }}>
            {a.label}
          </button>
        ))}
      </div>
      <div style={{ flex:1, padding:20, overflowY:'auto' }}>
        {aba==='descricao' && (
          <div>
            <p style={{ fontSize:13, color:'#374151', lineHeight:1.7, marginBottom:18 }}>{atividade.descricao}</p>
            {atividade.instrucoes?.length>0 && (
              <>
                <div style={{ fontSize:10, fontWeight:700, color:paleta.primary, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:10 }}>Passo a passo</div>
                <div style={{ display:'flex', flexDirection:'column', gap:9, marginBottom:18 }}>
                  {atividade.instrucoes.map((inst,i)=>(
                    <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                      <div style={{ minWidth:22, height:22, borderRadius:6, background:paleta.primary, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, color:'white', flexShrink:0 }}>{i+1}</div>
                      <p style={{ fontSize:12, color:'#374151', lineHeight:1.6, margin:0 }}>{inst}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
            {atividade.dica_professor && (
              <div style={{ padding:'12px 14px', background:'#fffbeb', borderRadius:8, border:'1px solid #fde68a' }}>
                <div style={{ fontSize:10, fontWeight:700, color:'#d97706', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.08em' }}>💡 Dica para o professor</div>
                <p style={{ fontSize:12, color:'#92400e', lineHeight:1.6, margin:0 }}>{atividade.dica_professor}</p>
              </div>
            )}
          </div>
        )}
        {aba==='exercicios' && (
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {atividade.exercicios?.map(ex=>(
              <div key={ex.numero} style={{ borderBottom:'1px solid #f1f5f9', paddingBottom:18 }}>
                <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:9 }}>
                  <div style={{ width:20, height:20, borderRadius:5, background:paleta.primary, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, color:'white' }}>{ex.numero}</div>
                  <span style={{ fontSize:10, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.08em' }}>{ex.tipo==='dissertativa'?'Dissertativa':'Múltipla escolha'}</span>
                </div>
                <p style={{ fontSize:13, color:'#0f172a', lineHeight:1.6, margin:'0 0 12px', fontWeight:500 }}>{ex.enunciado}</p>
                {ex.alternativas && (
                  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    {ex.alternativas.map((alt,j)=>(
                      <div key={j} style={{ padding:'8px 12px', borderRadius:6, background:'#f8fafc', border:'1px solid #e2e8f0', fontSize:12, color:'#374151' }}>{alt}</div>
                    ))}
                  </div>
                )}
                {!ex.alternativas && <div style={{ padding:'10px 12px', background:'#f8fafc', borderRadius:6, border:'1px solid #e2e8f0', fontSize:12, color:'#94a3b8', fontStyle:'italic' }}>Resposta dissertativa</div>}
              </div>
            ))}
          </div>
        )}
        {aba==='gabarito' && (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {atividade.exercicios?.map(ex=>(
              <div key={ex.numero} style={{ padding:'12px 14px', background:'white', borderRadius:8, border:'1px solid #e2e8f0', borderLeft:`3px solid ${paleta.primary}` }}>
                <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:7 }}>
                  <span style={{ fontSize:11, fontWeight:700, color:paleta.primary }}>Questão {ex.numero}</span>
                  {ex.resposta_correta && <span style={{ background:`${paleta.primary}12`, color:paleta.primary, fontSize:11, fontWeight:700, padding:'1px 9px', borderRadius:100 }}>{ex.resposta_correta}</span>}
                </div>
                <p style={{ fontSize:12, color:'#374151', lineHeight:1.65, margin:0 }}>{ex.explicacao||ex.criterios||ex.resposta_esperada}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── PAINEL PLANO DE AULA ────────────────────────────────────────────────────
function PainelPlanoAula({ aula, paleta, onVoltar }) {
  const pa = (() => { try { return JSON.parse(aula.plano_aula) } catch { return {} } })()
  return (
    <div style={{ minHeight:'100vh', background:'#f8fafc', fontFamily:"'DM Sans','Plus Jakarta Sans',sans-serif" }}>
      <div style={{ background:'white', borderBottom:'1px solid #e2e8f0', padding:'0 24px', height:52, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <button onClick={onVoltar} style={{ background:'none', border:'1px solid #e2e8f0', borderRadius:7, padding:'5px 12px', fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', gap:5, color:'#475569', fontFamily:'inherit' }}><IcBack /> Voltar</button>
          <span style={{ fontSize:13, fontWeight:700, color:'#0f2b5b' }}>Plano de Aula</span>
        </div>
        <span style={{ fontSize:11, color:'#94a3b8' }}>{aula.disciplina} · {aula.nivel} · {aula.duracao}</span>
      </div>
      <div style={{ maxWidth:620, margin:'0 auto', padding:'28px 20px' }}>
        {[{ label:'Objetivo Geral', value:pa?.objetivo_geral },{ label:'Avaliação', value:pa?.avaliacao }].map(it => it.value && (
          <div key={it.label} style={{ background:'white', borderRadius:8, padding:18, marginBottom:10, border:'1px solid #e2e8f0' }}>
            <div style={{ fontSize:9, fontWeight:700, color:paleta.primary, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:7 }}>{it.label}</div>
            <p style={{ color:'#1e293b', lineHeight:1.7, margin:0, fontSize:13 }}>{it.value}</p>
          </div>
        ))}
        {pa?.objetivos_especificos?.length>0 && (
          <div style={{ background:'white', borderRadius:8, padding:18, marginBottom:10, border:'1px solid #e2e8f0' }}>
            <div style={{ fontSize:9, fontWeight:700, color:paleta.primary, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:10 }}>Objetivos Específicos</div>
            {pa.objetivos_especificos.map((o,i)=>(
              <div key={i} style={{ display:'flex', gap:9, marginBottom:8 }}>
                <div style={{ width:18, height:18, borderRadius:5, background:paleta.primary, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800, color:'white', flexShrink:0, marginTop:2 }}>{i+1}</div>
                <p style={{ fontSize:12, color:'#1e293b', lineHeight:1.6, margin:0 }}>{o}</p>
              </div>
            ))}
          </div>
        )}
        {pa?.competencias_bncc?.length>0 && (
          <div style={{ background:'white', borderRadius:8, padding:18, marginBottom:10, border:'1px solid #e2e8f0' }}>
            <div style={{ fontSize:9, fontWeight:700, color:paleta.primary, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:9 }}>Competências BNCC</div>
            {pa.competencias_bncc.map((c,i)=>(
              <div key={i} style={{ padding:'6px 10px', background:`${paleta.primary}08`, borderRadius:6, marginBottom:6, fontSize:11, color:'#1e293b', lineHeight:1.55 }}>{c}</div>
            ))}
          </div>
        )}
        {pa?.materiais?.length>0 && (
          <div style={{ background:'white', borderRadius:8, padding:18, border:'1px solid #e2e8f0' }}>
            <div style={{ fontSize:9, fontWeight:700, color:paleta.primary, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:9 }}>Materiais</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {pa.materiais.map((m,i)=>(
                <span key={i} style={{ padding:'4px 10px', background:`${paleta.primary}10`, color:paleta.primary, borderRadius:100, fontSize:11, fontWeight:600 }}>{m}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function AulaPage() {
  const router = useRouter()
  const params = useParams()
  const id     = params?.id

  const [aula,            setAula]            = useState(null)
  const [slides,          setSlides]          = useState([])
  const [atividade,       setAtividade]       = useState(null)
  const [idx,             setIdx]             = useState(0)
  const [loading,         setLoading]         = useState(true)
  const [planoUser,       setPlanoUser]       = useState('starter')
  const [palNome,         setPalNome]         = useState('terracota')
  const [modoGrade,       setModoGrade]       = useState(false)
  const [modoPlanAula,    setModoPlanAula]    = useState(false)
  const [painelAtividade, setPainelAtividade] = useState(false)
  const [verRoteiro,      setVerRoteiro]      = useState(false)
  const [editando,        setEditando]        = useState(null)
  const [salvando,        setSalvando]        = useState(false)
  const [exportando,      setExportando]      = useState(false)

  useEffect(() => { if (id) carregar() }, [id])

  useEffect(() => {
    const fn = e => {
      if (e.key==='ArrowRight'||e.key==='ArrowDown') setIdx(i => Math.min(i+1, slides.length-1))
      if (e.key==='ArrowLeft' ||e.key==='ArrowUp')   setIdx(i => Math.max(i-1, 0))
      if (e.key==='Escape') { setModoGrade(false); setPainelAtividade(false); setVerRoteiro(false) }
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [slides])

  async function carregar() {
    const { data:{ user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { data:perf } = await supabase.from('profiles').select('plano').eq('id', user.id).single()
    setPlanoUser(perf?.plano || 'starter')
    const { data } = await supabase.from('aulas').select('*').eq('id', id).eq('user_id', user.id).single()
    if (!data) { router.push('/dashboard'); return }
    setAula(data)
    try { setSlides(JSON.parse(data.slides_editados || data.slides || '[]')) } catch { setSlides([]) }
    try { setAtividade(JSON.parse(data.atividade || 'null')) } catch { setAtividade(null) }
    setLoading(false)
  }

  async function salvarSlide(novo) {
    const novos = slides.map(s => s.id === novo.id ? novo : s)
    setSlides(novos); setEditando(null); setSalvando(true)
    await supabase.from('aulas').update({ slides_editados: JSON.stringify(novos), editado: true }).eq('id', id)
    setSalvando(false)
  }

  async function handleExportarPPT() {
    setExportando(true)
    try { await exportarPPT(slides, aula, palNome) }
    catch(e) { console.error(e); alert('Erro ao exportar. Tente novamente.') }
    finally { setExportando(false) }
  }

  const p       = PALETAS[palNome]
  const podEdit = planoUser === 'profissional' || planoUser === 'escola'
  const podCor  = planoUser === 'escola'
  const slide   = slides[idx]

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#0f1923', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ textAlign:'center', color:'white' }}>
        <div style={{ width:40, height:40, border:'2px solid rgba(255,255,255,0.1)', borderTop:'2px solid rgba(255,255,255,0.6)', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 14px' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color:'rgba(255,255,255,0.3)', fontSize:12 }}>Carregando aula…</p>
      </div>
    </div>
  )

  if (modoPlanAula) return <PainelPlanoAula aula={aula} paleta={p} onVoltar={() => setModoPlanAula(false)} />
  if (!slide) return null

  const Btn = ({ onClick, children, ativo=false, danger=false }) => (
    <button onClick={onClick} style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 11px', background: danger?'rgba(239,68,68,0.1)': ativo?`${p.primary}30`:'rgba(255,255,255,0.07)', border:`1px solid ${danger?'rgba(239,68,68,0.3)': ativo?p.primary:'rgba(255,255,255,0.1)'}`, borderRadius:6, color: danger?'#f87171': ativo?p.gold:'rgba(255,255,255,0.7)', cursor:'pointer', fontSize:12, fontWeight:600, fontFamily:'inherit', transition:'all 0.15s', whiteSpace:'nowrap' }}>
      {children}
    </button>
  )

  // ── MODO GRADE ──────────────────────────────────────────────────────────────
  if (modoGrade) return (
    <div style={{ minHeight:'100vh', background:'#0a0f18', fontFamily:"'DM Sans',sans-serif", padding:'62px 20px 20px' }}>
      <div style={{ position:'fixed', top:0, left:0, right:0, height:52, background:'rgba(10,15,24,0.98)', backdropFilter:'blur(8px)', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 18px', zIndex:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:3, height:18, background:p.primary, borderRadius:2 }} />
          <span style={{ color:'white', fontWeight:600, fontSize:13 }}>{aula?.titulo}</span>
        </div>
        <button onClick={() => setModoGrade(false)} style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.8)', padding:'5px 14px', borderRadius:6, cursor:'pointer', fontSize:12, fontWeight:600, fontFamily:'inherit' }}>Fechar grade</button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(185px,1fr))', gap:12, maxWidth:1100, margin:'0 auto' }}>
        {slides.map((s, i) => (
          <div key={s.id||i}>
            <div onClick={() => { setIdx(i); setModoGrade(false) }}
              style={{ width:'100%', aspectRatio:'16/9', borderRadius:6, overflow:'hidden', border: idx===i?`2px solid ${p.primary}`:'2px solid rgba(255,255,255,0.06)', cursor:'pointer', boxShadow: idx===i?`0 0 16px ${p.primary}50`:'none', transition:'all 0.15s', position:'relative' }}>
              <div style={{ transform:'scale(0.188)', transformOrigin:'top left', width:'532%', height:'532%', pointerEvents:'none' }}>
                <SlideBase s={s} p={p} num={i+1} total={slides.length} aula={aula} />
              </div>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:5 }}>
              <span style={{ color:'rgba(255,255,255,0.25)', fontSize:9, letterSpacing:'0.05em' }}>{String(i+1).padStart(2,'0')} · {s.tipo||'conteúdo'}</span>
              {podEdit && (
                <button onClick={() => { if(confirm('Remover slide?')){ const n=slides.filter((_,j)=>j!==i); setSlides(n); setIdx(Math.min(idx,n.length-1)); supabase.from('aulas').update({slides_editados:JSON.stringify(n),editado:true}).eq('id',id) } }}
                  style={{ background:'rgba(239,68,68,0.1)', border:'none', borderRadius:4, color:'#f87171', cursor:'pointer', padding:'2px 7px', fontSize:10, fontFamily:'inherit' }}>✕</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // ── VIEW PRINCIPAL ─────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:'100vh', background:'#0a0f18', fontFamily:"'DM Sans',sans-serif", display:'flex', flexDirection:'column' }}>

      {/* TOPBAR */}
      <div style={{ position:'fixed', top:0, left:0, right:0, height:50, background:'rgba(10,15,24,0.98)', backdropFilter:'blur(12px)', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 12px', zIndex:100 }}>

        <div style={{ display:'flex', alignItems:'center', gap:7 }}>
          <Btn onClick={() => router.push('/dashboard')}><IcBack /> Dashboard</Btn>
          <div style={{ width:1, height:18, background:'rgba(255,255,255,0.08)', margin:'0 2px' }} />
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:3, height:14, background:p.primary, borderRadius:2 }} />
            <span style={{ color:'rgba(255,255,255,0.4)', fontSize:11, maxWidth:220, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{aula?.titulo}</span>
          </div>
          {salvando && <span style={{ fontSize:10, color:'rgba(255,255,255,0.2)', fontStyle:'italic' }}>Salvando…</span>}
        </div>

        {/* NAVEGAÇÃO CENTRAL */}
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <button onClick={() => setIdx(i => Math.max(i-1, 0))} disabled={idx===0}
            style={{ width:28, height:28, borderRadius:6, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'center', cursor:idx===0?'not-allowed':'pointer', opacity:idx===0?0.3:1, color:'rgba(255,255,255,0.8)' }}>
            <Prev />
          </button>
          <span style={{ color:'rgba(255,255,255,0.5)', fontSize:12, fontWeight:600, minWidth:56, textAlign:'center' }}>
            {idx+1} <span style={{ opacity:.3 }}>/</span> {slides.length}
          </span>
          <button onClick={() => setIdx(i => Math.min(i+1, slides.length-1))} disabled={idx===slides.length-1}
            style={{ width:28, height:28, borderRadius:6, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'center', cursor:idx===slides.length-1?'not-allowed':'pointer', opacity:idx===slides.length-1?0.3:1, color:'rgba(255,255,255,0.8)' }}>
            <Next />
          </button>
        </div>

        {/* AÇÕES DIREITA */}
        <div style={{ display:'flex', alignItems:'center', gap:5 }}>
          {/* Seletor de paleta — só plano escola */}
          {podCor && (
            <div style={{ display:'flex', gap:5, padding:'4px 9px', background:'rgba(255,255,255,0.05)', borderRadius:6, border:'1px solid rgba(255,255,255,0.07)' }}>
              {Object.entries(PALETAS).map(([nm, pal]) => (
                <button key={nm} title={nm} onClick={() => setPalNome(nm)}
                  style={{ width:13, height:13, borderRadius:'50%', background:pal.primary, border: palNome===nm?'2px solid white':'2px solid transparent', cursor:'pointer', padding:0, transition:'transform 0.1s', transform: palNome===nm?'scale(1.2)':'scale(1)' }} />
              ))}
            </div>
          )}
          {slide.roteiro_professor && <Btn onClick={() => setVerRoteiro(v => !v)} ativo={verRoteiro}><IcMic /> Roteiro</Btn>}
          {podEdit && <Btn onClick={() => setEditando(slide)}><IcEdit /> Editar</Btn>}
          <Btn onClick={() => setModoPlanAula(true)}><IcBook /> Plano</Btn>
          <Btn onClick={() => setModoGrade(true)}><IcGrid /> Grade</Btn>
          {atividade?.titulo && <Btn onClick={() => setPainelAtividade(v => !v)} ativo={painelAtividade}><IcTask /> Atividade</Btn>}
          <button onClick={handleExportarPPT} disabled={exportando}
            style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 14px', background: exportando?'rgba(255,255,255,0.05)':p.primary, border:`1px solid ${exportando?'rgba(255,255,255,0.1)':p.primary}`, borderRadius:6, color: exportando?'rgba(255,255,255,0.3)':'white', cursor: exportando?'wait':'pointer', fontSize:12, fontWeight:700, fontFamily:'inherit', transition:'all 0.15s', boxShadow: exportando?'none':`0 2px 12px ${p.primary}45` }}>
            <IcPPT /> {exportando ? 'Exportando…' : 'PPT'}
          </button>
        </div>
      </div>

      {/* SLIDE PRINCIPAL */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'66px 20px 80px', minHeight:'100vh' }}>
        <div style={{ width:'min(980px,calc(100vw - 40px))', aspectRatio:'16/9', borderRadius:10, overflow:'hidden', boxShadow:'0 40px 100px rgba(0,0,0,0.75)', position:'relative' }}>
          <SlideBase s={slide} p={p} num={idx+1} total={slides.length} aula={aula} />
        </div>
      </div>

      {/* ROTEIRO */}
      {verRoteiro && slide.roteiro_professor && (
        <div style={{ position:'fixed', bottom:80, left:'50%', transform:'translateX(-50%)', width:'min(700px,88vw)', background:'rgba(10,15,24,0.97)', border:`1px solid ${p.primary}35`, borderRadius:9, padding:'12px 16px', zIndex:90, backdropFilter:'blur(8px)' }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:9 }}>
            <span style={{ fontSize:14, flexShrink:0 }}>🎙</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:9, fontWeight:700, color:p.gold, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:4 }}>Roteiro do Professor</div>
              <p style={{ fontSize:12, color:'rgba(255,255,255,0.7)', lineHeight:1.65, margin:0 }}>{slide.roteiro_professor}</p>
            </div>
            <button onClick={() => setVerRoteiro(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.2)', flexShrink:0, display:'flex', marginLeft:6 }}><IcClose /></button>
          </div>
        </div>
      )}

      {/* THUMBNAILS */}
      <div style={{ position:'fixed', bottom:0, left:0, right:0, height:70, background:'rgba(10,15,24,0.98)', backdropFilter:'blur(12px)', borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', gap:5, padding:'0 12px', overflowX:'auto' }}>
        {slides.map((s, i) => (
          <button key={s.id||i} onClick={() => setIdx(i)}
            style={{ flexShrink:0, width:70, height:44, borderRadius:5, overflow:'hidden', padding:0, border: idx===i?`2px solid ${p.primary}`:'2px solid rgba(255,255,255,0.06)', cursor:'pointer', position:'relative', transition:'all 0.12s', boxShadow: idx===i?`0 0 10px ${p.primary}60`:'none', background:'transparent' }}>
            <div style={{ transform:'scale(0.1083)', transformOrigin:'top left', width:'923%', height:'923%', pointerEvents:'none' }}>
              <SlideBase s={s} p={p} num={i+1} total={slides.length} aula={aula} />
            </div>
            <div style={{ position:'absolute', bottom:1, right:3, fontSize:7, color: idx===i?p.primary:'rgba(255,255,255,0.3)', fontWeight:700 }}>{i+1}</div>
          </button>
        ))}
      </div>

      {/* PAINEL ATIVIDADE */}
      {painelAtividade && atividade && (
        <>
          <div onClick={() => setPainelAtividade(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:150, backdropFilter:'blur(2px)' }} />
          <PainelAtividade atividade={atividade} paleta={p} onFechar={() => setPainelAtividade(false)} />
        </>
      )}

      {/* EDITOR */}
      {editando && podEdit && (
        <ModalEditor slide={editando} paleta={p} onSalvar={salvarSlide} onFechar={() => setEditando(null)} />
      )}
    </div>
  )
}