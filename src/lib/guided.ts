import type { DateValue, GuidedFields, RangeValue, Term, TermType } from '../types'

export interface GuidedItem {
  key: keyof GuidedFields
  label: string
  kind: 'date' | 'range'
}

// Hitos comunes a todos los trimestres.
const COMMON_ITEMS: GuidedItem[] = [
  { key: 'pruebaEvaluacionTeorica', label: 'Prueba de evaluación teórica', kind: 'date' },
  { key: 'sesionEvaluacion', label: 'Sesión de evaluación', kind: 'date' },
  { key: 'itacaNotasInicio', label: 'Inicio de introducción de notas en ITACA', kind: 'date' },
  { key: 'itacaNotasUltimaModif', label: 'Última modificación de notas en ITACA', kind: 'date' },
  { key: 'webFamiliaVisibilidad', label: 'Visibilidad de notas en WebFamília', kind: 'date' },
  { key: 'impresionActas', label: 'Impresión de actas', kind: 'date' },
  { key: 'firmaActas', label: 'Firma de actas', kind: 'date' },
  { key: 'plazoReclamacion', label: 'Plazo de reclamación de notas', kind: 'range' },
]

// Hitos adicionales exclusivos del trimestre de Anticipación.
const ANTICIPACION_ITEMS: GuidedItem[] = [
  { key: 'anticipacionSolicitudInicio', label: 'Inicio de solicitud de anticipación', kind: 'date' },
  { key: 'anticipacionSolicitudFin', label: 'Fin de solicitud de anticipación', kind: 'date' },
  { key: 'anticipacionListadoProvisional', label: 'Listado provisional de anticipación', kind: 'date' },
  { key: 'anticipacionListadoDefinitivo', label: 'Listado definitivo de anticipación', kind: 'date' },
]

/** Devuelve los hitos que aplican a un tipo de trimestre. */
export function guidedItemsForType(type: TermType): GuidedItem[] {
  if (type === 'Anticipacion') return [...ANTICIPACION_ITEMS, ...COMMON_ITEMS]
  return COMMON_ITEMS
}

function isDateFilled(v: DateValue): boolean {
  return !!v && !!v.date
}
function isRangeFilled(v: RangeValue): boolean {
  return !!v && !!v.start && !!v.end
}

/** Hitos pendientes (sin rellenar) de un trimestre, según su tipo. */
export function missingGuidedItems(term: Term): GuidedItem[] {
  const items = guidedItemsForType(term.type)
  return items.filter((it) => {
    const value = term.guided[it.key]
    return it.kind === 'date'
      ? !isDateFilled(value as DateValue)
      : !isRangeFilled(value as RangeValue)
  })
}
