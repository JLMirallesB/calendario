import type { Calendar, ISODate } from '../types'
import { expandOccurrences, type Occurrence } from './icsCore'
import { eachDay, parseISO, toISO } from './dateUtils'

export interface DayOccurrences {
  iso: ISODate
  occurrences: Occurrence[]
}

/** Mapa fecha ISO → ocurrencias que caen ese día (expandiendo rangos), para el perfil dado. */
export function occurrencesByDay(cal: Calendar, profileId: string | null): Map<ISODate, Occurrence[]> {
  const map = new Map<ISODate, Occurrence[]>()
  for (const occ of expandOccurrences(cal, profileId)) {
    for (const iso of eachDay(occ.startISO, occ.endISO)) {
      const arr = map.get(iso) ?? []
      arr.push(occ)
      map.set(iso, arr)
    }
  }
  return map
}

export interface MonthInfo {
  year: number
  month: number // 0-11
  first: ISODate
}

/** Lista de meses (año, mes) cubiertos por el rango [start, end]. */
export function monthsInRange(start: ISODate, end: ISODate): MonthInfo[] {
  const out: MonthInfo[] = []
  const s = parseISO(start)
  const e = parseISO(end)
  let y = s.getFullYear()
  let m = s.getMonth()
  const endKey = e.getFullYear() * 12 + e.getMonth()
  // Límite de seguridad de 60 meses.
  for (let i = 0; i < 60 && y * 12 + m <= endKey; i++) {
    out.push({ year: y, month: m, first: toISO(new Date(y, m, 1)) })
    m++
    if (m > 11) {
      m = 0
      y++
    }
  }
  return out
}
