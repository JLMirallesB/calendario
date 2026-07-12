import type { Calendar } from '../../types'
import { expandOccurrences } from '../../lib/icsCore'
import { EVENT_KIND_COLOR } from '../../lib/labels'
import { MONTH_NAMES, formatHuman, parseISO } from '../../lib/dateUtils'

export default function ListLayout({ cal, profileId }: { cal: Calendar; profileId: string | null }) {
  const occ = expandOccurrences(cal, profileId)
  if (occ.length === 0) {
    return <p className="empty">No hay fechas para este perfil.</p>
  }

  // Agrupar por mes de la fecha de inicio.
  const groups = new Map<string, typeof occ>()
  for (const o of occ) {
    const d = parseISO(o.startISO)
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`
    const arr = groups.get(key) ?? []
    arr.push(o)
    groups.set(key, arr)
  }

  return (
    <div>
      {[...groups.entries()].map(([key, items]) => {
        const [y, m] = key.split('-').map(Number)
        return (
          <div key={key} className="month-block">
            <h3>
              {MONTH_NAMES[m]} {y}
            </h3>
            {items.map((o, i) => {
              const color =
                o.kind === 'termStart' || o.kind === 'guided'
                  ? 'var(--accent)'
                  : EVENT_KIND_COLOR[o.kind as keyof typeof EVENT_KIND_COLOR] ?? 'var(--text-muted)'
              const rangeLabel =
                o.startISO !== o.endISO ? `${formatHuman(o.startISO)} → ${formatHuman(o.endISO)}` : formatHuman(o.startISO)
              return (
                <div key={i} className="occ-row">
                  <span className="swatch-dot" style={{ background: color }} />
                  <span className="date">{rangeLabel}</span>
                  <span>
                    {o.title}
                    {o.provisional && <span className="badge badge-provisional" style={{ marginLeft: 8 }}>Provisional</span>}
                  </span>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
