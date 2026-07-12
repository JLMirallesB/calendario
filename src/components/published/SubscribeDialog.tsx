import { useState } from 'react'
import type { Calendar } from '../../types'
import { PUBLIC_BASE_URL } from '../../config'
import { downloadICS } from '../../lib/ics'

interface Props {
  publishedId: string
  cal: Calendar
  onImport: () => void
}

function feedUrl(publishedId: string, profileId: string | null): string {
  const file = `feeds/${publishedId}-${profileId ?? 'all'}.ics`
  const httpsUrl = PUBLIC_BASE_URL + file
  return httpsUrl.replace(/^https?:\/\//, 'webcal://')
}

export default function SubscribeDialog({ publishedId, cal, onImport }: Props) {
  const [profileId, setProfileId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const url = feedUrl(publishedId, profileId)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard no disponible */
    }
  }

  return (
    <div className="card" style={{ background: 'var(--surface-2)' }}>
      <div className="section-title">Suscribirse a este calendario</div>
      <p className="help">
        Elige el perfil y copia la URL en tu app de calendario (Google Calendar, Apple, Outlook…). Se
        actualizará automáticamente cuando el calendario cambie por Pull Request.
      </p>
      <div className="field-row" style={{ alignItems: 'flex-end' }}>
        <div className="field" style={{ flex: 1 }}>
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
      </div>
      <div className="field">
        <label>URL de suscripción (webcal)</label>
        <input type="text" readOnly value={url} onFocus={(e) => e.target.select()} />
      </div>
      <div className="btn-group">
        <a className="btn btn-primary" href={url}>
          Suscribirse
        </a>
        <button className="btn" onClick={copy}>
          {copied ? '✓ Copiada' : 'Copiar URL'}
        </button>
        <button className="btn" onClick={() => downloadICS(cal, profileId)}>
          Descargar .ics
        </button>
        <button className="btn" onClick={onImport} title="Cargar una copia editable en tu editor">
          Copiar a mi editor
        </button>
      </div>
    </div>
  )
}
