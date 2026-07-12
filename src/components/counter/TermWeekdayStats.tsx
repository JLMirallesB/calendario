import type { Calendar } from '../../types'
import { computeTermStats } from '../../lib/lectiveDays'
import { formatHuman } from '../../lib/dateUtils'

const SHORT = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

export default function TermWeekdayStats({ cal }: { cal: Calendar }) {
  const stats = computeTermStats(cal)
  return (
    <div className="card">
      <div className="section-title">Trimestres: semanas y días lectivos</div>
      {stats.length === 0 && (
        <p className="inline-note">Añade fecha de inicio a los trimestres para ver sus estadísticas.</p>
      )}
      {stats.map((s) => (
        <div key={s.termId} style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 650, fontSize: 14 }}>{s.termName}</div>
          <div className="inline-note" style={{ marginBottom: 6 }}>
            {formatHuman(s.start)} → {formatHuman(s.end)}
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
            <div>
              <span style={{ fontWeight: 700, fontSize: 18 }}>{s.weeks}</span>{' '}
              <span className="inline-note">semanas</span>
            </div>
            <div>
              <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--lective)' }}>{s.lectiveDays}</span>{' '}
              <span className="inline-note">días lectivos</span>
            </div>
          </div>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  {s.byWeekday.map((w, i) => (
                    <th key={w.weekday} className="num">
                      {SHORT[i]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {s.byWeekday.map((w) => (
                    <td key={w.weekday} className="num">
                      {w.count}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}
