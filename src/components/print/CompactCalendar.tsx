import type { Calendar } from '../../types'
import type { Occurrence } from '../../lib/icsCore'
import { isLectiveDay } from '../../lib/lectiveDays'
import { occurrencesByDay, monthsInRange } from '../../lib/printData'
import { MONTH_NAMES, toISO } from '../../lib/dateUtils'

const WD = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

export default function CompactCalendar({ cal, profileId }: { cal: Calendar; profileId: string | null }) {
  if (!cal.courseStart || !cal.courseEnd) {
    return <p className="empty">Indica inicio y fin de curso para ver el calendario compacto.</p>
  }
  const byDay = occurrencesByDay(cal, profileId)
  const months = monthsInRange(cal.courseStart, cal.courseEnd)

  return (
    <>
      <div className="compact-grid">
        {months.map((mi) => (
          <MiniMonth key={`${mi.year}-${mi.month}`} cal={cal} year={mi.year} month={mi.month} byDay={byDay} />
        ))}
      </div>
      <Legend />
    </>
  )
}

function MiniMonth({
  cal,
  year,
  month,
  byDay,
}: {
  cal: Calendar
  year: number
  month: number
  byDay: Map<string, Occurrence[]>
}) {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7 // 0 = lunes
  const cells: (number | null)[] = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  const rows: (number | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7))

  return (
    <div className="mini-month">
      <h4>
        {MONTH_NAMES[month]} {year}
      </h4>
      <table className="mini">
        <thead>
          <tr>
            {WD.map((w, i) => (
              <th key={i}>{w}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((d, ci) => {
                if (d === null) return <td key={ci} className="out" />
                const iso = toISO(new Date(year, month, d))
                const occ = byDay.get(iso) ?? []
                const hasFest = occ.some((o) => o.kind === 'festivoAutonomico' || o.kind === 'festivoLocal')
                const hasVac = occ.some((o) => o.kind === 'vacaciones')
                const lective = isLectiveDay(cal, iso)
                const hasOther = occ.some(
                  (o) => !['vacaciones', 'festivoAutonomico', 'festivoLocal'].includes(o.kind),
                )
                let cls = 'nonlective'
                if (hasFest) cls = 'fest'
                else if (hasVac) cls = 'vac'
                else if (lective) cls = 'lective'
                const title = occ.map((o) => o.title).join(' · ')
                return (
                  <td key={ci} className={cls} title={title || undefined}>
                    {d}
                    {hasOther && <span className="ev-dot" />}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Legend() {
  return (
    <div className="tag-legend" style={{ marginTop: 16 }}>
      <span className="swatch">
        <span className="box" style={{ background: 'color-mix(in srgb, var(--lective) 40%, transparent)' }} /> Lectivo
      </span>
      <span className="swatch">
        <span className="box" style={{ background: 'color-mix(in srgb, var(--vacaciones) 45%, transparent)' }} />{' '}
        Vacaciones
      </span>
      <span className="swatch">
        <span className="box" style={{ background: 'color-mix(in srgb, var(--festivo) 40%, transparent)' }} /> Festivo
      </span>
      <span className="swatch">
        <span className="box" style={{ background: 'var(--accent)', borderRadius: '50%' }} /> Evento / hito
      </span>
    </div>
  )
}
