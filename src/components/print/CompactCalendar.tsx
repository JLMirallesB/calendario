import { useState } from 'react'
import { createPortal } from 'react-dom'
import type { Calendar } from '../../types'
import type { Occurrence } from '../../lib/icsCore'
import { isLectiveDay } from '../../lib/lectiveDays'
import { EVENT_KIND_COLOR } from '../../lib/labels'
import { occurrencesByDay, monthsInRange } from '../../lib/printData'
import { toISO, WEEKDAY_ORDER } from '../../lib/dateUtils'
import { occurrenceLabels, useI18n, type Formatters, type TFunc } from '../../i18n'

interface DayInfo {
  iso: string
  occ: Occurrence[]
  lective: boolean
  termName?: string
}

interface Props {
  cal: Calendar
  profileId: string | null
  /** Activa tooltip al pasar el cursor y clic para saltar a editar (solo en el editor). */
  interactive?: boolean
  onDayClick?: (iso: string) => void
}

export default function CompactCalendar({ cal, profileId, interactive = false, onDayClick }: Props) {
  const { t, fmt } = useI18n()
  const [hover, setHover] = useState<{ info: DayInfo; x: number; y: number } | null>(null)

  if (!cal.courseStart || !cal.courseEnd) {
    return <p className="empty">{t('print.needDatesCompact')}</p>
  }
  const byDay = occurrencesByDay(cal, profileId, occurrenceLabels(t))
  const months = monthsInRange(cal.courseStart, cal.courseEnd)
  const termStarts = new Map<string, string>()
  for (const term of cal.terms) if (term.startDate) termStarts.set(term.startDate, term.name)

  return (
    <>
      <div className="compact-grid">
        {months.map((mi) => (
          <MiniMonth
            key={`${mi.year}-${mi.month}`}
            cal={cal}
            year={mi.year}
            month={mi.month}
            byDay={byDay}
            termStarts={termStarts}
            fmt={fmt}
            interactive={interactive}
            onDayClick={onDayClick}
            onHover={(info, x, y) => setHover({ info, x, y })}
            onLeave={() => setHover(null)}
          />
        ))}
      </div>
      <Legend t={t} />
      {interactive && hover && <DayTooltip hover={hover} t={t} fmt={fmt} />}
    </>
  )
}

function kindColor(kind: string): string {
  return (EVENT_KIND_COLOR as Record<string, string>)[kind] ?? 'var(--accent)'
}

function DayTooltip({
  hover,
  t,
  fmt,
}: {
  hover: { info: DayInfo; x: number; y: number }
  t: TFunc
  fmt: Formatters
}) {
  const { info, x, y } = hover
  const W = typeof window !== 'undefined' ? window.innerWidth : 1200
  const H = typeof window !== 'undefined' ? window.innerHeight : 800
  const TIP_W = 240
  // Voltea a la izquierda del cursor si no cabe a la derecha; recorta a los bordes.
  const left = x + 16 + TIP_W > W ? Math.max(8, x - 16 - TIP_W) : x + 16
  const top = Math.min(y + 16, H - 140)
  const status = info.lective ? t('print.legendLective') : null

  const tip = (
    <div className="day-tip" style={{ left, top, maxWidth: TIP_W }}>
      <div className="day-tip-date">{fmt.long(info.iso)}</div>
      {info.termName && (
        <div className="day-tip-row">
          <span className="day-tip-dot" style={{ background: 'var(--provisional)' }} />
          {t('print.legendTermStart')}: <strong>{info.termName}</strong>
        </div>
      )}
      {info.occ.map((o, i) => (
        <div key={i} className="day-tip-row">
          <span className="day-tip-dot" style={{ background: kindColor(o.kind) }} />
          {o.title}
        </div>
      ))}
      {info.occ.length === 0 && !info.termName && status && <div className="day-tip-row">{status}</div>}
    </div>
  )
  return typeof document !== 'undefined' ? createPortal(tip, document.body) : tip
}

function MiniMonth({
  cal,
  year,
  month,
  byDay,
  termStarts,
  fmt,
  interactive,
  onDayClick,
  onHover,
  onLeave,
}: {
  cal: Calendar
  year: number
  month: number
  byDay: Map<string, Occurrence[]>
  termStarts: Map<string, string>
  fmt: Formatters
  interactive: boolean
  onDayClick?: (iso: string) => void
  onHover: (info: DayInfo, x: number, y: number) => void
  onLeave: () => void
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
                const hasRecovered = occ.some((o) => o.kind === 'festivoALectivo')
                const hasOther = occ.some(
                  (o) => !['vacaciones', 'festivoAutonomico', 'festivoLocal', 'festivoALectivo'].includes(o.kind),
                )
                // Prioridad: un día lectivo (incluye un festivo recuperado) NO se marca como
                // vacaciones/festivo. Los lectivos no llevan color; los no lectivos sueltos, atenuados.
                let cls = ''
                if (lective) cls = ''
                else if (hasFest) cls = 'fest'
                else if (hasVac) cls = 'vac'
                else cls = 'nonlective'
                if (hasRecovered) cls += ' recovered' // festivo recuperado como lectivo
                const termName = termStarts.get(iso)
                if (termName) cls += ' term-start'
                if (interactive) cls += ' clickable'
                const title = interactive ? undefined : [termName, ...occ.map((o) => o.title)].filter(Boolean).join(' · ')
                const info: DayInfo = { iso, occ, lective, termName }
                return (
                  <td
                    key={ci}
                    className={cls}
                    title={title || undefined}
                    onMouseEnter={interactive ? (e) => onHover(info, e.clientX, e.clientY) : undefined}
                    onMouseMove={interactive ? (e) => onHover(info, e.clientX, e.clientY) : undefined}
                    onMouseLeave={interactive ? onLeave : undefined}
                    onClick={interactive && onDayClick ? () => onDayClick(iso) : undefined}
                  >
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
    <>
      <div className="tag-legend" style={{ marginTop: 16 }}>
        <span className="swatch">
          <span className="box" style={{ background: 'color-mix(in srgb, var(--vacaciones) 45%, transparent)' }} />{' '}
          {t('print.legendVacaciones')}
        </span>
        <span className="swatch">
          <span className="box" style={{ background: 'color-mix(in srgb, var(--festivo) 40%, transparent)' }} />{' '}
          {t('print.legendFestivo')}
        </span>
        <span className="swatch">
          <span className="box term-start-swatch" /> {t('print.legendTermStart')}
        </span>
        <span className="swatch">
          <span className="box recovered-swatch" /> {t('print.legendRecovered')}
        </span>
        <span className="swatch">
          <span className="box" style={{ background: 'var(--accent)', borderRadius: '50%' }} /> {t('print.legendEvent')}
        </span>
        <span className="swatch">
          <span className="box" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }} />{' '}
          {t('print.legendNonLective')}
        </span>
      </div>
      <p className="inline-note" style={{ marginTop: 8 }}>{t('print.legendLectiveNote')}</p>
    </>
  )
}
