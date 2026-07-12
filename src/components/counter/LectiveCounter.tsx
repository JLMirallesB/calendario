import type { Calendar } from '../../types'
import { totalLectiveDays } from '../../lib/lectiveDays'

export default function LectiveCounter({ cal }: { cal: Calendar }) {
  const total = totalLectiveDays(cal)
  const ready = cal.courseStart && cal.courseEnd
  return (
    <div className="card">
      <div className="section-title">Contador</div>
      <div className="stat">
        <div className="value">{ready ? total : '—'}</div>
        <div className="label">días lectivos totales</div>
      </div>
      {!ready && <p className="inline-note" style={{ marginTop: 10 }}>Indica inicio y fin de curso para calcular.</p>}
    </div>
  )
}
