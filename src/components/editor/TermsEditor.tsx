import type { Calendar, GuidedFields, Term, TermType } from '../../types'
import { useI18n } from '../../i18n'
import { addDays } from '../../lib/dateUtils'
import { computeTermStats, equalTrimesterStarts } from '../../lib/lectiveDays'
import TermGuidedPanel from './TermGuidedPanel'
import Section from './Section'

interface Props {
  cal: Calendar
  onChange: (terms: Term[]) => void
}

export default function TermsEditor({ cal, onChange }: Props) {
  const { t } = useI18n()
  const update = (id: string, patch: Partial<Term>) =>
    onChange(cal.terms.map((term) => (term.id === id ? { ...term, ...patch } : term)))
  const setGuided = (id: string, guided: GuidedFields) => update(id, { guided })

  const hasCourse = Boolean(cal.courseStart && cal.courseEnd)

  // Recuento lectivo/semanas por trimestre, recalculado en cada render (reacciona en directo).
  const statsById = new Map(computeTermStats(cal).map((s) => [s.termId, s]))

  const splitEqual = () => {
    if (!cal.courseStart || !cal.courseEnd) return
    const s = equalTrimesterStarts(cal.courseStart, cal.courseEnd)
    const starts: Partial<Record<TermType, string>> = { Primer: s.primer, Segundo: s.segundo, Tercer: s.tercer }
    onChange(
      cal.terms.map((term) =>
        starts[term.type] ? { ...term, startDate: starts[term.type] as string, endDate: null } : term,
      ),
    )
  }

  const nudgeWeeks = (term: Term, weeks: number) => {
    if (!term.startDate) return
    update(term.id, { startDate: addDays(term.startDate, weeks * 7) })
  }

  return (
    <Section
      title={t('terms.title')}
      sectionId="terms"
      headerExtra={
        <button className="btn btn-sm" onClick={splitEqual} disabled={!hasCourse} title={t('terms.splitTitle')}>
          {t('terms.splitEqual')}
        </button>
      }
    >
      <p className="help">{t('terms.help')}</p>
      {!hasCourse && <p className="inline-note">{t('terms.splitNeedDates')}</p>}
      {cal.terms.map((term) => {
        const st = statsById.get(term.id)
        return (
          <div key={term.id} id={`term-${term.id}`} className="list-item" style={{ display: 'block' }}>
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

            {term.startDate && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 2 }}>
                <div className="btn-group">
                  <button className="btn btn-sm" onClick={() => nudgeWeeks(term, -1)} title={t('terms.weekEarlier')}>
                    − {t('terms.week')}
                  </button>
                  <button className="btn btn-sm" onClick={() => nudgeWeeks(term, 1)} title={t('terms.weekLater')}>
                    + {t('terms.week')}
                  </button>
                </div>
                {st && (
                  <span className="inline-note">
                    <strong style={{ color: 'var(--lective)', fontSize: 15 }}>{st.lectiveDays}</strong>{' '}
                    {t('counter.lectiveDays')} · {st.weeks} {t('counter.weeks')}
                  </span>
                )}
              </div>
            )}

            <label className="checkbox" style={{ marginTop: 8 }}>
              <input
                type="checkbox"
                checked={term.guidedEnabled}
                onChange={(e) => update(term.id, { guidedEnabled: e.target.checked })}
              />
              {t('terms.guidedToggle')}
            </label>
            {term.guidedEnabled && (
              <TermGuidedPanel cal={cal} term={term} onChange={(g) => setGuided(term.id, g)} />
            )}
          </div>
        )
      })}
    </Section>
  )
}
