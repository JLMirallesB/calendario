import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useStore } from '../../state/CalendarStore'
import { downloadICS } from '../../lib/ics'
import { occurrenceLabels, useI18n } from '../../i18n'
import ListLayout from './ListLayout'
import CompactCalendar from './CompactCalendar'

type Mode = 'lista' | 'compacto'

export default function PrintView() {
  const { current } = useStore()
  const { t, fmt } = useI18n()
  const [profileId, setProfileId] = useState<string | null>(null) // null = todos
  const [mode, setMode] = useState<Mode>('lista')

  if (!current) return <Navigate to="/" replace />
  const cal = current
  const profileName = profileId ? cal.profiles.find((p) => p.id === profileId)?.name : t('common.allProfiles')

  return (
    <>
      <div className="card no-print">
        <div className="card-header">
          <h2>{t('print.title')}</h2>
          <Link to="/editor" className="btn btn-sm">
            {t('print.backToEditor')}
          </Link>
        </div>
        <div className="print-controls">
          <div className="field" style={{ margin: 0 }}>
            <label>{t('common.profile')}</label>
            <select value={profileId ?? ''} onChange={(e) => setProfileId(e.target.value || null)}>
              <option value="">{t('common.allProfiles')}</option>
              {cal.profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label>{t('common.format')}</label>
            <div className="btn-group">
              <button className={`btn btn-sm ${mode === 'lista' ? 'btn-primary' : ''}`} onClick={() => setMode('lista')}>
                {t('print.formatList')}
              </button>
              <button
                className={`btn btn-sm ${mode === 'compacto' ? 'btn-primary' : ''}`}
                onClick={() => setMode('compacto')}
              >
                {t('print.formatCompact')}
              </button>
            </div>
          </div>
          <div className="field" style={{ margin: 0, marginLeft: 'auto', alignSelf: 'flex-end' }}>
            <div className="btn-group">
              <button className="btn btn-primary" onClick={() => window.print()}>
                {t('print.printBtn')}
              </button>
              <button className="btn" onClick={() => downloadICS(cal, profileId, occurrenceLabels(t))}>
                {t('print.downloadIcs')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="print-sheet">
        <h1>{cal.name}</h1>
        <div className="subtitle">
          {cal.community && <>{cal.community} · </>}
          {profileName}
          {cal.courseStart && cal.courseEnd && (
            <>
              {' '}
              · {t('print.courseRange')} {fmt.long(cal.courseStart)} – {fmt.long(cal.courseEnd)}
            </>
          )}
        </div>
        {mode === 'lista' ? (
          <ListLayout cal={cal} profileId={profileId} />
        ) : (
          <CompactCalendar cal={cal} profileId={profileId} />
        )}
      </div>
    </>
  )
}
