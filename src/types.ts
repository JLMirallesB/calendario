// Modelo de datos de la app. Todas las fechas se guardan como cadenas ISO `YYYY-MM-DD`.

export type ISODate = string // "2026-09-08"

/** Perfiles de visibilidad (docentes, alumnado, familias, administración…). */
export interface Profile {
  id: string
  name: string
  color: string
}

/** Tipos de trimestre soportados. El orden define la secuencia del curso. */
export type TermType =
  | 'Primer'
  | 'Segundo'
  | 'Tercer'
  | 'Anticipacion'
  | 'Ordinaria'
  | 'Extraordinaria'

/** Un valor de fecha que puede marcarse como provisional. */
export interface DateValue {
  date: ISODate | null
  provisional: boolean
}

/** Un rango de fechas que puede marcarse como provisional. */
export interface RangeValue {
  start: ISODate | null
  end: ISODate | null
  provisional: boolean
}

/** Hitos administrativos del modo guiado, comunes a los trimestres. */
export interface GuidedFields {
  pruebaEvaluacionTeorica: DateValue
  sesionEvaluacion: DateValue
  itacaNotasInicio: DateValue
  itacaNotasUltimaModif: DateValue
  webFamiliaVisibilidad: DateValue
  impresionActas: DateValue
  firmaActas: DateValue
  plazoReclamacion: RangeValue
  // Solo relevantes para el trimestre de Anticipación:
  anticipacionSolicitudInicio: DateValue
  anticipacionSolicitudFin: DateValue
  anticipacionListadoProvisional: DateValue
  anticipacionListadoDefinitivo: DateValue
}

export interface Term {
  id: string
  type: TermType
  /** Nombre visible, editable (p. ej. "Primer trimestre"). */
  name: string
  startDate: ISODate | null
  /** Opcional; si falta, el fin se deduce del inicio del siguiente trimestre. */
  endDate: ISODate | null
  guidedEnabled: boolean
  guided: GuidedFields
}

/** Categoría de un evento; determina cómo afecta (o no) al cómputo lectivo. */
export type EventKind =
  | 'vacaciones'
  | 'festivoAutonomico'
  | 'festivoLocal'
  | 'festivoALectivo' // festivo del calendario autonómico convertido en lectivo
  | 'claustro'
  | 'cocope'
  | 'consejoEscolar'
  | 'pruebaAcceso'
  | 'otro'

/** Un evento con fecha puntual (`date`) o de rango (`range`). */
export interface CalEvent {
  id: string
  title: string
  kind: EventKind
  date: ISODate | null
  range: { start: ISODate; end: ISODate } | null
  provisional: boolean
  /** IDs de perfiles a los que es visible. Vacío = visible para todos. */
  profiles: string[]
  notes: string
}

export interface Calendar {
  id: string
  name: string
  /** Texto libre, p. ej. "Comunitat Valenciana" o nombre del centro. */
  community: string
  courseStart: ISODate | null
  courseEnd: ISODate | null
  /** Días de la semana no lectivos: 0=domingo … 6=sábado. Por defecto [6, 0]. */
  restWeekdays: number[]
  profiles: Profile[]
  terms: Term[]
  events: CalEvent[]
  /** Versión del esquema de datos, para migraciones futuras. */
  schemaVersion: number
  updatedAt: string // ISO datetime
}

/** Entrada del índice de calendarios publicados (public/calendars/index.json). */
export interface PublishedIndexEntry {
  id: string
  name: string
  description: string
  file: string // ruta relativa dentro de public/calendars
}
