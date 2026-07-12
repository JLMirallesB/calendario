import type { Calendar, Profile } from '../../types'
import { makeId } from '../../lib/json'

interface Props {
  cal: Calendar
  onChange: (profiles: Profile[]) => void
}

const PALETTE = ['#2563eb', '#16a34a', '#d97706', '#9333ea', '#dc2626', '#0891b2', '#db2777', '#65a30d']

export default function ProfilesEditor({ cal, onChange }: Props) {
  const add = () => {
    const color = PALETTE[cal.profiles.length % PALETTE.length]
    onChange([...cal.profiles, { id: makeId('prof'), name: 'Nuevo perfil', color }])
  }
  const update = (id: string, patch: Partial<Profile>) =>
    onChange(cal.profiles.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  const remove = (id: string) => onChange(cal.profiles.filter((p) => p.id !== id))

  return (
    <div className="card">
      <div className="card-header">
        <h2>Perfiles</h2>
        <button className="btn btn-sm btn-primary" onClick={add}>
          + Añadir perfil
        </button>
      </div>
      <p className="help">
        Cada fecha puede marcarse visible para uno o varios perfiles. Si una fecha no marca ningún
        perfil, se considera visible para todos.
      </p>
      {cal.profiles.map((p) => (
        <div key={p.id} className="list-item" style={{ alignItems: 'center' }}>
          <input
            type="color"
            value={p.color}
            onChange={(e) => update(p.id, { color: e.target.value })}
            style={{ width: 40, height: 34, padding: 2, flex: 'none' }}
            title="Color del perfil"
          />
          <input
            type="text"
            className="grow"
            value={p.name}
            onChange={(e) => update(p.id, { name: e.target.value })}
          />
          <button
            className="btn btn-sm btn-danger"
            onClick={() => remove(p.id)}
            disabled={cal.profiles.length <= 1}
            title={cal.profiles.length <= 1 ? 'Debe quedar al menos un perfil' : 'Eliminar perfil'}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
