// Genera los feeds ICS de suscripción a partir de los calendarios publicados.
// Se ejecuta automáticamente antes del build (script "prebuild" en package.json).
//
// Para cada calendario listado en public/calendars/index.json crea, en public/feeds/:
//   <id>-all.ics            (todos los perfiles)
//   <id>-<perfilId>.ics     (uno por cada perfil del calendario)

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { buildICS } from '../src/lib/icsCore.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const calendarsDir = join(root, 'public', 'calendars')
const feedsDir = join(root, 'public', 'feeds')
const indexPath = join(calendarsDir, 'index.json')

function main() {
  if (!existsSync(indexPath)) {
    console.log('[build-feeds] No hay public/calendars/index.json; nada que generar.')
    return
  }

  mkdirSync(feedsDir, { recursive: true })

  // Limpia feeds previos (conserva .gitkeep) para no dejar ficheros huérfanos.
  for (const f of readdirSync(feedsDir)) {
    if (f.endsWith('.ics')) rmSync(join(feedsDir, f))
  }

  const index = JSON.parse(readFileSync(indexPath, 'utf-8'))
  if (!Array.isArray(index)) {
    console.warn('[build-feeds] index.json no es un array; se omite.')
    return
  }

  let count = 0
  for (const entry of index) {
    const file = join(calendarsDir, entry.file)
    if (!existsSync(file)) {
      console.warn(`[build-feeds] Falta el fichero ${entry.file}; se omite «${entry.name}».`)
      continue
    }
    const cal = JSON.parse(readFileSync(file, 'utf-8'))
    const calName = entry.name || cal.name

    // Feed con todos los perfiles.
    writeFileSync(join(feedsDir, `${entry.id}-all.ics`), buildICS(cal, null, { calName }))
    count++

    // Un feed por perfil.
    for (const profile of cal.profiles || []) {
      const ics = buildICS(cal, profile.id, { calName: `${calName} · ${profile.name}` })
      writeFileSync(join(feedsDir, `${entry.id}-${profile.id}.ics`), ics)
      count++
    }
  }

  console.log(`[build-feeds] Generados ${count} feeds ICS en public/feeds/.`)
}

main()
