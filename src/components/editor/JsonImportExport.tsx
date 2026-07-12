import { useRef, useState } from 'react'
import type { Calendar } from '../../types'
import { parseCalendar, serializeCalendar } from '../../lib/json'
import { slug } from '../../lib/ics'

interface Props {
  cal: Calendar
  onImport: (cal: Calendar, replaceCurrent: boolean) => void
}

export default function JsonImportExport({ cal, onImport }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState<string | null>(null)

  const exportJson = () => {
    const blob = new Blob([serializeCalendar(cal)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${slug(cal.name) || 'calendario'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const onFile = async (file: File, replace: boolean) => {
    try {
      const text = await file.text()
      const imported = parseCalendar(text)
      onImport(imported, replace)
      setMsg(`Importado «${imported.name}».`)
    } catch {
      setMsg('No se pudo leer el JSON. Comprueba el formato.')
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Importar / Exportar (JSON)</h2>
      </div>
      <p className="help">
        Exporta el calendario para hacer copia de seguridad o para publicarlo por Pull Request. Al
        importar puedes reemplazar el calendario actual o añadirlo como uno nuevo.
      </p>
      <div className="btn-group">
        <button className="btn btn-primary" onClick={exportJson}>
          ⬇ Exportar JSON
        </button>
        <button className="btn" onClick={() => fileRef.current?.click()}>
          ⬆ Importar JSON…
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (!f) return
          const replace = confirm(
            'Aceptar = reemplazar el calendario actual con el importado.\nCancelar = añadirlo como calendario nuevo.',
          )
          onFile(f, replace)
          e.target.value = ''
        }}
      />
      {msg && (
        <p className="inline-note" style={{ marginTop: 10 }}>
          {msg}
        </p>
      )}
    </div>
  )
}
