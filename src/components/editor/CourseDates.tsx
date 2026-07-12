import type { Calendar } from '../../types'
import { WEEKDAY_NAMES, WEEKDAY_ORDER } from '../../lib/dateUtils'

interface Props {
  cal: Calendar
  onChange: (patch: Partial<Calendar>) => void
}

export default function CourseDates({ cal, onChange }: Props) {
  const toggleRest = (wd: number) => {
    const set = new Set(cal.restWeekdays)
    set.has(wd) ? set.delete(wd) : set.add(wd)
    onChange({ restWeekdays: [...set].sort((a, b) => a - b) })
  }
  return (
    <div className="card">
      <div className="card-header">
        <h2>Datos del curso</h2>
      </div>
      <div className="field-row">
        <div className="field" style={{ flex: 2 }}>
          <label>Nombre del calendario</label>
          <input type="text" value={cal.name} onChange={(e) => onChange({ name: e.target.value })} />
        </div>
        <div className="field" style={{ flex: 2 }}>
          <label>Comunidad / centro (texto libre)</label>
          <input
            type="text"
            value={cal.community}
            placeholder="p. ej. Conservatorio de… / Comunitat Valenciana"
            onChange={(e) => onChange({ community: e.target.value })}
          />
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label>Inicio de curso</label>
          <input
            type="date"
            value={cal.courseStart ?? ''}
            onChange={(e) => onChange({ courseStart: e.target.value || null })}
          />
        </div>
        <div className="field">
          <label>Fin de curso</label>
          <input
            type="date"
            value={cal.courseEnd ?? ''}
            onChange={(e) => onChange({ courseEnd: e.target.value || null })}
          />
        </div>
      </div>
      <div className="field">
        <label>Días de descanso semanal (no lectivos)</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {WEEKDAY_ORDER.map((wd) => (
            <label key={wd} className="profile-pill" style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                style={{ width: 'auto' }}
                checked={cal.restWeekdays.includes(wd)}
                onChange={() => toggleRest(wd)}
              />
              {WEEKDAY_NAMES[wd]}
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
