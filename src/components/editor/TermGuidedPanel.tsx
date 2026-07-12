import type { DateValue, GuidedFields, RangeValue, Term } from '../../types'
import { guidedItemsForType, missingGuidedItems } from '../../lib/guided'

interface Props {
  term: Term
  onChange: (guided: GuidedFields) => void
}

export default function TermGuidedPanel({ term, onChange }: Props) {
  const items = guidedItemsForType(term.type)
  const missing = missingGuidedItems(term)

  const setField = (key: keyof GuidedFields, value: DateValue | RangeValue) => {
    onChange({ ...term.guided, [key]: value })
  }

  return (
    <div style={{ marginTop: 12, borderTop: '1px dashed var(--border)', paddingTop: 12 }}>
      {missing.length > 0 && (
        <>
          <div className="section-title">Pendiente de introducir ({missing.length})</div>
          <ul className="warn-list">
            {missing.map((m) => (
              <li key={m.key}>{m.label}</li>
            ))}
          </ul>
        </>
      )}
      <div className="section-title" style={{ marginTop: 12 }}>
        Hitos del trimestre
      </div>
      {items.map((it) => {
        const value = term.guided[it.key]
        if (it.kind === 'date') {
          const dv = value as DateValue
          return (
            <div key={it.key} className="field-row" style={{ alignItems: 'flex-end' }}>
              <div className="field" style={{ flex: 2 }}>
                <label>{it.label}</label>
                <input
                  type="date"
                  value={dv.date ?? ''}
                  onChange={(e) => setField(it.key, { ...dv, date: e.target.value || null })}
                />
              </div>
              <div className="field" style={{ flex: 'none', paddingBottom: 8 }}>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={dv.provisional}
                    onChange={(e) => setField(it.key, { ...dv, provisional: e.target.checked })}
                  />
                  Provisional
                </label>
              </div>
            </div>
          )
        }
        const rv = value as RangeValue
        return (
          <div key={it.key} className="field-row" style={{ alignItems: 'flex-end' }}>
            <div className="field">
              <label>{it.label} — desde</label>
              <input
                type="date"
                value={rv.start ?? ''}
                onChange={(e) => setField(it.key, { ...rv, start: e.target.value || null })}
              />
            </div>
            <div className="field">
              <label>hasta</label>
              <input
                type="date"
                value={rv.end ?? ''}
                onChange={(e) => setField(it.key, { ...rv, end: e.target.value || null })}
              />
            </div>
            <div className="field" style={{ flex: 'none', paddingBottom: 8 }}>
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={rv.provisional}
                  onChange={(e) => setField(it.key, { ...rv, provisional: e.target.checked })}
                />
                Provisional
              </label>
            </div>
          </div>
        )
      })}
    </div>
  )
}
