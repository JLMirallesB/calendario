import type { Calendar } from '../../types'
import { expandOccurrences } from '../../lib/icsCore'
import { EVENT_KIND_COLOR } from '../../lib/labels'
import { parseISO } from '../../lib/dateUtils'
import { occurrenceLabels, useI18n } from '../../i18n'

export default function ListLayout({ cal, profileId }: { cal: Calendar; profileId: string | null }) {
  const { t, fmt } = useI18n()
  const occ = expandOccurrences(cal, profileId, occurrenceLabels(t))
  if (occ.length === 0) {
    return <p className="empty">{t('print.noDatesForProfile')}</p>
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
              {fmt.monthName(m)} {y}
            </h3>
            {items.map((o, i) => {
              const color =
                o.kind === 'termStart' || o.kind === 'guided'
                  ? 'var(--accent)'
                  : EVENT_KIND_COLOR[o.kind as keyof typeof EVENT_KIND_COLOR] ?? 'var(--text-muted)'
              const rangeLabel =
                o.startISO !== o.endISO ? `${fmt.human(o.startISO)} → ${fmt.human(o.endISO)}` : fmt.human(o.startISO)
              return (
                <div key={i} className="occ-row">
                  <span className="swatch-dot" style={{ background: color }} />
                  <span className="date">{rangeLabel}</span>
                  <span>
                    {o.title}
                    {o.provisional && (
                      <span className="badge badge-provisional" style={{ marginLeft: 8 }}>
                        {t('common.provisional')}
                      </span>
                    )}
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
