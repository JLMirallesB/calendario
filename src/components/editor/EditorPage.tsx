import { Link } from 'react-router-dom'
import { useStore } from '../../state/CalendarStore'
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

  if (!current) {
    return <p>Cargando…</p>
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
            title="Vacaciones y festivos"
            help="Periodos vacacionales y festivos (autonómicos y locales). Usa «Festivo convertido en lectivo» para recuperar como lectivo un día del calendario autonómico."
            kinds={['vacaciones', 'festivoAutonomico', 'festivoLocal', 'festivoALectivo']}
            events={cal.events}
            profiles={cal.profiles}
            onChange={(events) => patchCurrent((c) => ({ ...c, events }))}
          />

          <TermsEditor cal={cal} onChange={(terms) => patchCurrent((c) => ({ ...c, terms }))} />

          <EventList
            title="Eventos institucionales"
            help="Claustros, COCOPE, consejos escolares y pruebas de acceso."
            kinds={['claustro', 'cocope', 'consejoEscolar', 'pruebaAcceso']}
            events={cal.events}
            profiles={cal.profiles}
            onChange={(events) => patchCurrent((c) => ({ ...c, events }))}
          />

          <EventList
            title="Otras fechas"
            help="Cualquier otra fecha puntual o de rango que quieras reflejar."
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
              🖨 Ver / imprimir (PDF · ICS)
            </Link>
          </div>
          <TermWeekdayStats cal={cal} />
        </aside>
      </div>
    </>
  )
}
