# Changelog

Todas las novedades relevantes de la app se documentan en este archivo.
El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/) y el
proyecto usa [versionado semántico](https://semver.org/lang/es/).

## [0.5.0] — 2026-07-15

### Añadido

- **Reparto en 3 trimestres iguales**: botón en «Trimestres y periodos» que propone el inicio
  de los tres trimestres dividiendo el curso por igual y **alineando al lunes más cercano**. Es
  una propuesta editable.
- **Ajuste por semanas**: cada trimestre con fecha de inicio muestra botones «− semana / +
  semana» para mover su inicio, y el **recuento de días lectivos y semanas se actualiza en
  directo** por trimestre mientras ajustas.
- En el **calendario compacto**, el **inicio de cada trimestre** se resalta con un anillo de
  color y su entrada en la leyenda.
- **Vista previa del calendario compacto en vivo** en el editor: en pantallas anchas aparece
  una columna a la izquierda que se actualiza mientras editas (curso, festivos, trimestres…).
  - Al **pasar el cursor** por un día se muestra un **tooltip** con qué es (festivo, vacaciones,
    inicio de trimestre, hito…).
  - Al **hacer clic** en un día, el editor **salta a la fila donde se edita esa fecha** (abre la
    sección si estaba plegada y la resalta).
- **Secciones del editor plegables**: cada bloque (datos del curso, perfiles, eventos,
  trimestres…) se puede contraer para reducir el desplazamiento.
- **Modo guiado — cada hito puede ser puntual o rango**, a elección (botón Puntual/Rango).
- **Modo guiado — plazo de reclamación automático**: al fijar la *visibilidad de notas en
  WebFamília*, se calcula el plazo de reclamación como **3 días hábiles** desde el día
  siguiente (excluye sábados, domingos y festivos). Queda editable.

### Cambiado

- **Modo guiado — «modificación de notas» se desglosa en dos**: *fin de introducción por
  docentes* y *fin de rectificación por Equipo Directivo* (el antiguo campo se migra al
  primero automáticamente).
- Los **perfiles por defecto** de un calendario nuevo pasan a ser **Docentes, Alumnado y
  Gestión** (antes: Docentes, Alumnado, Familias y Administración).

## [0.4.0] — 2026-07-15

### Añadido

- **Empezar con el calendario oficial de la Comunitat Valenciana**: nueva opción en la
  bienvenida que, eligiendo **curso, enseñanza y municipio**, crea un calendario con las
  fechas de inicio/fin de curso, vacaciones y festivos (autonómicos y locales) tomados del
  dataset de legislación educativa de la CV. Los datos se obtienen por HTTP desde el sitio de
  legislación (sin backend).
- Los eventos generados desde esa fuente guardan su **procedencia** (`source` en el calendario
  y `srcKey` en cada evento).
- **Re-sincronización de festivos**: en el editor, los calendarios creados desde la CV muestran
  un panel «Calendario oficial (CV)» con un botón para **comprobar festivos nuevos o cambios**.
  Presenta un diff (altas, modificaciones y bajas) que se **valida manualmente** con casillas;
  los eventos añadidos a mano nunca se tocan. Pensado para incorporar los festivos locales que
  se publican más tarde en el curso.

## [0.3.0] — 2026-07-15

### Añadido

- **Página de bienvenida** como pantalla de inicio (`#/`): permite elegir entre **crear
  un calendario nuevo**, **importar uno desde un archivo JSON** o **ver los calendarios
  publicados**. Si ya hay calendarios guardados en el navegador, se listan para continuar
  con un clic.

### Cambiado

- El **editor** pasa a la ruta `#/editor`; la cabecera incluye un enlace **«Inicio»**.
- La app ya **no crea un calendario de ejemplo automáticamente**: al abrirla por primera
  vez (o tras borrar el último calendario) se muestra la página de bienvenida.

## [0.2.0] — 2026-07-12

### Añadido

- **Multiidioma (i18n)**: interfaz disponible en **castellano** (por defecto) y
  **valencià/català**, con selector de idioma en la cabecera. El idioma elegido se
  recuerda entre sesiones.
- Fechas, nombres de meses y días de la semana **localizados** según el idioma activo.
- Al crear un calendario nuevo, los nombres por defecto de perfiles y trimestres se
  generan en el idioma activo.
- La vista de impresión y la descarga de `.ics` desde la app respetan el idioma activo.

### Notas

- Los feeds ICS de suscripción publicados en el repositorio se generan con etiquetas en
  castellano; los títulos introducidos por cada usuario se muestran tal cual.

## [0.1.0] — 2026-07-12

### Añadido

- **Editor de calendario**: inicio/fin de curso, días de descanso semanal configurables.
- **Periodos vacacionales** y **festivos** (autonómicos y locales), con soporte para
  convertir un festivo en día lectivo.
- **Importación por JSON** además de la entrada manual de datos.
- **Contador de días lectivos** totales.
- **Fechas puntuales o de rango**, marcables como **provisionales**.
- **Trimestres** con nombre configurable (Primer, Segundo, Tercer, Anticipación,
  Ordinaria/Final, Extraordinaria) y fecha exacta de inicio.
- **Estadísticas por trimestre**: duración en semanas y recuento de lunes/martes/…
  lectivos.
- **Modo guiado** por trimestre: avisa de hitos pendientes (pruebas teóricas, sesiones
  de evaluación, plazos de ITACA, visibilidad en WebFamília, impresión y firma de actas,
  plazo de reclamación; y para Anticipación, solicitud y listados provisional/definitivo).
- **Eventos institucionales**: claustros, COCOPE, consejos escolares y pruebas de acceso.
- **Perfiles** (Docentes, Alumnado, Familias, Administración) editables por calendario;
  cada fecha indica a qué perfiles es visible.
- **Vista de impresión** (lista o calendario compacto) filtrable por perfil, lista para
  guardar como PDF.
- **Exportación ICS** (descarga puntual) y **feeds ICS auto-generados** para suscripción.
- **Galería de calendarios publicados** de solo lectura, con suscripción por perfil.
- Modo **claro/oscuro** y tag de versión enlazado a este changelog.
