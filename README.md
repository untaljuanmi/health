# Health

Health es una aplicación web progresiva para registrar y consultar información personal de salud. Permite mantener un catálogo de medicamentos, anotar episodios de dolor y registrar tomas de medicación desde una interfaz pensada principalmente para móvil.

La aplicación utiliza Firebase Authentication para el acceso y Cloud Firestore para sincronizar los datos en tiempo real.

## Funcionalidades

- Registro e inicio de sesión mediante correo electrónico y contraseña.
- Alta, edición y eliminación de medicamentos.
- Registro de episodios de dolor con tipo, intensidad, descripción y duración.
- Registro de tomas con uno o varios medicamentos, cantidad y fecha.
- Edición y eliminación de eventos mediante diálogos de confirmación.
- Cronología de eventos agrupada por año, mes y día.
- Resumen de eventos y estadísticas de dolor para hoy, el mes y el año actual.
- Notificaciones de éxito y error mediante toasts.
- Actualización en tiempo real al cambiar los documentos de Firestore.
- Soporte de traducciones en español e inglés.
- Instalación como PWA y aviso cuando hay una nueva versión disponible.

## Tecnologías principales

- Angular 22 con componentes standalone, lazy loading y signals.
- TypeScript 6.
- AngularFire 20, Firebase Auth y Cloud Firestore.
- Angular CDK Overlay y Portal para el sistema de diálogos.
- Reactive Forms.
- Tailwind CSS 4 y una pequeña librería de componentes `my-*` propia.
- `@ngx-translate/core` para internacionalización.
- Angular Service Worker para las capacidades PWA.
- Vitest, ESLint y Prettier.
- Bun como gestor de paquetes y ejecutor de scripts.

## Requisitos

- [Bun](https://bun.sh/) 1.3.8 o compatible.
- Un proyecto de Firebase.
- El proveedor Email/Password habilitado en Firebase Authentication.
- Una base de datos de Cloud Firestore.

## Configuración local

1. Instala las dependencias:

   ```bash
   bun install
   ```

2. Crea el archivo local de entorno a partir de la plantilla:

   ```bash
   cp src/environments/environment.example.ts src/environments/environment.ts
   ```

3. Sustituye los placeholders de `src/environments/environment.ts` por la configuración web de tu proyecto Firebase:

   ```ts
   export const environment = {
     firebase: {
       projectId: '...',
       appId: '...',
       storageBucket: '...',
       apiKey: '...',
       authDomain: '...',
       messagingSenderId: '...',
     },
   };
   ```

   Este archivo está ignorado por Git. No debe incluirse en commits ni compartirse en logs.

4. Arranca el servidor de desarrollo:

   ```bash
   bun run start
   ```

5. Abre [http://localhost:4200](http://localhost:4200).

## Scripts

| Comando | Descripción |
| --- | --- |
| `bun run start` | Inicia el servidor de desarrollo. |
| `bun run build` | Genera el build de producción en `dist/health/browser`. |
| `bun run watch` | Compila en modo desarrollo y observa cambios. |
| `bun run test -- --watch=false` | Ejecuta una vez la suite de tests con Vitest. |
| `bun run test` | Ejecuta los tests en modo interactivo/watch. |
| `bun run lint` | Analiza TypeScript y templates con ESLint. |

## Arquitectura

```text
src/app/
├── auth/       Autenticación, páginas públicas y estado de sesión
├── core/       Guards, servicios globales y CRUD base de Firestore
├── layout/     Layout privado y navegación inferior
├── library/    Componentes, estilos y utilidades reutilizables `my-*`
├── pages/      Features lazy-loaded: home, drugs y health-events
├── shared/     Modelos y componentes compartidos
└── state/      Estado reactivo y listeners de Firestore
```

Las rutas `/home`, `/health-events` y `/drugs` están protegidas por autenticación. El layout privado instancia los estados de medicamentos y eventos, que escuchan Firestore mediante `collectionData`. Las escrituras se realizan desde los formularios y la interfaz se actualiza con los cambios recibidos en tiempo real.

Los diálogos y confirmaciones no dependen de una librería visual externa: se construyen con Angular CDK y los componentes incluidos en `src/app/library/`.

## Datos en Firestore

La implementación actual trabaja con dos colecciones raíz:

- `drugs`: catálogo de medicamentos, medida, unidad, descripción y fechas de creación/actualización.
- `health-events`: eventos de tipo `pain` o `drug`, con sus fechas y datos específicos.

Las tomas almacenan referencias a medicamentos mediante el ID del documento:

```ts
{
  type: 'drug',
  date: Date,
  drugs: [{ drug: 'firestore-document-id', quantity: 1 }],
  created: Date,
}
```

Los episodios de dolor usan `from` y `to`; las tomas usan `date`. Firestore persiste los valores `Date` como `Timestamp` y los modelos de la aplicación los convierten de nuevo al leerlos.

> [!IMPORTANT]
> La autenticación no aísla por sí sola los datos. Actualmente las consultas acceden a las colecciones completas y no incluyen un `uid` ni una ruta por usuario. Este repositorio tampoco contiene las reglas de seguridad de Firestore. Antes de utilizar la aplicación con varias personas deben diseñarse el aislamiento por usuario, las reglas, los índices y la migración de los datos existentes.

## PWA

El build de producción registra `ngsw-worker.js`, precarga los recursos principales y permite instalar la aplicación en dispositivos compatibles. Cuando el service worker detecta una versión preparada, la aplicación muestra un diálogo para activarla y recargar la página.

El service worker está deshabilitado durante el desarrollo local.

## Internacionalización

El idioma inicial y de fallback es español. Los catálogos se encuentran en:

- `public/i18n/es.json`
- `public/i18n/en.json`

Las nuevas cadenas visibles deben añadirse a ambos archivos.

## Despliegue

`firebase.json` publica `dist/health/browser` en Firebase Hosting y redirige todas las rutas a `index.html` para permitir el enrutado del cliente.

El workflow `.github/workflows/firebase-hosting-push.yml` compila y despliega al hacer push sobre `main` o `develop`. La configuración Firebase se genera durante CI mediante estos GitHub Secrets:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_APP_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_SERVICE_ACCOUNT_HEALTH_ANGULAR_APP`

## Desarrollo y contribución

Consulta [AGENTS.md](AGENTS.md) para conocer las convenciones del proyecto, el flujo de trabajo, las particularidades del dominio y el baseline actual de pruebas y compilación.
