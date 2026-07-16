import type { GuidedFields, GuidedValue, Term, TermType } from '../types'
import { addDays } from './dateUtils'

export interface GuidedItem {
  key: keyof GuidedFields
}

// Hitos comunes a todos los trimestres. Cada hito puede ser puntual o rango a elección del
// usuario; el modo lo determina su propio valor. La etiqueta visible se resuelve en la UI con
// i18n mediante la clave `guided.items.<key>`.
const COMMON_KEYS: (keyof GuidedFields)[] = [
  'pruebaEvaluacionTeorica',
  'semanaRevisionCalificaciones',
  'sesionEvaluacion',
  'itacaNotasInicio',
  'itacaNotasFinDocentes',
  'itacaNotasFinRectificacion',
  'webFamiliaVisibilidad',
  'impresionActas',
  'firmaActas',
  'plazoReclamacion',
]

// Hitos adicionales exclusivos del trimestre de Anticipación.
const ANTICIPACION_KEYS: (keyof GuidedFields)[] = [
  'anticipacionSolicitudInicio',
  'anticipacionSolicitudFin',
  'anticipacionListadoProvisional',
  'anticipacionListadoDefinitivo',
]

const COMMON_ITEMS: GuidedItem[] = COMMON_KEYS.map((key) => ({ key }))
const ANTICIPACION_ITEMS: GuidedItem[] = ANTICIPACION_KEYS.map((key) => ({ key }))

/** Devuelve los hitos que aplican a un tipo de trimestre. */
export function guidedItemsForType(type: TermType): GuidedItem[] {
  if (type === 'Anticipacion') return [...ANTICIPACION_ITEMS, ...COMMON_ITEMS]
  return COMMON_ITEMS
}

/** ¿Está relleno el hito? En modo rango exige inicio y fin; en puntual, la fecha. */
export function isGuidedFilled(v: GuidedValue): boolean {
  if (!v) return false
  return v.range ? !!(v.range.start && v.range.end) : !!v.date
}

/** Hitos pendientes (sin rellenar) de un trimestre, según su tipo. */
export function missingGuidedItems(term: Term): GuidedItem[] {
  return guidedItemsForType(term.type).filter((it) => !isGuidedFilled(term.guided[it.key]))
}

/** ¿Tiene el trimestre algún hito con fecha (puntual o rango) introducida? */
export function guidedHasDates(g: GuidedFields): boolean {
  return Object.values(g).some((v) => v.date || v.range?.start || v.range?.end)
}

/** Desplaza todas las fechas de los hitos `days` días (para mover el trimestre completo). */
export function shiftGuidedDates(g: GuidedFields, days: number): GuidedFields {
  const shift = (iso: string | null) => (iso ? addDays(iso, days) : iso)
  const out = {} as GuidedFields
  for (const [key, value] of Object.entries(g)) {
    const v = value as GuidedValue
    out[key as keyof GuidedFields] = {
      date: shift(v.date),
      range: v.range ? { start: shift(v.range.start), end: shift(v.range.end) } : null,
      provisional: v.provisional,
    }
  }
  return out
}

/** Fechas ocupadas por los hitos (puntual, o inicio y fin de rango), con su clave. */
export function guidedDates(g: GuidedFields): { key: keyof GuidedFields; iso: string }[] {
  const out: { key: keyof GuidedFields; iso: string }[] = []
  for (const [key, value] of Object.entries(g)) {
    const v = value as GuidedValue
    if (v.range) {
      if (v.range.start) out.push({ key: key as keyof GuidedFields, iso: v.range.start })
      if (v.range.end) out.push({ key: key as keyof GuidedFields, iso: v.range.end })
    } else if (v.date) {
      out.push({ key: key as keyof GuidedFields, iso: v.date })
    }
  }
  return out
}
