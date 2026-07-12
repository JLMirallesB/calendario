import type { Calendar, GuidedFields, Term } from '../../types'
import { useI18n } from '../../i18n'
import TermGuidedPanel from './TermGuidedPanel'

interface Props {
  cal: Calendar
  onChange: (terms: Term[]) => void
}

export default function TermsEditor({ cal, onChange }: Props) {
  const { t } = useI18n()
  const update = (id: string, patch: Partial<Term>) =>
    onChange(cal.terms.map((term) => (term.id === id ? { ...term, ...patch } : term)))
  const setGuided = (id: string, guided: GuidedFields) => update(id, { guided })

  return (
    <div className="card">
      <div className="card-header">
        <h2>{t('terms.title')}</h2>
      </div>
      <p className="help">{t('terms.help')}</p>
      {cal.terms.map((term) => (
        <div key={term.id} className="list-item" style={{ display: 'block' }}>
          <div className="field-row">
            <div className="field" style={{ flex: 2 }}>
              <label>{t('terms.nameLabel')}</label>
              <input type="text" value={term.name} onChange={(e) => update(term.id, { name: e.target.value })} />
            </div>
            <div className="field">
              <label>{t('terms.startLabel')}</label>
              <input
                type="date"
                value={term.startDate ?? ''}
                onChange={(e) => update(term.id, { startDate: e.target.value || null })}
              />
            </div>
            <div className="field">
              <label>{t('terms.endLabel')}</label>
              <input
                type="date"
                value={term.endDate ?? ''}
                onChange={(e) => update(term.id, { endDate: e.target.value || null })}
              />
            </div>
          </div>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={term.guidedEnabled}
              onChange={(e) => update(term.id, { guidedEnabled: e.target.checked })}
            />
            {t('terms.guidedToggle')}
          </label>
          {term.guidedEnabled && <TermGuidedPanel term={term} onChange={(g) => setGuided(term.id, g)} />}
        </div>
      ))}
    </div>
  )
}
