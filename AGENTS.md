# AGENTS.md

## Propósito

Este repositorio contiene **Health**, una PWA personal para registrar eventos de salud. Sus dos flujos de dominio principales son:

- registrar episodios de dolor;
- registrar tomas de uno o varios medicamentos previamente dados de alta.

Esta guía se aplica a todo el repositorio. Antes de modificar una zona, lee sus archivos relacionados de extremo a extremo y conserva las decisiones existentes salvo que la tarea pida cambiarlas.

## Stack y herramientas

- Angular 22, aplicación standalone y sin `NgModule`.
- TypeScript 6 con comprobaciones estrictas.
- Bun 1.3.8 como gestor de paquetes y ejecutor preferente.
- AngularFire 20 con Firebase Auth y Cloud Firestore.
- Angular CDK Overlay/Portal para los diálogos propios.
- Signals para estado; RxJS para Auth, Firestore y ciclos de vida de suscripciones.
- Reactive Forms en los formularios existentes.
- Tailwind CSS 4 y una librería visual propia basada en clases/componentes `my-*`.
- `@ngx-translate/core` con español como idioma inicial y fallback.
- Vitest a través del builder de Angular.
- Angular Service Worker y Firebase Hosting para la PWA.

Comandos habituales:

```bash
bun install
bun run start
bun run lint
bun run test -- --watch=false
bun run build
```

No sustituyas Bun por npm/yarn ni generes otro lockfile. `bun.lock` existe aunque actualmente esté ignorado por Git.

## Mapa del repositorio

- `src/app/app.config.ts`: providers globales (router, i18n, PWA y Firebase).
- `src/app/app.routes.ts`: rutas raíz, guards y layout privado.
- `src/app/auth/`: páginas y estado de autenticación.
- `src/app/core/`: guards, estado general, actualización de la PWA y CRUD base de Firestore.
- `src/app/state/`: stores singleton de medicamentos y eventos de salud.
- `src/app/pages/`: features lazy-loaded (`home`, `drugs`, `health-events`).
- `src/app/shared/models/`: contratos y conversión del dominio.
- `src/app/shared/components/`: piezas compartidas de la aplicación, como confirmaciones.
- `src/app/library/`: design system propio (`my-card`, `my-dialog`, `my-form`, `my-toast`, utilidades).
- `src/app/library/styles/`: componentes CSS globales de ese design system.
- `public/i18n/`: catálogos `es.json` y `en.json`.
- `src/environments/environment.example.ts`: plantilla pública de configuración Firebase.
- `.github/workflows/firebase-hosting-push.yml`: build y despliegue a Firebase Hosting en `main` y `develop`.
- `.claude/CLAUDE.md`: convenciones Angular adicionales ya adoptadas por el proyecto.

Los `index.ts` actúan como barrels en los límites de cada área. Mantén sus exportaciones ordenadas y úsalos para dependencias entre áreas cuando ya exista ese patrón; evita barrels circulares.

## Arquitectura y flujo de ejecución

La aplicación se arranca con `bootstrapApplication`. Las rutas públicas viven bajo `/auth`; `/home`, `/health-events` y `/drugs` están bajo `Layout` y protegidas por `privateGuard`. Las features cargan rutas y componentes de forma perezosa.

`AuthState` escucha Firebase Auth, expone `authState$`, gestiona login/registro/logout y actualiza `AppState.isAppReady`. `App` y `Layout` usan esa señal para mostrar un loader mientras la sesión no está lista.

`Layout` inyecta `HealthEventsState` y `DrugsState`. Eso instancia ambos stores y abre sus listeners de Firestore. Cada store:

1. extiende `FirestoreBase`;
2. escucha una colección con `collectionData`;
3. ordena por `created desc`;
4. transforma documentos a modelos;
5. publica datos y carga mediante signals readonly.

Las escrituras se hacen directamente desde los diálogos de formulario. Tras crear, actualizar o borrar, el listener en tiempo real actualiza la UI; no añadas actualizaciones optimistas duplicadas sin una razón concreta.

Los overlays se crean mediante `MyDialogState.open(...)`. El servicio construye un injector específico que aporta `MyDialogRefModel` y `MY_DIALOG_TOKEN`; los componentes de diálogo no funcionan aislados sin esos providers.

## Modelo de datos actual

Firestore usa dos colecciones raíz:

### `drugs`

- `id`: ID del documento, añadido en lectura mediante `idField`.
- `name`, `description`.
- `measure`, `measureType` (`mg` o `ml`).
- `notes`.
- `created`, `updated`.

### `health-events`

- `type`: `pain` o `drug`.
- Campos comunes: `description`, `notes`, `created`, `updated`.
- Dolor: `painType`, `painLevel` (UI: 1–5), `from`, `to`; `date` queda a `null`.
- Medicación: `date`, `drugs: [{ drug, quantity }]`; `from` y `to` quedan a `null`.
- `drug` guarda el ID de un documento de `drugs`, no una copia del medicamento.

Firestore convierte los `Date` escritos en `Timestamp`. `HealthEvent.buildFromDocumentData` debe seguir convirtiendo todos los timestamps a `Date` antes de que lleguen a cronología y estadísticas.

La cronología agrupa por la fecha semántica: `from` para dolor y `date` para medicación. Home usa la misma regla para contabilizar hoy, mes y año. Una toma cuenta como un evento independientemente de la cantidad o del número de medicamentos que contiene.

## Firebase, privacidad y configuración

- La configuración real vive en `src/environments/environment.ts`, está ignorada y nunca debe mostrarse, registrarse ni incluirse en commits.
- Si falta, parte de `environment.example.ts` y usa valores locales; nunca inventes credenciales.
- CI crea `environment.ts` con GitHub Secrets y publica `dist/health/browser`.
- No hay reglas de Firestore ni configuración de emuladores versionadas en este repositorio.
- **Auth no implica aislamiento de datos en el código actual**: los stores consultan `drugs` y `health-events` completos, sin `uid`, subcolecciones por usuario ni filtros. No describas los datos como privados por usuario salvo que reglas externas lo garanticen. Cualquier tarea multiusuario debe diseñar conjuntamente esquema, migración, consultas, índices y reglas.
- No borres un medicamento referenciado por eventos sin valorar qué ocurrirá con esas referencias; actualmente la tarjeta de una toma omite IDs que ya no se resuelven.

## Convenciones Angular y TypeScript

- Usa componentes standalone; no escribas `standalone: true`.
- Para servicios singleton nuevos, usa `@Service()`; `FirestoreBase` continúa como base abstracta injectable.
- Usa `inject()` en vez de inyección por constructor.
- Usa `input()`/`output()`, signals y `computed()`; no introduzcas Subjects como store general.
- No declares `ChangeDetectionStrategy.OnPush` en componentes nuevos: en Angular 22 ya es el comportamiento adoptado por defecto. No es necesario retirar declaraciones existentes en tareas no relacionadas.
- Usa control flow nativo (`@if`, `@for`, `@switch`) y evita directivas estructurales antiguas.
- No uses `ngClass`, `ngStyle`, `@HostBinding` ni `@HostListener`; usa bindings de `class`/`style` y el objeto `host`.
- Mantén componentes pequeños y lógica de transformación fuera de templates complejos.
- Prefiere Signal Forms para formularios nuevos; conserva Reactive Forms al extender los actuales, salvo refactor explícito.
- Evita `any`; usa tipos concretos o `unknown`. Conserva nullabilidad porque los documentos existentes admiten campos opcionales/nulos.
- Prefiere inferencia cuando el tipo sea obvio.
- Los componentes de aplicación usan prefijo `app-`; la librería propia usa `my-`.
- Imports y exports deben pasar `simple-import-sort`; imports sin usar son error.
- Formato: 2 espacios, comillas simples, 120 columnas, trailing commas ES5 y Prettier con ordenación Tailwind.

## UI, CDK y estilos

- Reutiliza primero los componentes `my-card`, `my-dialog`, `my-form-field`, `my-form-error`, `my-toast` y las clases `my-button`, `my-icon-button`, `my-input`, `my-select`, `my-label`.
- Los estilos compartidos pertenecen a `src/app/library/styles/` y se importan desde `src/styles.css`.
- Tailwind define la paleta naranja `my-primary` y marrón `my-secondary`, tipografía Roboto y Material Symbols locales.
- Conserva el enfoque mobile-first, la navegación inferior fija y el espacio inferior de las páginas para no tapar contenido.
- Un diálogo nuevo debe abrirse a través de `MyDialogState` y cerrarse mediante `MyDialogRefModel`; pasa datos por `MY_DIALOG_TOKEN`.
- Mantén las animaciones de entrada/salida y respeta `prefers-reduced-motion`.
- Toda UI debe cumplir WCAG AA y comprobaciones AXE: labels reales, nombres accesibles en botones de icono, foco visible, orden de foco, cierre/foco de overlays y contraste.
- Usa `NgOptimizedImage` para imágenes estáticas nuevas, excepto imágenes inline/base64.

## Formularios y reglas de dominio

- Valida antes de escribir y marca controles como touched cuando el submit sea inválido.
- Al alternar el tipo de evento, sincroniza valores, enabled/disabled y validadores de ambos grupos de campos.
- Mantén la conversión entre `datetime-local` y `Date` en las utilidades de `library/my-utils`.
- Al editar, conserva `created` en Firestore y establece `updated`; al crear, establece `created`.
- Si se añaden tipos de dolor o unidades, actualiza enum/modelo, formulario, presentación y ambos catálogos i18n.
- Las tres quick actions de medicación contienen IDs Firestore fijos para Sibelium, Maxalt Max e Ibuprofeno. No los cambies ni generalices silenciosamente. Si se trabaja en esta función, reemplázalos por configuración/datos verificables y contempla medicamentos ausentes.

## Internacionalización

- No escribas texto visible nuevo directamente en TS/HTML salvo valores de dominio deliberados.
- Añade toda clave a `public/i18n/es.json` y `public/i18n/en.json` en el mismo cambio.
- Español es el idioma por defecto. Mantén claves jerárquicas por feature (`home`, `healthEvents`, `drugs`, `auth`, `common`).
- Los mensajes de toast reciben claves y `MyToastState` las traduce al mostrarlas.
- Revisa singular/plural y formato de fechas al modificar estadísticas o cronología.

## Pruebas y verificación

Antes de entregar un cambio, ejecuta como mínimo:

```bash
bun run lint
bun run test -- --watch=false
bun run build
```

Escala la verificación según el cambio: prueba modelos/transformaciones, validación dinámica, estados loading/error/empty, CRUD y comportamiento de overlays. Para dependencias externas usa fakes/providers controlados; una prueba unitaria no debe conectar con Firebase real.

Baseline observado al crear esta guía (2026-07-15):

- `bun run lint` pasa.
- Los 13 tests existentes fallan por setup incompleto: faltan providers/mocks de `Firestore`, `TranslateService`, `SwUpdate`, `MyDialogRefModel` y contexto de inyección. Además, el test de `App` aún espera el título del starter.
- `bun run build` termina localmente con `SIGABRT` durante `Building...` sin diagnóstico de compilación.

No ocultes estos fallos ni los atribuyas automáticamente a tu cambio. Reproduce el baseline antes de modificar, informa qué verificaciones pasan/fallan y arregla tests/build solo cuando entren en el alcance o sean necesarios para validar la tarea.

## Particularidades conocidas que requieren cuidado

- `DrugInterface.measureType` está tipado como array, pero el formulario y la UI lo manejan como un único enum.
- `HealthEvent.buildFromDocumentData` obtiene actualmente `updated` desde `created`.
- `AuthState.signUp` valida `name`, pero Firebase Auth no lo guarda como display name ni se persiste en Firestore.
- Los estados de loading de los diálogos existen, pero las escrituras actuales no los activan.
- `onClickAddNewDrug()` asume que existe al menos un medicamento.
- Las medias de dolor pueden resultar `NaN` cuando no hay episodios y no se redondean para presentación.
- El logout existe en código, pero su botón está comentado en la navbar.

No corrijas estas cuestiones incidentalmente en una tarea ajena. Sí tenlas presentes, añade cobertura cuando las toques y explica cualquier cambio de esquema o comportamiento.

## Forma de trabajar en este repositorio

1. Comprueba `git status` y conserva cambios del usuario no relacionados.
2. Sigue el flujo completo afectado: modelo → store/Firestore → formulario → componente/template → i18n → prueba.
3. Haz el cambio mínimo coherente con la arquitectura actual.
4. No hagas despliegues, migraciones, escrituras en Firebase real ni cambios de reglas sin petición explícita.
5. No registres secretos, datos reales de salud, correos ni IDs adicionales obtenidos de producción en fixtures, logs o documentación.
6. Actualiza esta guía cuando cambien de forma material el stack, estructura, esquema, comandos o convenciones.
7. En la entrega resume archivos modificados, comportamiento, verificaciones y riesgos/baseline pendiente.
