import type { DateValue, GuidedFields, RangeValue, Term } from '../../types'
import { guidedItemsForType, missingGuidedItems } from '../../lib/guided'
import { useI18n } from '../../i18n'

interface Props {
  term: Term
  onChange: (guided: GuidedFields) => void
}

export default function TermGuidedPanel({ term, onChange }: Props) {
  const { t } = useI18n()
  const items = guidedItemsForType(term.type)
  const missing = missingGuidedItems(term)

  const setField = (key: keyof GuidedFields, value: DateValue | RangeValue) => {
    onChange({ ...term.guided, [key]: value })
  }
  const itemLabel = (key: keyof GuidedFields) => t(`guided.items.${key}`)

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
      {items.map((it) => {
        const value = term.guided[it.key]
        if (it.kind === 'date') {
          const dv = value as DateValue
          return (
            <div key={it.key} className="field-row" style={{ alignItems: 'flex-end' }}>
              <div className="field" style={{ flex: 2 }}>
                <label>{itemLabel(it.key)}</label>
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
                  {t('common.provisional')}
                </label>
              </div>
            </div>
          )
        }
        const rv = value as RangeValue
        return (
          <div key={it.key} className="field-row" style={{ alignItems: 'flex-end' }}>
            <div className="field">
              <label>
                {itemLabel(it.key)} {t('guided.rangeFrom')}
              </label>
              <input
                type="date"
                value={rv.start ?? ''}
                onChange={(e) => setField(it.key, { ...rv, start: e.target.value || null })}
              />
            </div>
            <div className="field">
              <label>{t('guided.rangeTo')}</label>
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
                {t('common.provisional')}
              </label>
            </div>
          </div>
        )
      })}
    </div>
  )
}
