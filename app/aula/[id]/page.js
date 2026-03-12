'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'

// ─── SISTEMA DE DESIGN ────────────────────────────────────────────────────────
// Regras fixas que garantem padronização em TODOS os slides:
// • Todo slide é 960×540px (16:9), padding interno de 56px horizontal / 44px vertical
// • Zona de header: badge etapa (topo-esq) + número slide (topo-dir)
// • Zona de título: sempre no mesmo Y (após badge)
// • Zona de conteúdo: bullet points com estilo único
// • Zona de destaque: número/palavra grande, sempre posição consistente
// • Cores: só mudam fundo/texto — estrutura nunca muda

const PALETAS = {
  azul:    { primary: '#1a56db', dark: '#0d1f4e', light: '#dbeafe', accent: '#93c5fd', muted: '#1e3a8a' },
  verde:   { primary: '#059669', dark: '#052e16', light: '#d1fae5', accent: '#6ee7b7', muted: '#065f46' },
  roxo:    { primary: '#7c3aed', dark: '#1e1b4b', light: '#ede9fe', accent: '#c4b5fd', muted: '#4c1d95' },
  laranja: { primary: '#ea580c', dark: '#431407', light: '#ffedd5', accent: '#fdba74', muted: '#9a3412' },
  rosa:    { primary: '#db2777', dark: '#500724', light: '#fce7f3', accent: '#f9a8d4', muted: '#9d174d' },
  cinza:   { primary: '#334155', dark: '#0f172a', light: '#e2e8f0', accent: '#94a3b8', muted: '#1e293b' },
}

const ETAPAS = {
  introducao:      { label: 'Introdução',      bg: '#1e3a5f', cor: '#93c5fd' },
  desenvolvimento: { label: 'Desenvolvimento', bg: '#14532d', cor: '#86efac' },
  execucao:        { label: 'Execução',         bg: '#713f12', cor: '#fde68a' },
  revisao:         { label: 'Revisão',          bg: '#4a1d96', cor: '#c4b5fd' },
}

// ─── ÍCONES SVG ───────────────────────────────────────────────────────────────
const Prev = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15,18 9,12 15,6"/></svg>
const Next = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9,18 15,12 9,6"/></svg>
const IcGrid = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
const IcBook = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
const IcTask = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,11 12,14 22,4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
const IcPPT = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
const IcEdit = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
const IcClose = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IcMic = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
const IcBack = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15,18 9,12 15,6"/></svg>

// ─── COMPONENTE DE SLIDE PADRONIZADO ──────────────────────────────────────────
// TODOS os slides usam o mesmo layout base. A diferença é apenas:
// - cor de fundo / cor de texto
// - se tem destaque à direita ou centralizado
// - se tem split (capa/intro)
function SlideBase({ s, p, num, total }) {
  const etapa = ETAPAS[s.etapa]
  const isDark = s.cor_fundo === '#0f172a' || s.cor_fundo === p.dark || s.cor_fundo?.startsWith('#0') || s.cor_fundo === '#1a56db' || s.cor_fundo === '#1e3a5f'
  const tc = s.cor_texto || (isDark ? '#ffffff' : '#0f172a')
  const bg = s.cor_fundo || (isDark ? '#0f172a' : '#ffffff')

  // ── CAPA: layout especial com título grande e linha decorativa ──
  if (s.tipo === 'capa') {
    return (
      <div style={{
        width: '100%', height: '100%',
        background: bg,
        display: 'flex', flexDirection: 'column',
        padding: '44px 56px',
        position: 'relative', overflow: 'hidden',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        boxSizing: 'border-box',
      }}>
        {/* Faixa decorativa esquerda */}
        <div style={{ position: 'absolute', left: 0, top: '15%', bottom: '15%', width: 3, background: `linear-gradient(180deg, transparent, ${p.accent}, transparent)` }} />
        {/* Círculo decorativo */}
        <div style={{ position: 'absolute', right: -60, top: -60, width: 280, height: 280, borderRadius: '50%', border: `1px solid ${p.accent}18`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 20, top: 20, width: 140, height: 140, borderRadius: '50%', border: `1px solid ${p.accent}10`, pointerEvents: 'none' }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'auto' }}>
          {etapa && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: p.accent }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: p.accent, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                {etapa.label}
              </span>
            </div>
          )}
          <span style={{ fontSize: 10, color: `${tc}30`, fontWeight: 600, marginLeft: 'auto' }}>
            {String(num).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>

        {/* Conteúdo central */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', flex: 1 }}>
          {s.destaque && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 20, height: 2, background: p.accent }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: p.accent, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{s.destaque}</span>
            </div>
          )}
          <h1 style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.8rem)',
            fontWeight: 900, color: tc, lineHeight: 1.05,
            letterSpacing: '-0.03em', margin: '0 0 16px',
            maxWidth: '75%',
          }}>{s.titulo}</h1>
          {s.subtitulo && (
            <p style={{ fontSize: 'clamp(0.85rem, 1.4vw, 1.15rem)', color: `${tc}70`, lineHeight: 1.6, margin: '0 0 24px', maxWidth: 480 }}>
              {s.subtitulo}
            </p>
          )}
          {s.conteudo?.[0] && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '10px 16px',
              background: `${p.accent}12`,
              border: `1px solid ${p.accent}25`,
              borderRadius: 8, width: 'fit-content',
            }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: p.accent, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: `${tc}80` }}>{s.conteudo[0]}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── INTRODUÇÃO: split 55/45 ──
  if (s.tipo === 'introducao') {
    const [l1, l2, l3, l4, l5] = s.conteudo || []
    return (
      <div style={{
        width: '100%', height: '100%',
        display: 'grid', gridTemplateColumns: '55% 45%',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        overflow: 'hidden',
      }}>
        {/* Coluna esquerda — conteúdo */}
        <div style={{
          background: bg, padding: '36px 40px 36px 56px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          borderRight: `1px solid ${tc}08`,
          boxSizing: 'border-box',
        }}>
          <SlideHeader s={s} p={p} num={num} total={total} tc={tc} />
          <h2 style={{
            fontSize: 'clamp(1.2rem, 2.2vw, 1.9rem)',
            fontWeight: 900, color: tc, lineHeight: 1.15,
            letterSpacing: '-0.02em', margin: '0 0 20px',
          }}>{s.titulo}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {[l1, l2, l3].filter(Boolean).map((l, i) => (
              <BulletItem key={i} text={l} tc={tc} p={p} size={13} />
            ))}
          </div>
        </div>
        {/* Coluna direita — destaque / pergunta */}
        <div style={{
          background: p.primary,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '36px 40px',
          position: 'relative', overflow: 'hidden',
          boxSizing: 'border-box',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ position: 'absolute', bottom: -20, left: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>
            Para pensar
          </div>
          {[l4, l5].filter(Boolean).map((l, i) => (
            <p key={i} style={{
              fontSize: i === 0 ? 'clamp(0.9rem,1.6vw,1.2rem)' : 13,
              color: i === 0 ? '#fff' : 'rgba(255,255,255,0.6)',
              fontWeight: i === 0 ? 700 : 400,
              lineHeight: 1.55, margin: '0 0 12px',
              position: 'relative', zIndex: 1,
            }}>{l}</p>
          ))}
          {s.destaque && (
            <div style={{
              marginTop: 16, padding: '8px 14px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 7, fontSize: 12,
              color: 'rgba(255,255,255,0.8)', fontWeight: 600,
              display: 'inline-block', width: 'fit-content',
            }}>{s.destaque}</div>
          )}
        </div>
      </div>
    )
  }

  // ── DADO VISUAL: número enorme centralizado ──
  if (s.tipo === 'dado_visual') {
    return (
      <div style={{
        width: '100%', height: '100%',
        background: bg, padding: '44px 56px',
        display: 'flex', flexDirection: 'column',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        boxSizing: 'border-box', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 380, height: 380, borderRadius: '50%', border: `1px solid ${tc}12`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 240, height: 240, borderRadius: '50%', border: `1px solid ${tc}08`, pointerEvents: 'none' }} />
        <SlideHeader s={s} p={p} num={num} total={total} tc={tc} />
        <div style={{ flex: 1, display: 'flex', gap: 40, alignItems: 'center' }}>
          {/* Número grande */}
          <div style={{ textAlign: 'center', minWidth: 200, position: 'relative', zIndex: 1 }}>
            <div style={{
              fontSize: 'clamp(3rem, 8vw, 6.5rem)',
              fontWeight: 900, color: tc,
              lineHeight: 0.9, letterSpacing: '-0.05em',
              marginBottom: 8,
            }}>{s.destaque || '—'}</div>
            <div style={{ width: 32, height: 2, background: `${tc}40`, margin: '0 auto 8px' }} />
            <div style={{ fontSize: 10, color: `${tc}50`, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>dado-chave</div>
          </div>
          {/* Linhas de contexto */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h2 style={{ fontSize: 'clamp(1rem,1.8vw,1.5rem)', fontWeight: 800, color: tc, lineHeight: 1.2, margin: '0 0 14px', letterSpacing: '-0.01em' }}>{s.titulo}</h2>
            {s.conteudo?.map((l, i) => (
              <BulletItem key={i} text={l} tc={tc} p={p} size={13} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── EXECUÇÃO: card com passos numerados ──
  if (s.tipo === 'execucao') {
    return (
      <div style={{
        width: '100%', height: '100%',
        background: bg, padding: '44px 56px',
        display: 'flex', flexDirection: 'column',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        boxSizing: 'border-box', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${p.primary}, ${p.accent})` }} />
        <SlideHeader s={s} p={p} num={num} total={total} tc={tc} />
        <div style={{ display: 'flex', gap: 36, flex: 1, alignItems: 'flex-start', marginTop: 8 }}>
          {/* Destaque lateral */}
          <div style={{
            minWidth: 110, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: `${p.primary}15`, borderRadius: 12,
            padding: '20px 14px', alignSelf: 'stretch',
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>✏️</div>
            {s.destaque && (
              <div style={{ fontSize: 11, fontWeight: 800, color: p.primary, textAlign: 'center', lineHeight: 1.3 }}>{s.destaque}</div>
            )}
          </div>
          {/* Conteúdo */}
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 'clamp(1.1rem,2vw,1.7rem)', fontWeight: 900, color: tc, lineHeight: 1.15, margin: '0 0 20px', letterSpacing: '-0.02em' }}>{s.titulo}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {s.conteudo?.map((l, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    minWidth: 22, height: 22, borderRadius: 6,
                    background: p.primary,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 800, color: '#fff', flexShrink: 0, marginTop: 2,
                  }}>{i + 1}</div>
                  <p style={{ fontSize: 13, color: `${tc}${i === 0 ? 'ff' : 'cc'}`, lineHeight: 1.65, margin: 0 }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── REVISÃO: grid de cards ──
  if (s.tipo === 'revisao') {
    return (
      <div style={{
        width: '100%', height: '100%',
        background: bg, padding: '44px 56px',
        display: 'flex', flexDirection: 'column',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        boxSizing: 'border-box',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${p.primary}, ${p.accent})` }} />
        <SlideHeader s={s} p={p} num={num} total={total} tc={tc} />
        <h2 style={{ fontSize: 'clamp(1.3rem,2.4vw,2rem)', fontWeight: 900, color: tc, letterSpacing: '-0.02em', margin: '0 0 20px' }}>{s.titulo}</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(s.conteudo?.length || 3, 3)}, 1fr)`,
          gap: 12, flex: 1,
        }}>
          {s.conteudo?.map((l, i) => {
            const texto = l.replace(/^\d+\s*[—\-.]\s*/, '').trim()
            const isQ = texto.includes('?')
            return (
              <div key={i} style={{
                background: isQ ? p.primary : `${p.primary}0a`,
                borderRadius: 10, padding: '16px 14px',
                border: isQ ? 'none' : `1px solid ${p.primary}18`,
                borderTop: isQ ? 'none' : `2px solid ${p.primary}`,
                display: 'flex', flexDirection: 'column',
              }}>
                {!isQ && (
                  <div style={{ fontSize: 18, fontWeight: 900, color: `${p.primary}25`, lineHeight: 1, marginBottom: 8 }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                )}
                {isQ && <div style={{ fontSize: 16, marginBottom: 6 }}>💬</div>}
                <p style={{ fontSize: 12, color: isQ ? '#fff' : tc, lineHeight: 1.6, margin: 0, flex: 1 }}>{texto}</p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ── LAYOUT PADRÃO (conceito, exemplo, fallback) ──
  // Grade: coluna esquerda 40% decorativa + coluna direita 60% conteúdo
  const par = (num % 2 === 0)
  const accentBg   = par ? `${p.primary}10` : p.primary
  const accentText = par ? p.primary : '#ffffff'

  return (
    <div style={{
      width: '100%', height: '100%',
      background: bg,
      display: 'grid', gridTemplateColumns: '38% 62%',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      overflow: 'hidden',
    }}>
      {/* Coluna esquerda — decorativa */}
      <div style={{
        background: accentBg,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '36px 28px', position: 'relative', overflow: 'hidden',
        boxSizing: 'border-box',
      }}>
        {/* Anel decorativo */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 200, height: 200, borderRadius: '50%', border: `1px solid ${accentText}15` }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 130, height: 130, borderRadius: '50%', border: `1px solid ${accentText}10` }} />
        {/* Destaque ou número do slide */}
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {s.destaque ? (
            <>
              <div style={{
                fontSize: 'clamp(1.6rem,4vw,3rem)',
                fontWeight: 900, color: accentText,
                lineHeight: 0.95, letterSpacing: '-0.04em',
                marginBottom: 8,
              }}>{s.destaque}</div>
              <div style={{ width: 24, height: 2, background: `${accentText}50`, margin: '0 auto 6px' }} />
              <div style={{ fontSize: 9, color: `${accentText}60`, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {s.tipo === 'exemplo' ? 'caso real' : 'conceito-chave'}
              </div>
            </>
          ) : (
            <div style={{
              fontSize: 'clamp(2rem,5vw,3.8rem)',
              fontWeight: 900, color: `${accentText}20`,
              lineHeight: 0.9, letterSpacing: '-0.05em',
            }}>{String(num).padStart(2, '0')}</div>
          )}
        </div>
      </div>

      {/* Coluna direita — conteúdo */}
      <div style={{
        padding: '36px 40px 36px 32px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        boxSizing: 'border-box', overflow: 'hidden',
      }}>
        <SlideHeader s={s} p={p} num={num} total={total} tc={tc} rightAligned />
        <div style={{ width: 28, height: 3, background: p.primary, borderRadius: 4, marginBottom: 16 }} />
        <h2 style={{
          fontSize: 'clamp(1rem,1.9vw,1.6rem)',
          fontWeight: 900, color: tc, lineHeight: 1.15,
          letterSpacing: '-0.02em', margin: '0 0 18px',
        }}>{s.titulo}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, overflow: 'hidden' }}>
          {s.conteudo?.slice(0, 6).map((l, i) => (
            <BulletItem key={i} text={l} tc={tc} p={p} size={12.5} dim={i > 0} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── COMPONENTES AUXILIARES ───────────────────────────────────────────────────
function SlideHeader({ s, p, num, total, tc, rightAligned }) {
  const etapa = ETAPAS[s.etapa]
  return (
    <div style={{
      display: 'flex', justifyContent: rightAligned ? 'flex-end' : 'space-between',
      alignItems: 'center', marginBottom: 14, flexShrink: 0,
    }}>
      {!rightAligned && etapa && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '3px 9px',
          background: etapa.bg,
          borderRadius: 100, fontSize: 9,
          fontWeight: 700, color: etapa.cor,
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>{etapa.label}</div>
      )}
      {rightAligned && etapa && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '3px 9px', background: etapa.bg,
          borderRadius: 100, fontSize: 9,
          fontWeight: 700, color: etapa.cor,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          marginRight: 10,
        }}>{etapa.label}</div>
      )}
      <span style={{ fontSize: 9, color: `${tc}25`, fontWeight: 600 }}>
        {String(num).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  )
}

function BulletItem({ text, tc, p, size = 13, dim = false }) {
  return (
    <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
      <div style={{
        width: 5, height: 5, borderRadius: '50%',
        background: p.primary, marginTop: (size * 1.65) / 2 - 2.5,
        flexShrink: 0,
      }} />
      <p style={{
        fontSize: size, color: `${tc}${dim ? 'bb' : 'ee'}`,
        lineHeight: 1.65, margin: 0,
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
      }}>{text}</p>
    </div>
  )
}

// ─── EDITOR MODAL ─────────────────────────────────────────────────────────────
function ModalEditor({ slide, paleta, onSalvar, onFechar }) {
  const [titulo,   setTitulo]   = useState(slide.titulo    || '')
  const [subtitulo,setSubtitulo]= useState(slide.subtitulo || '')
  const [destaque, setDestaque] = useState(slide.destaque  || '')
  const [conteudo, setConteudo] = useState([...(slide.conteudo || [])])

  const inp = { width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', color: '#0f172a' }
  const lbl = { fontSize: 11, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: 'white', borderRadius: 14, padding: 28, width: 'min(520px,92vw)', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.35)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>Editar slide</h3>
          <button onClick={onFechar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}><IcClose /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><label style={lbl}>Título</label><input value={titulo} onChange={e => setTitulo(e.target.value)} style={inp} /></div>
          <div><label style={lbl}>Subtítulo / Pergunta</label><input value={subtitulo} onChange={e => setSubtitulo(e.target.value)} style={inp} /></div>
          <div><label style={lbl}>Destaque (número ou palavra grande)</label><input value={destaque} onChange={e => setDestaque(e.target.value)} style={{ ...inp }} placeholder="Ex: 68%, R$2,4tri..." /></div>
          <div>
            <label style={lbl}>Tópicos de conteúdo</label>
            {conteudo.map((l, i) => (
              <div key={i} style={{ display: 'flex', gap: 7, marginBottom: 7 }}>
                <textarea value={l} rows={2} onChange={e => { const c = [...conteudo]; c[i] = e.target.value; setConteudo(c) }} style={{ ...inp, resize: 'vertical', flex: 1 }} />
                <button onClick={() => setConteudo(conteudo.filter((_, j) => j !== i))} style={{ background: '#fee2e2', border: 'none', borderRadius: 7, padding: '0 10px', cursor: 'pointer', color: '#ef4444', fontSize: 14 }}>✕</button>
              </div>
            ))}
            <button onClick={() => setConteudo([...conteudo, ''])} style={{ fontSize: 12, fontWeight: 600, color: paleta.primary, background: `${paleta.primary}10`, border: `1px solid ${paleta.primary}25`, borderRadius: 7, padding: '7px 14px', cursor: 'pointer', fontFamily: 'inherit' }}>
              + Adicionar tópico
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 9, marginTop: 24 }}>
          <button onClick={onFechar} style={{ flex: 1, padding: 11, background: '#f1f5f9', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: '#64748b' }}>Cancelar</button>
          <button onClick={() => onSalvar({ ...slide, titulo, subtitulo, destaque, conteudo })} style={{ flex: 2, padding: 11, background: paleta.primary, color: 'white', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Salvar</button>
        </div>
      </div>
    </div>
  )
}

// ─── PAINEL ATIVIDADE ─────────────────────────────────────────────────────────
function PainelAtividade({ atividade, paleta, onFechar }) {
  const [aba, setAba] = useState('descricao')
  if (!atividade?.titulo) return null
  const abas = [{ id: 'descricao', label: '📋 Atividade' }, { id: 'exercicios', label: '✍️ Exercícios' }, { id: 'gabarito', label: '✅ Gabarito' }]

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(480px,92vw)', background: 'white', boxShadow: '-8px 0 40px rgba(0,0,0,0.25)', zIndex: 200, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '18px 20px', borderBottom: '1px solid #e2e8f0', background: paleta.primary, flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4 }}>EXECUÇÃO</div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'white', lineHeight: 1.3 }}>{atividade.titulo}</h3>
            {atividade.tempo && <div style={{ marginTop: 5, fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>⏱ {atividade.tempo}</div>}
          </div>
          <button onClick={onFechar} style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 7, padding: 7, cursor: 'pointer', color: 'white', display: 'flex', marginLeft: 10 }}><IcClose /></button>
        </div>
      </div>
      <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', flexShrink: 0 }}>
        {abas.map(a => (
          <button key={a.id} onClick={() => setAba(a.id)} style={{ flex: 1, padding: '10px 4px', border: 'none', borderBottom: aba === a.id ? `2px solid ${paleta.primary}` : '2px solid transparent', background: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: aba === a.id ? paleta.primary : '#64748b', fontFamily: 'inherit' }}>
            {a.label}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
        {aba === 'descricao' && (
          <div>
            <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, marginBottom: 18 }}>{atividade.descricao}</p>
            {atividade.instrucoes?.length > 0 && (
              <>
                <div style={{ fontSize: 10, fontWeight: 700, color: paleta.primary, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Passo a passo</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 18 }}>
                  {atividade.instrucoes.map((inst, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{ minWidth: 22, height: 22, borderRadius: 6, background: paleta.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: 'white', flexShrink: 0 }}>{i + 1}</div>
                      <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.6, margin: 0 }}>{inst}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
            {atividade.dica_professor && (
              <div style={{ padding: '12px 14px', background: '#fffbeb', borderRadius: 9, border: '1px solid #fde68a' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#d97706', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>💡 Dica para o professor</div>
                <p style={{ fontSize: 12, color: '#92400e', lineHeight: 1.6, margin: 0 }}>{atividade.dica_professor}</p>
              </div>
            )}
          </div>
        )}
        {aba === 'exercicios' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {atividade.exercicios?.map(ex => (
              <div key={ex.numero} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 9 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 5, background: paleta.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: 'white' }}>{ex.numero}</div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{ex.tipo === 'dissertativa' ? 'Dissertativa' : 'Múltipla escolha'}</span>
                </div>
                <p style={{ fontSize: 13, color: '#0f172a', lineHeight: 1.6, margin: '0 0 12px', fontWeight: 500 }}>{ex.enunciado}</p>
                {ex.alternativas && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {ex.alternativas.map((alt, j) => (
                      <div key={j} style={{ padding: '8px 12px', borderRadius: 7, background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: 12, color: '#374151', lineHeight: 1.5 }}>{alt}</div>
                    ))}
                  </div>
                )}
                {!ex.alternativas && (
                  <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: 7, border: '1px solid #e2e8f0', fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>Resposta dissertativa</div>
                )}
              </div>
            ))}
          </div>
        )}
        {aba === 'gabarito' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {atividade.exercicios?.map(ex => (
              <div key={ex.numero} style={{ padding: '12px 14px', background: 'white', borderRadius: 10, border: '1px solid #e2e8f0', borderLeft: `3px solid ${paleta.primary}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: paleta.primary }}>Questão {ex.numero}</span>
                  {ex.resposta_correta && (
                    <span style={{ background: `${paleta.primary}12`, color: paleta.primary, fontSize: 11, fontWeight: 700, padding: '1px 9px', borderRadius: 100 }}>
                      {ex.resposta_correta}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.65, margin: 0 }}>{ex.explicacao || ex.criterios || ex.resposta_esperada}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── PAINEL PLANO DE AULA ─────────────────────────────────────────────────────
function PainelPlanoAula({ aula, paleta, onVoltar }) {
  const pa = (() => { try { return JSON.parse(aula.plano_aula) } catch { return {} } })()
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={onVoltar} style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: 7, padding: '5px 12px', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, color: '#475569', fontFamily: 'inherit' }}>
            <IcBack /> Voltar
          </button>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#0f2b5b' }}>Plano de Aula</span>
        </div>
        <span style={{ fontSize: 11, color: '#94a3b8' }}>{aula.disciplina} · {aula.nivel} · {aula.duracao}</span>
      </div>
      <div style={{ maxWidth: 620, margin: '0 auto', padding: '28px 20px' }}>
        {[{ label: 'Objetivo Geral', value: pa?.objetivo_geral }, { label: 'Avaliação', value: pa?.avaliacao }].map(it => it.value && (
          <div key={it.label} style={{ background: 'white', borderRadius: 10, padding: 18, marginBottom: 10, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: paleta.primary, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 7 }}>{it.label}</div>
            <p style={{ color: '#1e293b', lineHeight: 1.7, margin: 0, fontSize: 13 }}>{it.value}</p>
          </div>
        ))}
        {pa?.objetivos_especificos?.length > 0 && (
          <div style={{ background: 'white', borderRadius: 10, padding: 18, marginBottom: 10, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: paleta.primary, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Objetivos Específicos</div>
            {pa.objetivos_especificos.map((o, i) => (
              <div key={i} style={{ display: 'flex', gap: 9, marginBottom: 8 }}>
                <div style={{ width: 18, height: 18, borderRadius: 5, background: paleta.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: 'white', flexShrink: 0, marginTop: 2 }}>{i + 1}</div>
                <p style={{ fontSize: 12, color: '#1e293b', lineHeight: 1.6, margin: 0 }}>{o}</p>
              </div>
            ))}
          </div>
        )}
        {pa?.competencias_bncc?.length > 0 && (
          <div style={{ background: 'white', borderRadius: 10, padding: 18, marginBottom: 10, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: paleta.primary, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 9 }}>Competências BNCC</div>
            {pa.competencias_bncc.map((c, i) => (
              <div key={i} style={{ padding: '6px 10px', background: `${paleta.primary}08`, borderRadius: 6, marginBottom: 6, fontSize: 11, color: '#1e293b', lineHeight: 1.55 }}>{c}</div>
            ))}
          </div>
        )}
        {pa?.materiais?.length > 0 && (
          <div style={{ background: 'white', borderRadius: 10, padding: 18, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: paleta.primary, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 9 }}>Materiais</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {pa.materiais.map((m, i) => (
                <span key={i} style={{ padding: '4px 10px', background: `${paleta.primary}10`, color: paleta.primary, borderRadius: 100, fontSize: 11, fontWeight: 600 }}>{m}</span>
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
  const id = params?.id

  const [aula,            setAula]            = useState(null)
  const [slides,          setSlides]          = useState([])
  const [atividade,       setAtividade]       = useState(null)
  const [idx,             setIdx]             = useState(0)
  const [loading,         setLoading]         = useState(true)
  const [planoUser,       setPlanoUser]       = useState('starter')
  const [palNome,         setPalNome]         = useState('azul')
  const [modoGrade,       setModoGrade]       = useState(false)
  const [modoPlanAula,    setModoPlanAula]    = useState(false)
  const [painelAtividade, setPainelAtividade] = useState(false)
  const [verRoteiro,      setVerRoteiro]      = useState(false)
  const [editando,        setEditando]        = useState(null)
  const [salvando,        setSalvando]        = useState(false)

  useEffect(() => { if (id) carregar() }, [id])

  useEffect(() => {
    const fn = e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown')  setIdx(i => Math.min(i + 1, slides.length - 1))
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')    setIdx(i => Math.max(i - 1, 0))
      if (e.key === 'Escape') { setModoGrade(false); setPainelAtividade(false); setVerRoteiro(false) }
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [slides])

  async function carregar() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { data: perf } = await supabase.from('profiles').select('plano').eq('id', user.id).single()
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

  async function exportarPPT() {
    const pptxgen = (await import('pptxgenjs')).default
    const prs = new pptxgen()
    prs.layout = 'LAYOUT_16x9'
    prs.title = aula?.titulo || 'Apresentação'
    const p = PALETAS[palNome]
    slides.forEach((s, i) => {
      const sl = prs.addSlide()
      sl.background = { color: (s.cor_fundo || '#ffffff').replace('#', '') }
      sl.addText(s.titulo || '', { x: .5, y: .7, w: 9, h: 1.3, fontSize: 30, bold: true, color: (s.cor_texto || '#0f172a').replace('#', ''), fontFace: 'Calibri' })
      if (s.conteudo?.length) sl.addText(s.conteudo.join('\n'), { x: .5, y: 2.2, w: 9, h: 4, fontSize: 14, color: (s.cor_texto || '#0f172a').replace('#', ''), fontFace: 'Calibri', valign: 'top' })
      if (s.destaque) sl.addText(s.destaque, { x: 6.5, y: .2, w: 3, h: .6, fontSize: 12, bold: true, color: p.primary.replace('#', ''), align: 'right' })
    })
    await prs.writeFile({ fileName: `${aula?.titulo || 'aula'}.pptx` })
  }

  const p = PALETAS[palNome]
  const podEdit = planoUser === 'profissional' || planoUser === 'escola'
  const podCor  = planoUser === 'escola'
  const slide   = slides[idx]

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>📚</div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Carregando...</p>
      </div>
    </div>
  )

  if (modoPlanAula) return <PainelPlanoAula aula={aula} paleta={p} onVoltar={() => setModoPlanAula(false)} />
  if (!slide) return null

  // ── MODO GRADE ──────────────────────────────────────────────────────────────
  if (modoGrade) return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Plus Jakarta Sans',sans-serif", padding: '64px 24px 24px' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 52, background: 'rgba(15,23,42,0.97)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', zIndex: 10 }}>
        <span style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>{aula?.titulo}</span>
        <button onClick={() => setModoGrade(false)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', padding: '5px 14px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>
          Fechar grade
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 10, maxWidth: 1100, margin: '0 auto' }}>
        {slides.map((s, i) => (
          <div key={s.id || i}>
            <div onClick={() => { setIdx(i); setModoGrade(false) }}
              style={{ width: '100%', aspectRatio: '16/9', borderRadius: 8, overflow: 'hidden', border: idx === i ? `2px solid ${p.primary}` : '2px solid rgba(255,255,255,0.07)', cursor: 'pointer', boxShadow: idx === i ? `0 0 14px ${p.primary}50` : 'none', transition: 'all 0.15s', position: 'relative' }}>
              <div style={{ transform: 'scale(0.188)', transformOrigin: 'top left', width: '532%', height: '532%', pointerEvents: 'none' }}>
                <SlideBase s={s} p={p} num={i + 1} total={slides.length} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9 }}>{String(i + 1).padStart(2, '0')} {s.tipo}</span>
              {podEdit && (
                <button onClick={() => { if (confirm('Remover?')) { const n = slides.filter((_, j) => j !== i); setSlides(n); setIdx(Math.min(idx, n.length - 1)); supabase.from('aulas').update({ slides_editados: JSON.stringify(n), editado: true }).eq('id', id) } }}
                  style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: 4, color: '#f87171', cursor: 'pointer', padding: '2px 7px', fontSize: 10, fontFamily: 'inherit' }}>✕</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // ── TOPBAR BTN ──────────────────────────────────────────────────────────────
  const Btn = ({ onClick, children, ativo = false }) => (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 11px', background: ativo ? `${p.primary}35` : 'rgba(255,255,255,0.07)', border: `1px solid ${ativo ? p.primary : 'rgba(255,255,255,0.1)'}`, borderRadius: 7, color: ativo ? p.accent : 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
      {children}
    </button>
  )

  // ── APRESENTAÇÃO PRINCIPAL ──────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#0b1120', fontFamily: "'Plus Jakarta Sans',sans-serif", display: 'flex', flexDirection: 'column' }}>

      {/* TOPBAR */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 50, background: 'rgba(11,17,32,0.98)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', zIndex: 100 }}>

        {/* Esquerda */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Btn onClick={() => router.push('/dashboard')}><IcBack /> Dashboard</Btn>
          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.1)', margin: '0 2px' }} />
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{aula?.titulo}</span>
          {salvando && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>Salvando…</span>}
        </div>

        {/* Centro — navegação */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button onClick={() => setIdx(i => Math.max(i - 1, 0))} disabled={idx === 0} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: idx === 0 ? 'not-allowed' : 'pointer', opacity: idx === 0 ? 0.3 : 1, color: 'rgba(255,255,255,0.8)' }}>
            <Prev />
          </button>
          <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 700, minWidth: 52, textAlign: 'center' }}>
            {idx + 1} <span style={{ opacity: .3 }}>/</span> {slides.length}
          </span>
          <button onClick={() => setIdx(i => Math.min(i + 1, slides.length - 1))} disabled={idx === slides.length - 1} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: idx === slides.length - 1 ? 'not-allowed' : 'pointer', opacity: idx === slides.length - 1 ? 0.3 : 1, color: 'rgba(255,255,255,0.8)' }}>
            <Next />
          </button>
        </div>

        {/* Direita — ações */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {podCor && (
            <div style={{ display: 'flex', gap: 4, padding: '4px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: 7, border: '1px solid rgba(255,255,255,0.08)' }}>
              {Object.keys(PALETAS).map(nm => (
                <button key={nm} title={nm} onClick={() => setPalNome(nm)} style={{ width: 13, height: 13, borderRadius: '50%', background: PALETAS[nm].primary, border: palNome === nm ? '2px solid white' : '2px solid transparent', cursor: 'pointer', padding: 0 }} />
              ))}
            </div>
          )}
          {slide.roteiro_professor && <Btn onClick={() => setVerRoteiro(v => !v)} ativo={verRoteiro}><IcMic /> Roteiro</Btn>}
          {podEdit && <Btn onClick={() => setEditando(slide)}><IcEdit /> Editar</Btn>}
          <Btn onClick={() => setModoPlanAula(true)}><IcBook /> Plano</Btn>
          <Btn onClick={() => setModoGrade(true)}><IcGrid /> Grade</Btn>
          {atividade?.titulo && <Btn onClick={() => setPainelAtividade(v => !v)} ativo={painelAtividade}><IcTask /> Atividade</Btn>}
          <button onClick={exportarPPT} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 13px', background: p.primary, border: 'none', borderRadius: 7, color: 'white', cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'inherit', boxShadow: `0 2px 10px ${p.primary}55` }}>
            <IcPPT /> PPT
          </button>
        </div>
      </div>

      {/* SLIDE PRINCIPAL */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px 20px 80px', minHeight: '100vh' }}>
        <div style={{ width: 'min(960px, calc(100vw - 40px))', aspectRatio: '16/9', borderRadius: 12, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.7)', position: 'relative' }}>
          <SlideBase s={slide} p={p} num={idx + 1} total={slides.length} />
        </div>
      </div>

      {/* ROTEIRO DO PROFESSOR */}
      {verRoteiro && slide.roteiro_professor && (
        <div style={{ position: 'fixed', bottom: 76, left: '50%', transform: 'translateX(-50%)', width: 'min(680px,86vw)', background: 'rgba(11,17,32,0.97)', border: `1px solid ${p.primary}35`, borderRadius: 10, padding: '12px 16px', zIndex: 90, backdropFilter: 'blur(8px)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>🎙</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: p.accent, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>Roteiro do Professor</div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 1.65, margin: 0 }}>{slide.roteiro_professor}</p>
            </div>
            <button onClick={() => setVerRoteiro(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.25)', flexShrink: 0, display: 'flex', marginLeft: 6 }}><IcClose /></button>
          </div>
        </div>
      )}

      {/* THUMBNAILS */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 68, background: 'rgba(11,17,32,0.98)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 5, padding: '0 14px', overflowX: 'auto' }}>
        {slides.map((s, i) => (
          <button key={s.id || i} onClick={() => setIdx(i)}
            style={{ flexShrink: 0, width: 68, height: 42, borderRadius: 5, overflow: 'hidden', padding: 0, border: idx === i ? `2px solid ${p.primary}` : '2px solid transparent', cursor: 'pointer', position: 'relative', transition: 'all 0.12s', boxShadow: idx === i ? `0 0 8px ${p.primary}60` : 'none' }}>
            <div style={{ transform: 'scale(0.1083)', transformOrigin: 'top left', width: '923%', height: '923%', pointerEvents: 'none' }}>
              <SlideBase s={s} p={p} num={i + 1} total={slides.length} />
            </div>
            <div style={{ position: 'absolute', bottom: 1, right: 2, fontSize: 7, color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>{i + 1}</div>
          </button>
        ))}
      </div>

      {/* PAINEL ATIVIDADE */}
      {painelAtividade && atividade && (
        <>
          <div onClick={() => setPainelAtividade(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 150, backdropFilter: 'blur(2px)' }} />
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