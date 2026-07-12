import { useRef, useState } from 'react'
import type { Calendar } from '../../types'
import { parseCalendar, serializeCalendar } from '../../lib/json'
import { slug } from '../../lib/ics'
import { useI18n } from '../../i18n'

interface Props {
  cal: Calendar
  onImport: (cal: Calendar, replaceCurrent: boolean) => void
}

export default function JsonImportExport({ cal, onImport }: Props) {
  const { t } = useI18n()
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
      setMsg(t('jsonio.imported', { name: imported.name }))
    } catch {
      setMsg(t('jsonio.error'))
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>{t('jsonio.title')}</h2>
      </div>
      <p className="help">{t('jsonio.help')}</p>
      <div className="btn-group">
        <button className="btn btn-primary" onClick={exportJson}>
          {t('jsonio.exportBtn')}
        </button>
        <button className="btn" onClick={() => fileRef.current?.click()}>
          {t('jsonio.importBtn')}
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
          const replace = confirm(t('jsonio.importConfirm'))
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
