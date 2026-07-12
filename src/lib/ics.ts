import type { Calendar } from '../types'
import { buildICS } from './icsCore'

export { buildICS, expandOccurrences } from './icsCore'
export type { Occurrence, OccurrenceKind } from './icsCore'

/** Dispara la descarga de un fichero .ics para el calendario y perfil dados. */
export function downloadICS(cal: Calendar, profileId: string | null, filename?: string): void {
  const text = buildICS(cal, profileId, { calName: cal.name })
  const blob = new Blob([text], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || `${slug(cal.name)}${profileId ? '-' + profileId : '-todos'}.ics`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function slug(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
