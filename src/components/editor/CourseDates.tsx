import type { Calendar } from '../../types'
import { WEEKDAY_ORDER } from '../../lib/dateUtils'
import { useI18n } from '../../i18n'

interface Props {
  cal: Calendar
  onChange: (patch: Partial<Calendar>) => void
}

export default function CourseDates({ cal, onChange }: Props) {
  const { t, fmt } = useI18n()
  const toggleRest = (wd: number) => {
    const set = new Set(cal.restWeekdays)
    set.has(wd) ? set.delete(wd) : set.add(wd)
    onChange({ restWeekdays: [...set].sort((a, b) => a - b) })
  }
  return (
    <div className="card">
      <div className="card-header">
        <h2>{t('course.title')}</h2>
      </div>
      <div className="field-row">
        <div className="field" style={{ flex: 2 }}>
          <label>{t('course.nameLabel')}</label>
          <input type="text" value={cal.name} onChange={(e) => onChange({ name: e.target.value })} />
        </div>
        <div className="field" style={{ flex: 2 }}>
          <label>{t('course.communityLabel')}</label>
          <input
            type="text"
            value={cal.community}
            placeholder={t('course.communityPlaceholder')}
            onChange={(e) => onChange({ community: e.target.value })}
          />
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label>{t('course.startLabel')}</label>
          <input
            type="date"
            value={cal.courseStart ?? ''}
            onChange={(e) => onChange({ courseStart: e.target.value || null })}
          />
        </div>
        <div className="field">
          <label>{t('course.endLabel')}</label>
          <input
            type="date"
            value={cal.courseEnd ?? ''}
            onChange={(e) => onChange({ courseEnd: e.target.value || null })}
          />
        </div>
      </div>
      <div className="field">
        <label>{t('course.restDaysLabel')}</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {WEEKDAY_ORDER.map((wd) => (
            <label key={wd} className="profile-pill" style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                style={{ width: 'auto' }}
                checked={cal.restWeekdays.includes(wd)}
                onChange={() => toggleRest(wd)}
              />
              {fmt.weekdayLong(wd)}
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
