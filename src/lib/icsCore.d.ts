import type { Calendar, EventKind, ISODate } from '../types'

export type OccurrenceKind = EventKind | 'termStart' | 'guided'

export interface Occurrence {
  startISO: ISODate
  endISO: ISODate
  title: string
  provisional: boolean
  kind: OccurrenceKind
  allDay: boolean
}

/** Etiquetas localizadas opcionales; si se omiten se usan las de castellano. */
export interface OccurrenceLabels {
  kind: Record<string, string>
  guided: Record<string, string>
  startPrefix: string
}

export function expandOccurrences(
  calendar: Calendar,
  profileId: string | null,
  labels?: OccurrenceLabels,
): Occurrence[]

export function buildICS(
  calendar: Calendar,
  profileId: string | null,
  opts?: { calName?: string; dtstamp?: string; labels?: OccurrenceLabels },
): string
