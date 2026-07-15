# CLAUDE.md — Guía del proyecto para Claude Code

App web **100% estática** (React 18 + Vite + TypeScript) para planificar el **calendario escolar y
académico** de un conservatorio de música o danza. Se despliega en **GitHub Pages**. Toda la
persistencia es del lado del cliente (`localStorage`) más import/export JSON; no hay backend.

## Comandos

```bash
npm install
npm run dev        # servidor de desarrollo (Vite)
npm run build      # prebuild (genera feeds ICS) + tsc (typecheck estricto) + vite build → dist/
npm run preview    # sirve el build de producción
npm run build:feeds  # regenera solo public/feeds/*.ics a partir de public/calendars/
```

El `build` hace typecheck estricto: si un diccionario i18n no cumple el tipo `Dict`, **falla**.

## Arquitectura

- `src/types.ts` — modelo de datos. Fechas como cadenas ISO `YYYY-MM-DD`.
  - `Calendar { id, name, community, courseStart, courseEnd, restWeekdays, profiles[], terms[], events[] }`
  - `Term` con `type ∈ {Primer,Segundo,Tercer,Anticipacion,Ordinaria,Extraordinaria}` y `guided: GuidedFields`.
  - `CalEvent` con `kind` (vacaciones, festivoAutonomico, festivoLocal, festivoALectivo, claustro,
    cocope, consejoEscolar, pruebaAcceso, otro), fecha puntual **o** rango, `provisional` y `profiles[]`.
- `src/lib/` — lógica pura reutilizable:
  - `dateUtils.ts` — helpers de fecha **locales** (no UTC): `parseISO`, `toISO`, `addDays`, `eachDay`,
    `weekday`, `weeksSpanned`, `mondayOf`, `WEEKDAY_ORDER`.
  - `lectiveDays.ts` — `totalLectiveDays`, `isLectiveDay`, `computeTermStats` (semanas + recuento de
    días lectivos por día de la semana por trimestre). Un `festivoALectivo` fuerza día lectivo.
  - `guided.ts` — hitos del modo guiado por tipo de trimestre; devuelve `GuidedItem { key, kind }` y
    la UI resuelve la etiqueta con `t('guided.items.<key>')`.
  - `icsCore.js` (+ `icsCore.d.ts`) — **JS plano isomórfico**: lo usan la app (vía tipos) y el script
    Node `scripts/build-feeds.mjs`. `expandOccurrences(cal, profileId, labels?)` normaliza el
    calendario a ocurrencias con fecha; `buildICS(...)` produce el VCALENDAR. `labels` es opcional
    (por defecto castellano) para localizar impresión y descarga ICS del cliente.
  - `ics.ts` — envoltorio de la app: `downloadICS`, `slug`, re-exports de `icsCore`.
  - `json.ts` — factorías (`newCalendar/defaultProfiles/defaultTerms`) con `lang` opcional para sembrar
    nombres por defecto, y `coerceCalendar` (import tolerante y validación de esquema).
  - `printData.ts` — `occurrencesByDay`, `monthsInRange` para la vista compacta.
  - `labels.ts` — solo colores por tipo (`EVENT_KIND_COLOR`); los textos van por i18n.
- `src/i18n/` — i18n propio sin dependencias:
  - `index.tsx` — `I18nProvider` + `useI18n()` → `{ lang, setLang, t, fmt }`. `t('a.b.c', {n})` con
    interpolación; `fmt.*` formatea fechas/meses/días con `Intl` (`es-ES`/`ca-ES`). `occurrenceLabels(t)`
    construye el objeto `labels` para `icsCore`. Idioma en `localStorage` (`calendari:lang`), por
    defecto `es`.
  - `es.ts` (fuente del tipo `Dict`) y `ca.ts` (valencià/català; **debe** cumplir `Dict`).
- `src/state/CalendarStore.tsx` — Context con la lista de calendarios y el actual; persiste en
  `localStorage` (`calendari:data:v1`). `patchCurrent(fn)` para mutar el calendario activo.
- `src/components/` — `layout/`, `editor/`, `counter/`, `print/` (+ `print.css`), `published/`,
  `changelog/`. Rutas con `HashRouter` (evita 404 en Pages): `#/`, `#/print`, `#/publicados`, `#/changelog`.
- `src/config.ts` — nombre/marca, versión (inyectada desde `package.json` por Vite), enlaces (repo,
  autor, ko-fi), `PUBLIC_BASE_URL` y `GITHUB_USER/REPO` (usados para las URLs de suscripción `webcal://`).

## Calendarios publicados y suscripciones

- Viven como JSON en `public/calendars/` y se listan en `public/calendars/index.json`.
- `scripts/build-feeds.mjs` (en `prebuild`) genera, por calendario y perfil (+ uno «todos»), un `.ics`
  en `public/feeds/` (ignorado por git salvo `.gitkeep`; se regenera en cada build). La URL de
  suscripción es `webcal://<user>.github.io/calendario/feeds/<id>-<perfil>.ics`.
- Publicar/modificar un calendario = editar esos JSON y abrir un PR; al hacer merge, el deploy
  regenera los feeds y los suscriptores reciben los cambios.

## Despliegue

- `.github/workflows/deploy.yml`: en `push` a `main` → `npm ci` → `npm run build` →
  `actions/configure-pages@v5` (con `enablement: true`) → `upload-pages-artifact` → `deploy-pages`.
- GitHub Pages ya está **activado** (Source: GitHub Actions). Si renombras el repo, actualiza `base`
  en `vite.config.ts` y `GITHUB_USER/GITHUB_REPO` en `src/config.ts`.
- URL en producción: https://jlmirallesb.github.io/calendario/

## Convenciones

- **Fechas**: siempre ISO `YYYY-MM-DD`; construir `Date` en horario local (ver `dateUtils`), nunca UTC.
- **i18n**: la **interfaz** se traduce vía `t()`/`fmt`. Los **datos de usuario** (nombres de calendario,
  perfiles, trimestres, títulos de eventos) NO se traducen; sus valores por defecto se siembran en el
  idioma activo al crear el calendario. Al añadir texto nuevo, mételo en `es.ts` **y** `ca.ts`.
- **Añadir un idioma**: crear `src/i18n/<lang>.ts` cumpliendo `Dict`, registrarlo en `index.tsx`
  (`DICTS`, `LOCALES`) y añadir la opción en `components/layout/LanguageSelect.tsx`.
- **Versión/changelog**: subir `version` en `package.json` y añadir entrada en `CHANGELOG.md` (se
  muestra en `#/changelog`, enlazado desde el tag de versión de la cabecera).

## Estado y contexto de diseño

Ver `docs/PLAN.md` para el plan de diseño completo, el estado actual y posibles próximos pasos.
