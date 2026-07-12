import { Link } from 'react-router-dom'
import { useStore } from '../../state/CalendarStore'
import { useI18n } from '../../i18n'
import CalendarBar from './CalendarBar'
import CourseDates from './CourseDates'
import ProfilesEditor from './ProfilesEditor'
import EventList from './EventList'
import TermsEditor from './TermsEditor'
import JsonImportExport from './JsonImportExport'
import LectiveCounter from '../counter/LectiveCounter'
import TermWeekdayStats from '../counter/TermWeekdayStats'

export default function EditorPage() {
  const { current, patchCurrent, importCalendar } = useStore()
  const { t } = useI18n()

  if (!current) {
    return <p>{t('common.loading')}</p>
  }
  const cal = current

  return (
    <>
      <CalendarBar />
      <div className="editor-grid">
        <div>
          <CourseDates cal={cal} onChange={(patch) => patchCurrent((c) => ({ ...c, ...patch }))} />

          <ProfilesEditor cal={cal} onChange={(profiles) => patchCurrent((c) => ({ ...c, profiles }))} />

          <EventList
            title={t('events.vacTitle')}
            help={t('events.vacHelp')}
            kinds={['vacaciones', 'festivoAutonomico', 'festivoLocal', 'festivoALectivo']}
            events={cal.events}
            profiles={cal.profiles}
            onChange={(events) => patchCurrent((c) => ({ ...c, events }))}
          />

          <TermsEditor cal={cal} onChange={(terms) => patchCurrent((c) => ({ ...c, terms }))} />

          <EventList
            title={t('events.instTitle')}
            help={t('events.instHelp')}
            kinds={['claustro', 'cocope', 'consejoEscolar', 'pruebaAcceso']}
            events={cal.events}
            profiles={cal.profiles}
            onChange={(events) => patchCurrent((c) => ({ ...c, events }))}
          />

          <EventList
            title={t('events.otherTitle')}
            help={t('events.otherHelp')}
            kinds={['otro']}
            events={cal.events}
            profiles={cal.profiles}
            onChange={(events) => patchCurrent((c) => ({ ...c, events }))}
          />

          <JsonImportExport
            cal={cal}
            onImport={(imported, replace) => importCalendar(imported, { replaceCurrent: replace })}
          />
        </div>

        <aside className="sidebar">
          <LectiveCounter cal={cal} />
          <div className="card" style={{ textAlign: 'center' }}>
            <Link className="btn btn-primary" to="/print" style={{ width: '100%', justifyContent: 'center' }}>
              {t('counter.printButton')}
            </Link>
          </div>
          <TermWeekdayStats cal={cal} />
        </aside>
      </div>
    </>
  )
}
