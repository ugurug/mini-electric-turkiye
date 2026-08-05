'use client'
import { useState, useEffect, useCallback } from 'react'

export default function EventGallery({ images = [], title = '' }) {
  const [active, setActive] = useState(null) // açık lightbox index'i
  const has = Array.isArray(images) && images.length > 0
  const close = useCallback(() => setActive(null), [])
  const prev = useCallback(() => setActive(i => (i === null ? i : (i - 1 + images.length) % images.length)), [images.length])
  const next = useCallback(() => setActive(i => (i === null ? i : (i + 1) % images.length)), [images.length])

  useEffect(() => {
    if (active === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [active, close, prev, next])

  if (!has) return null

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: images.length === 1 ? '1fr' : 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 10,
        }}
      >
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              padding: 0, border: 'none', cursor: 'zoom-in', background: '#eee', borderRadius: 10, overflow: 'hidden',
              aspectRatio: images.length === 1 ? '16 / 9' : '1 / 1',
            }}
            aria-label={`${title} görsel ${i + 1}`}
          >
            <img src={src} alt={`${title} - ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          onClick={close}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        >
          <button onClick={close} aria-label="Kapat" style={{ position: 'absolute', top: 16, right: 20, background: 'none', border: 'none', color: '#fff', fontSize: 34, cursor: 'pointer', lineHeight: 1 }}>×</button>
          {images.length > 1 && (
            <button onClick={(e) => { e.stopPropagation(); prev() }} aria-label="Önceki" style={{ position: 'absolute', left: 12, background: 'rgba(255,255,255,0.12)', border: 'none', color: '#fff', fontSize: 30, cursor: 'pointer', width: 48, height: 48, borderRadius: '50%' }}>‹</button>
          )}
          <img
            src={images[active]}
            alt={`${title} - ${active + 1}`}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '92vw', maxHeight: '86vh', objectFit: 'contain', borderRadius: 8, boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}
          />
          {images.length > 1 && (
            <button onClick={(e) => { e.stopPropagation(); next() }} aria-label="Sonraki" style={{ position: 'absolute', right: 12, background: 'rgba(255,255,255,0.12)', border: 'none', color: '#fff', fontSize: 30, cursor: 'pointer', width: 48, height: 48, borderRadius: '50%' }}>›</button>
          )}
          {images.length > 1 && (
            <div style={{ position: 'absolute', bottom: 18, color: '#ddd', fontSize: 13, fontFamily: "'Inter', sans-serif" }}>{active + 1} / {images.length}</div>
          )}
        </div>
      )}
    </>
  )
}
