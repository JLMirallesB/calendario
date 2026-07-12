import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Calendar, PublishedIndexEntry } from '../../types'
import { coerceCalendar } from '../../lib/json'
import { useStore } from '../../state/CalendarStore'
import PublishedViewer from './PublishedViewer'

const BASE = import.meta.env.BASE_URL

export default function PublishedGallery() {
  const { importCalendar } = useStore()
  const navigate = useNavigate()
  const [entries, setEntries] = useState<PublishedIndexEntry[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<{ id: string; cal: Calendar } | null>(null)
  const [loadingCal, setLoadingCal] = useState(false)

  useEffect(() => {
    let active = true
    fetch(`${BASE}calendars/index.json`)
      .then((r) => {
        if (!r.ok) throw new Error('no index')
        return r.json()
      })
      .then((data: PublishedIndexEntry[]) => {
        if (active) setEntries(Array.isArray(data) ? data : [])
      })
      .catch(() => active && setEntries([]))
    return () => {
      active = false
    }
  }, [])

  const open = async (entry: PublishedIndexEntry) => {
    setLoadingCal(true)
    setError(null)
    try {
      const r = await fetch(`${BASE}calendars/${entry.file}`)
      if (!r.ok) throw new Error('no file')
      const cal = coerceCalendar(await r.json())
      setSelected({ id: entry.id, cal })
    } catch {
      setError(`No se pudo cargar «${entry.name}».`)
    } finally {
      setLoadingCal(false)
    }
  }

  const importToEditor = () => {
    if (!selected) return
    // Copia editable: nuevo id para no colisionar con futuras sincronizaciones.
    importCalendar(coerceCalendar({ ...selected.cal, id: undefined, name: `${selected.cal.name} (copia)` }))
    navigate('/')
  }

  if (selected) {
    return (
      <PublishedViewer
        publishedId={selected.id}
        cal={selected.cal}
        onImport={importToEditor}
        onBack={() => setSelected(null)}
      />
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Calendarios publicados</h2>
      </div>
      <p className="help">
        Calendarios incluidos en el repositorio, de solo lectura. Ábrelos para consultarlos,
        suscribirte (por perfil) o copiarlos a tu editor. Se actualizan cuando se aprueba un Pull
        Request en el repositorio.
      </p>
      {error && <p className="inline-note" style={{ color: 'var(--festivo)' }}>{error}</p>}
      {loadingCal && <p className="empty">Cargando calendario…</p>}
      {entries === null && <p className="empty">Cargando…</p>}
      {entries && entries.length === 0 && (
        <p className="empty">Todavía no hay calendarios publicados en el repositorio.</p>
      )}
      {entries &&
        entries.map((e) => (
          <div key={e.id} className="list-item" style={{ alignItems: 'center' }}>
            <div className="grow">
              <div style={{ fontWeight: 650 }}>{e.name}</div>
              {e.description && <div className="inline-note">{e.description}</div>}
            </div>
            <button className="btn btn-sm btn-primary" onClick={() => open(e)}>
              Abrir
            </button>
          </div>
        ))}
    </div>
  )
}
