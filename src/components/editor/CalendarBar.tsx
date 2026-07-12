import { useStore } from '../../state/CalendarStore'

export default function CalendarBar() {
  const { calendars, currentId, selectCalendar, createCalendar, duplicateCalendar, deleteCalendar } = useStore()

  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      <label style={{ margin: 0 }}>Calendario</label>
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
          + Nuevo
        </button>
        <button className="btn btn-sm" onClick={() => currentId && duplicateCalendar(currentId)}>
          ⧉ Duplicar
        </button>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => {
            if (currentId && confirm('¿Eliminar este calendario? Esta acción no se puede deshacer.')) {
              deleteCalendar(currentId)
            }
          }}
        >
          🗑 Eliminar
        </button>
      </div>
    </div>
  )
}
