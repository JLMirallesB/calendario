import type { EventKind } from '../types'

export const EVENT_KIND_LABELS: Record<EventKind, string> = {
  vacaciones: 'Periodo vacacional',
  festivoAutonomico: 'Festivo autonómico',
  festivoLocal: 'Festivo local',
  festivoALectivo: 'Festivo convertido en lectivo',
  claustro: 'Claustro',
  cocope: 'COCOPE',
  consejoEscolar: 'Consejo escolar',
  pruebaAcceso: 'Prueba de acceso',
  otro: 'Otro',
}

/** Color asociado a cada tipo de evento (para leyendas y calendario compacto). */
export const EVENT_KIND_COLOR: Record<EventKind, string> = {
  vacaciones: 'var(--vacaciones)',
  festivoAutonomico: 'var(--festivo)',
  festivoLocal: 'var(--festivo)',
  festivoALectivo: 'var(--lective)',
  claustro: 'var(--accent)',
  cocope: 'var(--accent)',
  consejoEscolar: 'var(--accent)',
  pruebaAcceso: 'var(--accent)',
  otro: 'var(--text-muted)',
}
