import type { Profile } from '../../types'

interface Props {
  profiles: Profile[]
  selected: string[]
  onChange: (ids: string[]) => void
  compact?: boolean
}

/**
 * Selector de perfiles a los que es visible una fecha. Lista vacía = visible para todos.
 */
export default function ProfileSelector({ profiles, selected, onChange, compact }: Props) {
  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id])
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
      {!compact && (
        <span className="inline-note" style={{ marginRight: 2 }}>
          Visible para:
        </span>
      )}
      {profiles.map((p) => {
        const on = selected.includes(p.id)
        return (
          <span
            key={p.id}
            role="button"
            tabIndex={0}
            className={`profile-pill ${on ? 'selected' : ''}`}
            style={{ color: on ? p.color : 'var(--text-muted)' }}
            onClick={() => toggle(p.id)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggle(p.id)}
            title={on ? `Visible para ${p.name}` : `Marcar visible para ${p.name}`}
          >
            <span className="dot" style={{ background: p.color }} />
            {p.name}
          </span>
        )
      })}
      {selected.length === 0 && <span className="inline-note">(todos los perfiles)</span>}
    </div>
  )
}
