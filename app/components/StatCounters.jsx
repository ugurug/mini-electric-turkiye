'use client'
import { useEffect, useRef, useState } from 'react'

function useCountUp(target, run) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!run) return
    let raf
    const dur = 1200
    let start
    const tick = (t) => {
      if (start === undefined) start = t
      const p = Math.min((t - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3) // ease-out cubic
      setVal(Math.round(eased * target))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, run])
  return val
}

function Stat({ item, run, dark, size }) {
  const val = useCountUp(item.value || 0, run)
  const numSize = size === 'lg' ? 'clamp(34px, 6vw, 52px)' : 'clamp(24px, 4.5vw, 34px)'
  return (
    <div style={{ textAlign: 'center', minWidth: 92, flex: '1 1 92px' }}>
      <div style={{ fontFamily: "'Montserrat'", fontWeight: 900, fontSize: numSize, lineHeight: 1, letterSpacing: -1, color: dark ? '#fff' : '#111' }}>
        {val.toLocaleString('tr-TR')}<span style={{ color: '#E8000D' }}>{item.suffix || ''}</span>
      </div>
      <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase', color: dark ? 'rgba(255,255,255,0.55)' : '#888' }}>
        {item.label}
      </div>
    </div>
  )
}

export default function StatCounters({ items = [], dark = false, size = 'md' }) {
  const ref = useRef(null)
  const [run, setRun] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { setRun(true); io.disconnect() }
    }, { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const valid = items.filter(i => i && (i.value || i.value === 0) && i.label)
  if (valid.length === 0) return null
  return (
    <div ref={ref} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: size === 'lg' ? 32 : 20, rowGap: 24 }}>
      {valid.map((item, i) => <Stat key={i} item={item} run={run} dark={dark} size={size} />)}
    </div>
  )
}
