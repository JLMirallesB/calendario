import type { Calendar, GuidedFields, GuidedValue, Term } from '../../types'
import { guidedItemsForType, missingGuidedItems } from '../../lib/guided'
import { reclamacionRange } from '../../lib/lectiveDays'
import { useI18n } from '../../i18n'

interface Props {
  cal: Calendar
  term: Term
  onChange: (guided: GuidedFields) => void
}

export default function TermGuidedPanel({ cal, term, onChange }: Props) {
  const { t } = useI18n()
  const items = guidedItemsForType(term.type)
  const missing = missingGuidedItems(term)
  const itemLabel = (key: keyof GuidedFields) => t(`guided.items.${key}`)

  const setField = (key: keyof GuidedFields, value: GuidedValue) => {
    const next: GuidedFields = { ...term.guided, [key]: value }
    // Al fijar la visibilidad de notas en WebFamília, calcular el plazo de reclamación:
    // 3 días hábiles desde el día siguiente a la comunicación.
    if (key === 'webFamiliaVisibilidad' && value.date) {
      const r = reclamacionRange(cal, value.date)
      next.plazoReclamacion = { date: null, range: { start: r.start, end: r.end }, provisional: value.provisional }
    }
    onChange(next)
  }

  return (
    <div style={{ marginTop: 12, borderTop: '1px dashed var(--border)', paddingTop: 12 }}>
      {missing.length > 0 && (
        <>
          <div className="section-title">{t('guided.pending', { n: missing.length })}</div>
          <ul className="warn-list">
            {missing.map((m) => (
              <li key={m.key}>{itemLabel(m.key)}</li>
            ))}
          </ul>
        </>
      )}
      <div className="section-title" style={{ marginTop: 12 }}>
        {t('guided.milestones')}
      </div>
      {items.map((it) => (
        <GuidedRow
          key={it.key}
          anchorId={`guided-${term.id}-${it.key}`}
          label={itemLabel(it.key)}
          value={term.guided[it.key]}
          note={it.key === 'plazoReclamacion' ? t('guided.reclamacionAuto') : undefined}
          onChange={(v) => setField(it.key, v)}
        />
      ))}
    </div>
  )
}

function GuidedRow({
  anchorId,
  label,
  value,
  note,
  onChange,
}: {
  anchorId: string
  label: string
  value: GuidedValue
  note?: string
  onChange: (v: GuidedValue) => void
}) {
  const { t } = useI18n()
  const isRange = value.range !== null

  const toDate = () =>
    onChange({ date: value.date ?? value.range?.start ?? null, range: null, provisional: value.provisional })
  const toRange = () => {
    const start = value.range?.start ?? value.date ?? null
    const end = value.range?.end ?? value.date ?? null
    onChange({ date: null, range: { start, end }, provisional: value.provisional })
  }

  return (
    <div id={anchorId} style={{ marginBottom: 10 }}>
      <div className="field-row" style={{ alignItems: 'flex-end' }}>
        <div className="field" style={{ flex: 'none' }}>
          <label>{label}</label>
          <div className="btn-group">
            <button type="button" className={`btn btn-sm ${!isRange ? 'btn-primary' : ''}`} onClick={toDate}>
              {t('events.punctual')}
            </button>
            <button type="button" className={`btn btn-sm ${isRange ? 'btn-primary' : ''}`} onClick={toRange}>
              {t('events.range')}
            </button>
          </div>
        </div>

        {!isRange ? (
          <div className="field">
            <label>{t('common.date')}</label>
            <input
              type="date"
              value={value.date ?? ''}
              onChange={(e) => onChange({ ...value, date: e.target.value || null })}
            />
          </div>
        ) : (
          <>
            <div className="field">
              <label>{t('common.from')}</label>
              <input
                type="date"
                value={value.range?.start ?? ''}
                onChange={(e) =>
                  onChange({ ...value, range: { start: e.target.value || null, end: value.range?.end ?? null } })
                }
              />
            </div>
            <div className="field">
              <label>{t('common.to')}</label>
              <input
                type="date"
                value={value.range?.end ?? ''}
                onChange={(e) =>
                  onChange({ ...value, range: { start: value.range?.start ?? null, end: e.target.value || null } })
                }
              />
            </div>
          </>
        )}

        <div className="field" style={{ flex: 'none', paddingBottom: 8 }}>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={value.provisional}
              onChange={(e) => onChange({ ...value, provisional: e.target.checked })}
            />
            {t('common.provisional')}
          </label>
        </div>
      </div>
      {note && <p className="inline-note" style={{ marginTop: 2 }}>{note}</p>}
    </div>
  )
}
