import type {
  Calendar,
  CalEvent,
  DateValue,
  GuidedFields,
  Profile,
  RangeValue,
  Term,
  TermType,
} from '../types'
import { isValidISO } from './dateUtils'
import { es } from '../i18n/es'
import { ca } from '../i18n/ca'

export const SCHEMA_VERSION = 1

type Lang = 'es' | 'ca'
const DICTS = { es, ca }
function dnames(lang: Lang) {
  return (DICTS[lang] ?? es).defaults
}

const TERM_LABEL_KEY: Record<TermType, keyof typeof es.defaults> = {
  Primer: 'termPrimer',
  Segundo: 'termSegundo',
  Tercer: 'termTercer',
  Anticipacion: 'termAnticipacion',
  Ordinaria: 'termOrdinaria',
  Extraordinaria: 'termExtraordinaria',
}

export function makeId(prefix = 'id'): string {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return `${prefix}_${crypto.randomUUID().slice(0, 8)}`
    }
  } catch {
    /* noop */
  }
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

function emptyDate(): DateValue {
  return { date: null, provisional: false }
}
function emptyRange(): RangeValue {
  return { start: null, end: null, provisional: false }
}

export function emptyGuided(): GuidedFields {
  return {
    pruebaEvaluacionTeorica: emptyDate(),
    sesionEvaluacion: emptyDate(),
    itacaNotasInicio: emptyDate(),
    itacaNotasUltimaModif: emptyDate(),
    webFamiliaVisibilidad: emptyDate(),
    impresionActas: emptyDate(),
    firmaActas: emptyDate(),
    plazoReclamacion: emptyRange(),
    anticipacionSolicitudInicio: emptyDate(),
    anticipacionSolicitudFin: emptyDate(),
    anticipacionListadoProvisional: emptyDate(),
    anticipacionListadoDefinitivo: emptyDate(),
  }
}

/** Etiqueta por defecto de un tipo de trimestre en el idioma dado. */
export function defaultTermLabel(type: TermType, lang: Lang = 'es'): string {
  return dnames(lang)[TERM_LABEL_KEY[type]]
}

const TERM_ORDER: TermType[] = ['Primer', 'Segundo', 'Tercer', 'Anticipacion', 'Ordinaria', 'Extraordinaria']

export function newTerm(type: TermType, lang: Lang = 'es'): Term {
  return {
    id: makeId('term'),
    type,
    name: defaultTermLabel(type, lang),
    startDate: null,
    endDate: null,
    guidedEnabled: false,
    guided: emptyGuided(),
  }
}

export function defaultTerms(lang: Lang = 'es'): Term[] {
  return TERM_ORDER.map((type) => newTerm(type, lang))
}

export function defaultProfiles(lang: Lang = 'es'): Profile[] {
  const d = dnames(lang)
  return [
    { id: 'docentes', name: d.profileDocentes, color: '#2563eb' },
    { id: 'alumnado', name: d.profileAlumnado, color: '#16a34a' },
    { id: 'familias', name: d.profileFamilias, color: '#d97706' },
    { id: 'admin', name: d.profileAdmin, color: '#9333ea' },
  ]
}

export function newCalendar(name?: string, lang: Lang = 'es'): Calendar {
  return {
    id: makeId('cal'),
    name: name || dnames(lang).newCalendar,
    community: '',
    courseStart: null,
    courseEnd: null,
    restWeekdays: [6, 0], // sábado y domingo
    profiles: defaultProfiles(lang),
    terms: defaultTerms(lang),
    events: [],
    schemaVersion: SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
  }
}

export function newEvent(): CalEvent {
  return {
    id: makeId('ev'),
    title: '',
    kind: 'otro',
    date: null,
    range: null,
    provisional: false,
    profiles: [],
    notes: '',
  }
}

// ---- Validación / normalización tolerante al importar JSON ----

function asStr(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback
}
function asISOorNull(v: unknown): string | null {
  return isValidISO(v) ? (v as string) : null
}
function asBool(v: unknown): boolean {
  return v === true
}
function asStrArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []
}

function coerceDate(v: unknown): DateValue {
  const o = (v ?? {}) as Record<string, unknown>
  return { date: asISOorNull(o.date), provisional: asBool(o.provisional) }
}
function coerceRange(v: unknown): RangeValue {
  const o = (v ?? {}) as Record<string, unknown>
  return { start: asISOorNull(o.start), end: asISOorNull(o.end), provisional: asBool(o.provisional) }
}

function coerceGuided(v: unknown): GuidedFields {
  const o = (v ?? {}) as Record<string, unknown>
  const base = emptyGuided()
  return {
    ...base,
    pruebaEvaluacionTeorica: coerceDate(o.pruebaEvaluacionTeorica),
    sesionEvaluacion: coerceDate(o.sesionEvaluacion),
    itacaNotasInicio: coerceDate(o.itacaNotasInicio),
    itacaNotasUltimaModif: coerceDate(o.itacaNotasUltimaModif),
    webFamiliaVisibilidad: coerceDate(o.webFamiliaVisibilidad),
    impresionActas: coerceDate(o.impresionActas),
    firmaActas: coerceDate(o.firmaActas),
    plazoReclamacion: coerceRange(o.plazoReclamacion),
    anticipacionSolicitudInicio: coerceDate(o.anticipacionSolicitudInicio),
    anticipacionSolicitudFin: coerceDate(o.anticipacionSolicitudFin),
    anticipacionListadoProvisional: coerceDate(o.anticipacionListadoProvisional),
    anticipacionListadoDefinitivo: coerceDate(o.anticipacionListadoDefinitivo),
  }
}

const TERM_TYPES: TermType[] = ['Primer', 'Segundo', 'Tercer', 'Anticipacion', 'Ordinaria', 'Extraordinaria']

function coerceTerm(v: unknown): Term {
  const o = (v ?? {}) as Record<string, unknown>
  const type = TERM_TYPES.includes(o.type as TermType) ? (o.type as TermType) : 'Primer'
  return {
    id: asStr(o.id, makeId('term')),
    type,
    name: asStr(o.name, defaultTermLabel(type, 'es')),
    startDate: asISOorNull(o.startDate),
    endDate: asISOorNull(o.endDate),
    guidedEnabled: asBool(o.guidedEnabled),
    guided: coerceGuided(o.guided),
  }
}

const EVENT_KINDS = new Set([
  'vacaciones',
  'festivoAutonomico',
  'festivoLocal',
  'festivoALectivo',
  'claustro',
  'cocope',
  'consejoEscolar',
  'pruebaAcceso',
  'otro',
])

function coerceEvent(v: unknown): CalEvent {
  const o = (v ?? {}) as Record<string, unknown>
  const kind = EVENT_KINDS.has(o.kind as string) ? (o.kind as CalEvent['kind']) : 'otro'
  const rangeRaw = o.range as Record<string, unknown> | null | undefined
  const range =
    rangeRaw && isValidISO(rangeRaw.start) && isValidISO(rangeRaw.end)
      ? { start: rangeRaw.start as string, end: rangeRaw.end as string }
      : null
  return {
    id: asStr(o.id, makeId('ev')),
    title: asStr(o.title),
    kind,
    date: asISOorNull(o.date),
    range: range,
    provisional: asBool(o.provisional),
    profiles: asStrArray(o.profiles),
    notes: asStr(o.notes),
  }
}

function coerceProfile(v: unknown, i: number): Profile {
  const o = (v ?? {}) as Record<string, unknown>
  return {
    id: asStr(o.id, makeId('prof')),
    name: asStr(o.name, `Perfil ${i + 1}`),
    color: asStr(o.color, '#64748b'),
  }
}

/** Normaliza cualquier objeto a un Calendar válido (import tolerante). */
export function coerceCalendar(v: unknown): Calendar {
  const o = (v ?? {}) as Record<string, unknown>
  const restWeekdays = Array.isArray(o.restWeekdays)
    ? o.restWeekdays.filter((n): n is number => typeof n === 'number' && n >= 0 && n <= 6)
    : [6, 0]
  const profiles = Array.isArray(o.profiles) && o.profiles.length
    ? o.profiles.map(coerceProfile)
    : defaultProfiles()
  const terms = Array.isArray(o.terms) && o.terms.length ? o.terms.map(coerceTerm) : defaultTerms()
  const events = Array.isArray(o.events) ? o.events.map(coerceEvent) : []
  return {
    id: asStr(o.id, makeId('cal')),
    name: asStr(o.name, 'Calendario importado'),
    community: asStr(o.community),
    courseStart: asISOorNull(o.courseStart),
    courseEnd: asISOorNull(o.courseEnd),
    restWeekdays,
    profiles,
    terms,
    events,
    schemaVersion: SCHEMA_VERSION,
    updatedAt: asStr(o.updatedAt) || new Date().toISOString(),
  }
}

export function serializeCalendar(cal: Calendar): string {
  return JSON.stringify(cal, null, 2)
}

export function parseCalendar(text: string): Calendar {
  return coerceCalendar(JSON.parse(text))
}
