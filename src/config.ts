// Configuración global de la app. Editar aquí para personalizar textos/enlaces.

export const APP_NAME = 'Calendari'
export const APP_TAGLINE = 'Planificador de curso'
export const APP_EMOJI = '📅'

export const APP_VERSION: string =
  typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.0.0'

// Repositorio en GitHub (usuario/repo). Se usa para enlaces y URLs de suscripción.
export const GITHUB_USER = 'jlmirallesb'
export const GITHUB_REPO = 'calendario'
export const REPO_URL = `https://github.com/${GITHUB_USER}/${GITHUB_REPO}`

// Base pública donde se sirven los feeds ICS (coincide con `base` de vite.config.ts).
// En producción: https://<user>.github.io/<repo>/
export const PUBLIC_BASE_URL = `https://${GITHUB_USER}.github.io/${GITHUB_REPO}/`

export const AUTHOR = {
  name: 'José Luis Miralles',
  site: 'https://jlmirall.es',
  email: 'joseluismirallesbono@gmail.com',
  kofi: 'https://ko-fi.com/miralles',
}

export const STORAGE_KEY = 'calendari:data:v1'
export const THEME_KEY = 'calendari:theme'
