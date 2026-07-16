// Núcleo de generación ICS y expansión de "ocurrencias" (fechas concretas del
// calendario). Escrito en JavaScript plano (ESM) para poder reutilizarse tanto en la
// app (vía icsCore.d.ts) como en scripts/build-feeds.mjs (Node), sin duplicar lógica.

// ---- Helpers de fecha (locales, sin desfase por zona horaria) ----

function parseISO(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}
function toISO(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
function addDays(iso, days) {
  const d = parseISO(iso)
  d.setDate(d.getDate() + days)
  return toISO(d)
}
/** Formato de fecha ICS all-day: YYYYMMDD. */
function icsDate(iso) {
  return iso.replace(/-/g, '')
}

// ---- Etiquetas de hitos del modo guiado (debe reflejar lib/guided.ts) ----

// Etiquetas por defecto (castellano). La app puede pasar `labels` traducidas.
const GUIDED_LABELS = {
  pruebaEvaluacionTeorica: 'Prueba de evaluación teórica',
  semanaRevisionCalificaciones: 'Semana de revisión de calificaciones',
  sesionEvaluacion: 'Sesión de evaluación',
  itacaNotasInicio: 'Inicio de notas en ITACA',
  itacaNotasFinDocentes: 'Fin de introducción de notas por docentes',
  itacaNotasFinRectificacion: 'Fin de rectificación de notas por Equipo Directivo',
  webFamiliaVisibilidad: 'Visibilidad de notas en WebFamília',
  impresionActas: 'Impresión de actas',
  firmaActas: 'Firma de actas',
  plazoReclamacion: 'Plazo de reclamación de notas',
  anticipacionSolicitudInicio: 'Inicio de solicitud de anticipación',
  anticipacionSolicitudFin: 'Fin de solicitud de anticipación',
  anticipacionListadoProvisional: 'Listado provisional de anticipación',
  anticipacionListadoDefinitivo: 'Listado definitivo de anticipación',
}

const KIND_TITLES = {
  vacaciones: 'Vacaciones',
  festivoAutonomico: 'Festivo autonómico',
  festivoLocal: 'Festivo local',
  festivoALectivo: 'Día lectivo (festivo recuperado)',
  claustro: 'Claustro',
  cocope: 'COCOPE',
  consejoEscolar: 'Consejo escolar',
  pruebaAcceso: 'Prueba de acceso',
  otro: 'Evento',
}

const DEFAULT_LABELS = { kind: KIND_TITLES, guided: GUIDED_LABELS, startPrefix: 'Inicio' }


/**
 * Expande un calendario a una lista de ocurrencias con fecha concreta, filtradas por
 * perfil (`profileId` null = todos los perfiles).
 * Cada ocurrencia: { startISO, endISO, title, provisional, kind, allDay }.
 * `endISO` es inclusivo (último día del evento).
 */
export function expandOccurrences(calendar, profileId, labels) {
  const L = labels || DEFAULT_LABELS
  const kindTitles = L.kind || KIND_TITLES
  const guidedLabels = L.guided || GUIDED_LABELS
  const startPrefix = L.startPrefix || 'Inicio'
  const out = []
  const visible = (profiles) => !profileId || !profiles || profiles.length === 0 || profiles.includes(profileId)

  // 1) Eventos (puntuales o de rango)
  for (const ev of calendar.events || []) {
    if (!visible(ev.profiles)) continue
    let startISO = null
    let endISO = null
    if (ev.date) {
      startISO = ev.date
      endISO = ev.date
    } else if (ev.range && ev.range.start && ev.range.end) {
      startISO = ev.range.start
      endISO = ev.range.end
    }
    if (!startISO) continue
    out.push({
      startISO,
      endISO,
      title: ev.title || kindTitles[ev.kind] || 'Evento',
      provisional: !!ev.provisional,
      kind: ev.kind,
      allDay: true,
    })
  }

  // 2) Inicios de trimestre e hitos del modo guiado (visibles para todos los perfiles)
  for (const term of calendar.terms || []) {
    if (term.startDate) {
      out.push({
        startISO: term.startDate,
        endISO: term.startDate,
        title: `${startPrefix}: ${term.name}`,
        provisional: false,
        kind: 'termStart',
        allDay: true,
      })
    }
    if (term.guidedEnabled && term.guided) {
      for (const key of Object.keys(GUIDED_LABELS)) {
        const value = term.guided[key]
        if (!value) continue
        const label = guidedLabels[key] || GUIDED_LABELS[key]
        if (value.range) {
          if (value.range.start && value.range.end) {
            out.push({
              startISO: value.range.start,
              endISO: value.range.end,
              title: `${label} · ${term.name}`,
              provisional: !!value.provisional,
              kind: 'guided',
              allDay: true,
            })
          }
        } else if (value.date) {
          out.push({
            startISO: value.date,
            endISO: value.date,
            title: `${label} · ${term.name}`,
            provisional: !!value.provisional,
            kind: 'guided',
            allDay: true,
          })
        }
      }
    }
  }

  out.sort((a, b) => (a.startISO < b.startISO ? -1 : a.startISO > b.startISO ? 1 : 0))
  return out
}

// ---- Escapado y plegado de líneas ICS (RFC 5545) ----

function escapeText(s) {
  return String(s)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

function foldLine(line) {
  // Máximo 75 octetos por línea; continuación con espacio inicial.
  if (line.length <= 75) return line
  const parts = []
  let rest = line
  parts.push(rest.slice(0, 75))
  rest = rest.slice(75)
  while (rest.length > 74) {
    parts.push(' ' + rest.slice(0, 74))
    rest = rest.slice(74)
  }
  if (rest.length) parts.push(' ' + rest)
  return parts.join('\r\n')
}

/**
 * Construye un documento ICS (VCALENDAR) para un calendario y perfil.
 * `profileId` null = todos los perfiles. `opts.calName` nombre visible del calendario.
 * `opts.dtstamp` marca temporal ICS (por defecto derivada de updatedAt).
 */
export function buildICS(calendar, profileId, opts = {}) {
  const occ = expandOccurrences(calendar, profileId, opts.labels)
  const calName = opts.calName || calendar.name || 'Calendario'
  const dtstamp = opts.dtstamp || toDtstamp(calendar.updatedAt)
  const lines = []
  lines.push('BEGIN:VCALENDAR')
  lines.push('VERSION:2.0')
  lines.push('PRODID:-//jlmirall.es//Calendari//ES')
  lines.push('CALSCALE:GREGORIAN')
  lines.push('METHOD:PUBLISH')
  lines.push('X-WR-CALNAME:' + escapeText(calName))
  lines.push('X-WR-TIMEZONE:Europe/Madrid')

  occ.forEach((o, i) => {
    const uid = `${calendar.id || 'cal'}-${profileId || 'all'}-${i}@calendari`
    const summary = (o.provisional ? '(Provisional) ' : '') + o.title
    lines.push('BEGIN:VEVENT')
    lines.push('UID:' + uid)
    lines.push('DTSTAMP:' + dtstamp)
    lines.push('DTSTART;VALUE=DATE:' + icsDate(o.startISO))
    // DTEND en all-day es exclusivo: día siguiente al último día del evento.
    lines.push('DTEND;VALUE=DATE:' + icsDate(addDays(o.endISO, 1)))
    lines.push(foldLine('SUMMARY:' + escapeText(summary)))
    if (o.provisional) lines.push('STATUS:TENTATIVE')
    lines.push('TRANSP:TRANSPARENT')
    lines.push('END:VEVENT')
  })

  lines.push('END:VCALENDAR')
  return lines.join('\r\n') + '\r\n'
}

function toDtstamp(updatedAt) {
  // Convierte un ISO datetime a formato ICS UTC básico. Si falta, usa una fija estable.
  if (updatedAt && /^\d{4}-\d{2}-\d{2}T/.test(updatedAt)) {
    return updatedAt.replace(/[-:]/g, '').replace(/\.\d+/, '').replace(/Z?$/, 'Z').slice(0, 16)
  }
  return '20000101T000000Z'
}
