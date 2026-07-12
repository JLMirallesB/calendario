import { useState } from 'react'
import type { Calendar } from '../../types'
import { formatLong } from '../../lib/dateUtils'
import { totalLectiveDays } from '../../lib/lectiveDays'
import ListLayout from '../print/ListLayout'
import CompactCalendar from '../print/CompactCalendar'
import SubscribeDialog from './SubscribeDialog'

interface Props {
  publishedId: string
  cal: Calendar
  onImport: () => void
  onBack: () => void
}

export default function PublishedViewer({ publishedId, cal, onImport, onBack }: Props) {
  const [profileId, setProfileId] = useState<string | null>(null)
  const [mode, setMode] = useState<'lista' | 'compacto'>('compacto')

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h2>{cal.name}</h2>
          <button className="btn btn-sm" onClick={onBack}>
            ← Volver a la lista
          </button>
        </div>
        <p className="help">
          {cal.community && <>{cal.community} · </>}
          {cal.courseStart && cal.courseEnd && (
            <>
              Curso {formatLong(cal.courseStart)} – {formatLong(cal.courseEnd)} ·{' '}
            </>
          )}
          <strong>{totalLectiveDays(cal)}</strong> días lectivos · Solo lectura
        </p>
        <div className="print-controls">
          <div className="field" style={{ margin: 0 }}>
            <label>Perfil</label>
            <select value={profileId ?? ''} onChange={(e) => setProfileId(e.target.value || null)}>
              <option value="">Todos los perfiles</option>
              {cal.profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label>Formato</label>
            <div className="btn-group">
              <button className={`btn btn-sm ${mode === 'lista' ? 'btn-primary' : ''}`} onClick={() => setMode('lista')}>
                Lista
              </button>
              <button
                className={`btn btn-sm ${mode === 'compacto' ? 'btn-primary' : ''}`}
                onClick={() => setMode('compacto')}
              >
                Compacto
              </button>
            </div>
          </div>
        </div>
      </div>

      <SubscribeDialog publishedId={publishedId} cal={cal} onImport={onImport} />

      <div className="print-sheet">
        {mode === 'lista' ? (
          <ListLayout cal={cal} profileId={profileId} />
        ) : (
          <CompactCalendar cal={cal} profileId={profileId} />
        )}
      </div>
    </>
  )
}
