# Plan de diseño y estado del proyecto

Documento de continuidad. Resume por qué se construyó la app, las decisiones de diseño, el estado
actual y posibles próximos pasos. Complementa a `CLAUDE.md` (guía técnica) y `CHANGELOG.md` (novedades).

## Objetivo

App web 100% estática (GitHub Pages) para planificar el calendario escolar y académico de un
conservatorio de música o danza: definir curso, vacaciones y festivos (autonómicos/locales, con
conversión de festivo en lectivo), contar días lectivos, organizar trimestres con un «modo guiado»
de hitos administrativos (ITACA/WebFamília/actas), gestionar perfiles de visibilidad, exportar a PDF
(impresión) e ICS, y publicar calendarios a los que la gente pueda suscribirse (feeds ICS que se
regeneran al hacer merge de un PR).

## Decisiones de diseño

- **Stack**: React 18 + Vite + TypeScript. Estado en `localStorage` + import/export JSON. Sin backend.
- **Rutas**: `HashRouter` (evita 404 al refrescar en Pages).
- **PDF**: vista dedicada con Print CSS (`@media print`) → «Imprimir → Guardar como PDF». Sin librería.
- **ICS**: doble vía → descarga puntual desde la app **y** feeds auto-generados para suscripción
  (`webcal://`), regenerados en cada build/deploy.
- **Perfiles**: set por defecto editable por calendario (Docentes/Alumnado/Familias/Administración);
  cada fecha marca a qué perfiles es visible (lista vacía = todos).
- **Comunidad**: genérico, sin precargar festivos; se mantiene la terminología ITACA/WebFamília/actas
  porque son campos del modo guiado solicitados.
- **Contribución a publicados**: la app exporta JSON; el maintainer lo commitea y abre PR (sin OAuth
  en la app).
- **i18n**: interfaz en castellano (por defecto) y valencià/català; los datos de usuario no se traducen.
- **Estética**: panel de gestión limpio, modo claro/oscuro, acento configurable por variables CSS.

## Lógica clave (dónde mirar)

- Cómputo de días lectivos y estadísticas por trimestre: `src/lib/lectiveDays.ts`.
- Modo guiado (hitos por tipo de trimestre y avisos de pendientes): `src/lib/guided.ts`.
- Generación ICS y expansión de ocurrencias (isomórfico app + `scripts/build-feeds.mjs`):
  `src/lib/icsCore.js`.
- i18n: `src/i18n/` (`index.tsx`, `es.ts`, `ca.ts`).

Detalle de arquitectura, comandos y convenciones en `CLAUDE.md`.

## Estado actual — v0.2.0 (desplegada)

- v0.1.0: app completa (editor, contador, trimestres + modo guiado, perfiles, impresión lista/compacta,
  ICS, galería de publicados, changelog, footer, claro/oscuro).
- v0.2.0: **multiidioma** castellano + valencià/català con selector en la cabecera; fechas/meses/días
  localizados con `Intl`; nombres por defecto sembrados en el idioma activo; impresión y descarga ICS
  del cliente localizadas.
- Desplegada en https://jlmirallesb.github.io/calendario/ (GitHub Pages activo; deploy en push a `main`).

## Limitaciones conocidas

- Los **feeds ICS de suscripción publicados en el repo** se generan con etiquetas en castellano (los
  títulos que escribe el usuario se muestran tal cual). El ICS descargado desde la app sí respeta el
  idioma activo.
- `CHANGELOG.md` y `README.md` se mantienen en castellano.

## Próximos pasos posibles

- Añadir **inglés** (u otro idioma): crear `src/i18n/en.ts` cumpliendo `Dict`, registrarlo en
  `index.tsx` y añadir la opción en `LanguageSelect.tsx`.
- **Feeds ICS por idioma** en el repo (generar variantes localizadas en `build-feeds.mjs`).
- Más **calendarios de ejemplo** en `public/calendars/` (y su entrada en `index.json`).
- Posibles mejoras de editor: reordenar/añadir/quitar trimestres, duplicar eventos, validaciones de
  solapamientos.
- Un `CONTRIBUTING.md` con el flujo de publicar/actualizar calendarios por PR.
