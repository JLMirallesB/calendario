import type { GuidedFields, GuidedValue, Term, TermType } from '../types'

export interface GuidedItem {
  key: keyof GuidedFields
}

// Hitos comunes a todos los trimestres. Cada hito puede ser puntual o rango a elección del
// usuario; el modo lo determina su propio valor. La etiqueta visible se resuelve en la UI con
// i18n mediante la clave `guided.items.<key>`.
const COMMON_KEYS: (keyof GuidedFields)[] = [
  'pruebaEvaluacionTeorica',
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
