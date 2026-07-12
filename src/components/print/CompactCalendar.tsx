import type { Calendar } from '../../types'
import type { Occurrence } from '../../lib/icsCore'
import { isLectiveDay } from '../../lib/lectiveDays'
import { occurrencesByDay, monthsInRange } from '../../lib/printData'
import { toISO, WEEKDAY_ORDER } from '../../lib/dateUtils'
import { occurrenceLabels, useI18n, type Formatters, type TFunc } from '../../i18n'

export default function CompactCalendar({ cal, profileId }: { cal: Calendar; profileId: string | null }) {
  const { t, fmt } = useI18n()
  if (!cal.courseStart || !cal.courseEnd) {
    return <p className="empty">{t('print.needDatesCompact')}</p>
  }
  const byDay = occurrencesByDay(cal, profileId, occurrenceLabels(t))
  const months = monthsInRange(cal.courseStart, cal.courseEnd)

  return (
    <>
      <div className="compact-grid">
        {months.map((mi) => (
          <MiniMonth key={`${mi.year}-${mi.month}`} cal={cal} year={mi.year} month={mi.month} byDay={byDay} fmt={fmt} />
        ))}
      </div>
      <Legend t={t} />
    </>
  )
}

function MiniMonth({
  cal,
  year,
  month,
  byDay,
  fmt,
}: {
  cal: Calendar
  year: number
  month: number
  byDay: Map<string, Occurrence[]>
  fmt: Formatters
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
        {fmt.monthName(month)} {year}
      </h4>
      <table className="mini">
        <thead>
          <tr>
            {WEEKDAY_ORDER.map((wd) => (
              <th key={wd}>{fmt.weekdayShort(wd).slice(0, 2)}</th>
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

function Legend({ t }: { t: TFunc }) {
  return (
    <div className="tag-legend" style={{ marginTop: 16 }}>
      <span className="swatch">
        <span className="box" style={{ background: 'color-mix(in srgb, var(--lective) 40%, transparent)' }} />{' '}
        {t('print.legendLective')}
      </span>
      <span className="swatch">
        <span className="box" style={{ background: 'color-mix(in srgb, var(--vacaciones) 45%, transparent)' }} />{' '}
        {t('print.legendVacaciones')}
      </span>
      <span className="swatch">
        <span className="box" style={{ background: 'color-mix(in srgb, var(--festivo) 40%, transparent)' }} />{' '}
        {t('print.legendFestivo')}
      </span>
      <span className="swatch">
        <span className="box" style={{ background: 'var(--accent)', borderRadius: '50%' }} /> {t('print.legendEvent')}
      </span>
    </div>
  )
}
