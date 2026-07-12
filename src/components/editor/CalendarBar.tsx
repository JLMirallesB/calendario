import { useStore } from '../../state/CalendarStore'
import { useI18n } from '../../i18n'

export default function CalendarBar() {
  const { calendars, currentId, selectCalendar, createCalendar, duplicateCalendar, deleteCalendar } = useStore()
  const { t } = useI18n()

  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      <label style={{ margin: 0 }}>{t('calendarBar.label')}</label>
      <select
        value={currentId ?? ''}
        onChange={(e) => selectCalendar(e.target.value)}
        style={{ maxWidth: 320 }}
      >
        {calendars.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <div className="btn-group" style={{ marginLeft: 'auto' }}>
        <button className="btn btn-sm" onClick={() => createCalendar()}>
          + {t('common.new')}
        </button>
        <button className="btn btn-sm" onClick={() => currentId && duplicateCalendar(currentId)}>
          ⧉ {t('common.duplicate')}
        </button>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => {
            if (currentId && confirm(t('calendarBar.confirmDelete'))) {
              deleteCalendar(currentId)
            }
          }}
        >
          🗑 {t('common.delete')}
        </button>
      </div>
    </div>
  )
}
