import type { Calendar, GuidedFields, Term } from '../../types'
import TermGuidedPanel from './TermGuidedPanel'

interface Props {
  cal: Calendar
  onChange: (terms: Term[]) => void
}

export default function TermsEditor({ cal, onChange }: Props) {
  const update = (id: string, patch: Partial<Term>) =>
    onChange(cal.terms.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  const setGuided = (id: string, guided: GuidedFields) => update(id, { guided })

  return (
    <div className="card">
      <div className="card-header">
        <h2>Trimestres y periodos</h2>
      </div>
      <p className="help">
        Cada trimestre tiene una fecha exacta de inicio. Si no indicas fecha de fin, se deduce del
        inicio del siguiente. Activa el «modo guiado» para que te avise de los hitos pendientes.
      </p>
      {cal.terms.map((t) => (
        <div key={t.id} className="list-item" style={{ display: 'block' }}>
          <div className="field-row">
            <div className="field" style={{ flex: 2 }}>
              <label>Nombre del trimestre</label>
              <input type="text" value={t.name} onChange={(e) => update(t.id, { name: e.target.value })} />
            </div>
            <div className="field">
              <label>Inicio</label>
              <input
                type="date"
                value={t.startDate ?? ''}
                onChange={(e) => update(t.id, { startDate: e.target.value || null })}
              />
            </div>
            <div className="field">
              <label>Fin (opcional)</label>
              <input
                type="date"
                value={t.endDate ?? ''}
                onChange={(e) => update(t.id, { endDate: e.target.value || null })}
              />
            </div>
          </div>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={t.guidedEnabled}
              onChange={(e) => update(t.id, { guidedEnabled: e.target.checked })}
            />
            Modo guiado (avisar de hitos pendientes)
          </label>
          {t.guidedEnabled && <TermGuidedPanel term={t} onChange={(g) => setGuided(t.id, g)} />}
        </div>
      ))}
    </div>
  )
}
