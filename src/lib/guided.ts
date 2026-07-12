import type { DateValue, GuidedFields, RangeValue, Term, TermType } from '../types'

export interface GuidedItem {
  key: keyof GuidedFields
  kind: 'date' | 'range'
}

// Hitos comunes a todos los trimestres. La etiqueta visible se resuelve en la UI con
// i18n mediante la clave `guided.items.<key>`.
const COMMON_ITEMS: GuidedItem[] = [
  { key: 'pruebaEvaluacionTeorica', kind: 'date' },
  { key: 'sesionEvaluacion', kind: 'date' },
  { key: 'itacaNotasInicio', kind: 'date' },
  { key: 'itacaNotasUltimaModif', kind: 'date' },
  { key: 'webFamiliaVisibilidad', kind: 'date' },
  { key: 'impresionActas', kind: 'date' },
  { key: 'firmaActas', kind: 'date' },
  { key: 'plazoReclamacion', kind: 'range' },
]

// Hitos adicionales exclusivos del trimestre de Anticipación.
const ANTICIPACION_ITEMS: GuidedItem[] = [
  { key: 'anticipacionSolicitudInicio', kind: 'date' },
  { key: 'anticipacionSolicitudFin', kind: 'date' },
  { key: 'anticipacionListadoProvisional', kind: 'date' },
  { key: 'anticipacionListadoDefinitivo', kind: 'date' },
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
