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

export function expandOccurrences(calendar: Calendar, profileId: string | null): Occurrence[]

export function buildICS(
  calendar: Calendar,
  profileId: string | null,
  opts?: { calName?: string; dtstamp?: string },
): string
