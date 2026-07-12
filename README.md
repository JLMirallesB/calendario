# 📅 Calendari — Planificador de curso

App web **100% estática** (React + Vite + TypeScript) para planificar el **calendario
escolar y académico** de un conservatorio de música o danza. Pensada para desplegarse
en **GitHub Pages**.

## Funciones

- Definir inicio y fin de curso, periodos vacacionales y festivos autonómicos/locales.
- Convertir festivos del calendario autonómico en días lectivos.
- Contador de **días lectivos** totales.
- Fechas puntuales o de rango, marcables como **provisionales**.
- **Trimestres** configurables (Primer, Segundo, Tercer, Anticipación, Ordinaria/Final,
  Extraordinaria) con fecha de inicio, duración en semanas y recuento de días lectivos
  por día de la semana.
- **Modo guiado** por trimestre que avisa de hitos pendientes (pruebas teóricas, sesiones
  de evaluación, ITACA, WebFamília, actas, reclamaciones, anticipación de notas…).
- Eventos institucionales: claustros, COCOPE, consejos escolares, pruebas de acceso.
- **Perfiles** (docentes, alumnado, familias, administración…) con visibilidad por fecha.
- **Impresión a PDF** (lista o calendario compacto) filtrada por perfil.
- Exportación **ICS** (descarga) y **feeds de suscripción** auto-actualizados.
- **Galería de calendarios publicados** de solo lectura, con suscripción por perfil.

## Desarrollo

```bash
npm install
npm run dev        # servidor local de desarrollo
npm run build      # genera feeds ICS + build de producción en dist/
npm run preview    # sirve el build de producción
```

Los datos del usuario se guardan en `localStorage` del navegador. Se pueden exportar e
importar como **JSON**.

## Calendarios publicados y suscripciones

Los calendarios publicados viven como ficheros JSON en `public/calendars/` y se listan en
`public/calendars/index.json`. Para publicar o modificar uno:

1. Desde la app, exporta el calendario como JSON (botón *Exportar JSON*).
2. Añade/actualiza el fichero en `public/calendars/` y su entrada en `index.json`.
3. Abre un **Pull Request**. Al hacer *merge* a `main`, el workflow de despliegue
   regenera automáticamente los **feeds ICS** (`public/feeds/*.ics`), por lo que quienes
   estén suscritos reciben los cambios sin hacer nada.

Cada calendario genera un feed por **perfil** más uno con **todos** los perfiles. La URL
de suscripción tiene la forma:

```
webcal://<usuario>.github.io/calendario/feeds/<idCalendario>-<perfil>.ics
```

## Despliegue en GitHub Pages

1. En *Settings → Pages*, selecciona **Source: GitHub Actions**.
2. Cada `push` a `main` construye y publica la app (workflow `.github/workflows/deploy.yml`).
3. Si renombras el repositorio, actualiza `base` en `vite.config.ts`.

## Créditos

App diseñada por **José Luis Miralles** ([jlmirall.es](https://jlmirall.es)) con ayuda de
Claude. Contacto: joseluismirallesbono@gmail.com ·
[Invitar a una orxata ☕](https://ko-fi.com/miralles)
