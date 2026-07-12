import { useState } from 'react'
import type { CalEvent, EventKind, Profile } from '../../types'
import { EVENT_KIND_LABELS } from '../../lib/labels'
import { newEvent } from '../../lib/json'
import { formatHuman } from '../../lib/dateUtils'
import ProfileSelector from './ProfileSelector'

interface Props {
  title: string
  help?: string
  kinds: EventKind[]
  events: CalEvent[]
  profiles: Profile[]
  onChange: (events: CalEvent[]) => void
}

/**
 * Editor reutilizable para una familia de eventos (vacaciones/festivos, institucionales,
 * otros…). Cada evento admite fecha puntual o rango, marca de provisional y perfiles.
 */
export default function EventList({ title, help, kinds, events, profiles, onChange }: Props) {
  const mine = events.filter((e) => kinds.includes(e.kind))
  const others = events.filter((e) => !kinds.includes(e.kind))

  const commit = (updated: CalEvent[]) => onChange([...others, ...updated])

  const add = () => {
    const ev = newEvent()
    ev.kind = kinds[0]
    commit([...mine, ev])
  }
  const update = (id: string, patch: Partial<CalEvent>) => {
    commit(mine.map((e) => (e.id === id ? { ...e, ...patch } : e)))
  }
  const remove = (id: string) => commit(mine.filter((e) => e.id !== id))

  return (
    <div className="card">
      <div className="card-header">
        <h3>{title}</h3>
        <button className="btn btn-sm btn-primary" onClick={add}>
          + Añadir
        </button>
      </div>
      {help && <p className="help">{help}</p>}
      {mine.length === 0 && <p className="empty">Aún no hay fechas. Pulsa «Añadir».</p>}
      {mine.map((ev) => (
        <EventRow
          key={ev.id}
          ev={ev}
          kinds={kinds}
          profiles={profiles}
          onUpdate={(patch) => update(ev.id, patch)}
          onRemove={() => remove(ev.id)}
        />
      ))}
    </div>
  )
}

function EventRow({
  ev,
  kinds,
  profiles,
  onUpdate,
  onRemove,
}: {
  ev: CalEvent
  kinds: EventKind[]
  profiles: Profile[]
  onUpdate: (patch: Partial<CalEvent>) => void
  onRemove: () => void
}) {
  const isRange = !!ev.range
  const [mode, setMode] = useState<'date' | 'range'>(isRange ? 'range' : 'date')

  const setModeDate = () => {
    setMode('date')
    onUpdate({ range: null, date: ev.date ?? ev.range?.start ?? null })
  }
  const setModeRange = () => {
    setMode('range')
    const start = ev.range?.start ?? ev.date ?? ''
    const end = ev.range?.end ?? ev.date ?? ''
    onUpdate({ date: null, range: start && end ? { start, end } : { start: start || end, end: end || start } })
  }

  return (
    <div className="list-item">
      <div className="grow" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="field-row">
          <div className="field" style={{ flex: 2 }}>
            <label>Descripción</label>
            <input
              type="text"
              value={ev.title}
              placeholder={EVENT_KIND_LABELS[ev.kind]}
              onChange={(e) => onUpdate({ title: e.target.value })}
            />
          </div>
          {kinds.length > 1 && (
            <div className="field">
              <label>Tipo</label>
              <select value={ev.kind} onChange={(e) => onUpdate({ kind: e.target.value as EventKind })}>
                {kinds.map((k) => (
                  <option key={k} value={k}>
                    {EVENT_KIND_LABELS[k]}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="field-row" style={{ alignItems: 'flex-end' }}>
          <div className="field" style={{ flex: 'none' }}>
            <label>Formato</label>
            <div className="btn-group">
              <button
                className={`btn btn-sm ${mode === 'date' ? 'btn-primary' : ''}`}
                onClick={setModeDate}
                type="button"
              >
                Puntual
              </button>
              <button
                className={`btn btn-sm ${mode === 'range' ? 'btn-primary' : ''}`}
                onClick={setModeRange}
                type="button"
              >
                Rango
              </button>
            </div>
          </div>
          {mode === 'date' ? (
            <div className="field">
              <label>Fecha</label>
              <input type="date" value={ev.date ?? ''} onChange={(e) => onUpdate({ date: e.target.value || null })} />
            </div>
          ) : (
            <>
              <div className="field">
                <label>Desde</label>
                <input
                  type="date"
                  value={ev.range?.start ?? ''}
                  onChange={(e) =>
                    onUpdate({ range: { start: e.target.value, end: ev.range?.end || e.target.value } })
                  }
                />
              </div>
              <div className="field">
                <label>Hasta</label>
                <input
                  type="date"
                  value={ev.range?.end ?? ''}
                  onChange={(e) =>
                    onUpdate({ range: { start: ev.range?.start || e.target.value, end: e.target.value } })
                  }
                />
              </div>
            </>
          )}
        </div>

        <ProfileSelector
          profiles={profiles}
          selected={ev.profiles}
          onChange={(profilesSel) => onUpdate({ profiles: profilesSel })}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={ev.provisional}
              onChange={(e) => onUpdate({ provisional: e.target.checked })}
            />
            Provisional
          </label>
          {ev.provisional && <span className="badge badge-provisional">Provisional</span>}
          {ev.date && <span className="inline-note">{formatHuman(ev.date)}</span>}
        </div>
      </div>
      <button className="btn btn-sm btn-danger" onClick={onRemove} title="Eliminar">
        ✕
      </button>
    </div>
  )
}
