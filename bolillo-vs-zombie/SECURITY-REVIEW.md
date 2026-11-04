# Revisión final de seguridad y compatibilidad

**Fecha:** 3 de noviembre de 2026
**Alcance:** diagnóstico de dependencias y revisión de compatibilidad para el
despliegue en Railway. No se ejecutaron `npm audit fix`, instalaciones,
migraciones ni despliegues. La única modificación autorizada después de la
revisión es este informe.

## Resumen ejecutivo

`npm audit` se ejecutó en modo de solo lectura contra el `package-lock.json`
raíz. Informó **129 registros de paquetes vulnerables**: 1 crítico, 25 altos,
96 moderados y 7 bajos. No son 129 avisos únicos: varios paquetes pueden
corresponder a una misma recomendación o cadena vulnerable.

| Alcance | Todas las dependencias | Solo producción (`--omit=dev`) |
|---|---:|---:|
| Raíz | 129: 1 crítico, 25 altos, 96 moderados, 7 bajos | 94: 1 crítico, 25 altos, 64 moderados, 4 bajos |
| Backend | 113: 24 altos, 82 moderados, 7 bajos | 92: 24 altos, 64 moderados, 4 bajos |
| Storefront | 19: 1 crítico, 1 alto, 17 moderados | 6: 1 crítico, 1 alto, 4 moderados |

Los recuentos por workspace pueden solaparse por dependencias compartidas y
hoisting; no deben sumarse para obtener el recuento de la raíz.

### Hallazgos principales

| # | Severity | File | Lines | Vulnerability | Confidence |
|---|----------|------|-------|---------------|------------|
| 1 | 🔴 CRITICAL | [apps/storefront/package.json](./apps/storefront/package.json) | 32 | `next@15.5.24` directo de producción: avisos de envenenamiento de caché SSG/ISR y DoS de Server Actions. El aviso RCE de optimización de imágenes parece mitigado por `images.unoptimized: true`, pero eso no cubre los otros avisos. | 9/10 |
| 2 | 🟠 HIGH | [apps/backend/package.json](./apps/backend/package.json) | 28-40 | El audit marca el conjunto Medusa 2.21.2 y `zod@4.2.0` directos de producción; el impacto se propaga en gran medida por dependencias compartidas y depende de la alcanzabilidad de las rutas afectadas. | 8/10 |
| 3 | 🟠 HIGH | [package-lock.json](./package-lock.json) | 2550, 19422, 23054 | Dependencias transitivas de backend `@graphql-tools/utils@10.11.0`, `follow-redirects@1.16.1` y `lodash@4.17.23`, con avisos de contaminación de prototipos/inyección y credenciales en redirecciones. | 8/10 |
| 4 | 🟠 HIGH | [package-lock.json](./package-lock.json) | 23809 | `postcss@8.4.31` transitivo de Next: avisos de divulgación de source maps/traversal y XSS en procesamiento CSS. La exposición de runtime/build debe evaluarse según qué CSS no confiable se procese. | 8/10 |
| 5 | 🟡 MEDIUM | [package-lock.json](./package-lock.json) | 19202 | `fast-uri@3.1.8` transitivo en ambos workspaces: avisos de interpretación de URI; el audit no establece que datos controlados por atacantes alcancen esas rutas. | 7/10 |
| 6 | 🟡 MEDIUM | [apps/backend/src/api/store/analytics/events/route.ts](./apps/backend/src/api/store/analytics/events/route.ts) | 6-52 | El límite de 60 eventos/minuto confía en un `session_id` proporcionado por el cliente y vive en memoria por proceso; se puede eludir con IDs nuevos, por lo que no frena la creación anónima de eventos ni se comparte entre instancias. | 9/10 |

El audit también marca `@opentelemetry/instrumentation-pg@0.52.0` como moderado:
el aviso trata de nombres de usuario de base de datos en spans y depende de la
exportación y exposición de trazas. Los avisos de DoS en `body-parser`,
`multer`, `qs`, `zod` y otros paquetes no demuestran por sí solos que una ruta
vulnerable sea alcanzable en esta aplicación.

## Inventario de paquetes vulnerables

`B` significa backend, `S` storefront y `B+S` ambos. “Directo” se refiere al
manifiesto del workspace; los demás son transitivos. Los paquetes listados
como producción aparecen también en `npm audit --omit=dev`.

### Producción: críticos y altos

- **Crítico — S, directo:** `next@15.5.24`.
- **Altos — B, directos:** `@medusajs/admin-sdk@2.21.2`,
  `@medusajs/cli@2.21.2`, `@medusajs/dashboard@2.21.2`,
  `@medusajs/draft-order@2.21.2`, `@medusajs/framework@2.21.2`,
  `@medusajs/medusa@2.21.2`, `zod@4.2.0`.
- **Altos — B, transitivos:** `@graphql-codegen/core@4.0.2`,
  `@graphql-codegen/plugin-helpers@5.1.1`,
  `@graphql-codegen/schema-ast@4.1.0`,
  `@graphql-codegen/typescript@4.1.6`,
  `@graphql-codegen/visitor-plugin-common@5.8.0`,
  `@graphql-tools/utils@10.11.0`, `@medusajs/admin-bundler@2.21.2`,
  `@medusajs/deps@2.21.2`, `@medusajs/modules-sdk@2.21.2`,
  `@medusajs/orchestration@2.21.2`, `@medusajs/query@2.21.2`,
  `@medusajs/utils@2.21.2`, `@medusajs/workflows-sdk@2.21.2`,
  `body-parser@1.20.8`, `follow-redirects@1.16.1`, `lodash@4.17.23`,
  `multer@2.4.0`.
- **Alto — S, transitivo:** `postcss@8.4.31` en
  `node_modules/next/node_modules/postcss`.

### Producción: moderados

- **B, transitivos, todos Medusa 2.21.2:** `@medusajs/analytics`,
  `@medusajs/analytics-local`, `@medusajs/analytics-posthog`,
  `@medusajs/api-key`, `@medusajs/auth`, `@medusajs/auth-emailpass`,
  `@medusajs/auth-github`, `@medusajs/auth-google`, `@medusajs/auth-oidc`,
  `@medusajs/cache-inmemory`, `@medusajs/cache-redis`,
  `@medusajs/caching-redis`, `@medusajs/cart`, `@medusajs/core-flows`,
  `@medusajs/currency`, `@medusajs/customer`, `@medusajs/event-bus-local`,
  `@medusajs/event-bus-redis`, `@medusajs/file`, `@medusajs/file-local`,
  `@medusajs/file-s3`, `@medusajs/fulfillment`,
  `@medusajs/fulfillment-manual`, `@medusajs/index`, `@medusajs/inventory`,
  `@medusajs/link-modules`, `@medusajs/locking`,
  `@medusajs/locking-postgres`, `@medusajs/locking-redis`,
  `@medusajs/notification`, `@medusajs/notification-local`,
  `@medusajs/notification-sendgrid`, `@medusajs/order`,
  `@medusajs/payment`, `@medusajs/payment-stripe`, `@medusajs/pricing`,
  `@medusajs/product`, `@medusajs/promotion`, `@medusajs/rbac`,
  `@medusajs/region`, `@medusajs/sales-channel`, `@medusajs/search`,
  `@medusajs/search-postgres`, `@medusajs/settings`,
  `@medusajs/stock-location`, `@medusajs/store`, `@medusajs/tax`,
  `@medusajs/translation`, `@medusajs/user`,
  `@medusajs/workflow-engine-inmemory`,
  `@medusajs/workflow-engine-redis`.
- **B, direct:** `@medusajs/caching@2.21.2`.
- **B, transitives:** `@opentelemetry/instrumentation-pg@0.52.0`,
  `@rushstack/node-core-library@5.13.0`, `@rushstack/terminal@0.15.2`,
  `@rushstack/ts-command-line@4.23.7`, `ajv@8.13.0`, `bullmq@5.13.0`,
  `glob@7.2.3`, `uuid@9.0.1`.
- **B+S, transitives:** `fast-uri@3.1.8`, `minimatch@3.1.5`,
  `postcss-selector-parser@6.1.4`.
- **S, direct:** `qs@6.16.0` (also present transitively in the backend tree).

### Producción: bajos

- **B, transitivos:** `@sendgrid/client@8.1.6`,
  `@sendgrid/helpers@8.0.0`, `@sendgrid/mail@8.1.6`, `deepmerge@4.3.1`.

### Solo desarrollo

Estos paquetes se excluyen de `npm audit --omit=dev`.

- **B, moderados, transitivos:** `@jest/core@29.7.0`,
  `@jest/expect@29.7.0`, `@jest/globals@29.7.0`,
  `@jest/reporters@29.7.0`, `@jest/transform@29.7.0`,
  `babel-jest@29.7.0`, `babel-plugin-istanbul@6.1.1`,
  `ignore-walk@3.0.4`, `jest-circus@29.7.0`, `jest-config@29.7.0`,
  `jest-resolve-dependencies@29.7.0`, `jest-runner@29.7.0`,
  `jest-runtime@29.7.0`, `jest-snapshot@29.7.0`, `npm-packlist@2.2.2`,
  `test-exclude@6.0.0`.
- **B, moderados, directos:** `@medusajs/test-utils@2.21.2`,
  `yalc@1.0.0-pre.53`.
- **B, bajos:** transitivos `create-jest@29.7.0`, `jest-cli@29.7.0`;
  directo `jest@29.7.0`.
- **S, moderados, transitivos:** `@eslint-community/eslint-utils@4.10.1`,
  `@eslint/config-array@0.21.2`, `@eslint/eslintrc@3.3.7`,
  `@typescript-eslint/eslint-plugin@8.71.2`,
  `@typescript-eslint/parser@8.71.2`,
  `@typescript-eslint/type-utils@8.71.2`,
  `@typescript-eslint/typescript-estree@8.71.2`,
  `@typescript-eslint/utils@8.71.2`, `eslint-plugin-import@2.32.0`,
  `eslint-plugin-jsx-a11y@6.10.2`, `eslint-plugin-react@7.37.5`.
- **S, moderados, directos:** `eslint@9.39.5`,
  `eslint-config-next@15.5.24`.
- **Dependencia dev directa de raíz, moderada:** `@medusajs/eslint-plugin@2.21.2`.

### Avisos destacados

- **Next.js:** GHSA-4jqv-mc3x-m676 y GHSA-mcj8-r9mp-w47p (cache poisoning de
  SSG/ISR), GHSA-2464-fhr4-w9xw (RCE de optimización de imágenes bajo las
  condiciones del aviso) y GHSA-p3m5-59mp-jv5r (DoS de Server Actions).
  `images.unoptimized: true` evita la ruta de optimización de imágenes
  relevante para el RCE; no corrige los otros avisos. El audit ofrece
  `15.5.29`.
- **PostCSS:** GHSA-qx2v-qp2m-jg93, GHSA-6g55-p6wh-862q,
  GHSA-fxqj-rqcc-2cmp y GHSA-r28c-9q8g-f849.
- **GraphQL Tools:** contaminación de prototipos, GHSA-7mx3-vvmw-hjmv y
  GHSA-c4qx-w738-7hr3.
- **Lodash:** inyección de plantillas y contaminación de prototipos,
  GHSA-r5fr-rjxr-66jc y GHSA-f23m-r3pf-42rh.
- **follow-redirects:** credenciales en redirecciones, GHSA-mrwp-f3q8-3g9p.
- **fast-uri:** interpretación de URI, GHSA-w74x-v6f9-j3xg,
  GHSA-xhq7-xmqj-769h, GHSA-wjr9-j795-jxcr y GHSA-333x-w4r6-6crp.
- Otros avisos incluyen DoS/resource exhaustion (`body-parser`, `multer`,
  `qs`, `zod`, `minimatch`, `postcss-selector-parser`), traversal tras timeout
  (`glob`, GHSA-3g3m-2fjr-6pw4), ReDoS (`ajv`, GHSA-2g4f-4pwh-qvx6) y
  prototype poisoning (`deepmerge`, GHSA-gcqx-w48m-w2h4).

Los avisos de auditoría describen versiones y rangos afectados; no prueban por
sí solos que cada función vulnerable sea alcanzable con entradas controladas
por atacantes en esta aplicación.

## Compatibilidad de React

- El monorepo fija React/ReactDOM `18.3.1` en la raíz, requerido por Medusa
  2.21.2; el workspace storefront declara React/ReactDOM `19.0.5`.
- Next.js 15.5.24 declara compatibilidad peer con React 18.2+ o React 19.
- `run-next.js` inicia el CLI de Next con `NODE_OPTIONS=--require` para cargar
  `resolve-storefront-react.js`. Este reemplaza globalmente
  `Module._resolveFilename` para que las importaciones `react` y `react-dom`
  resuelvan desde el workspace storefront, incluso en los procesos Node hijos.
- La preparación anterior compiló e inició Next con este mecanismo y el
  storefront respondió en el puerto configurado. No se hizo una instalación
  limpia ni se volvió a compilar en esta auditoría. El reemplazo de
  `Module._resolveFilename` es una API interna de Node, no un contrato público;
  además afecta toda resolución React del proceso Next. Funciona con el árbol
  instalado actual, pero requiere prueba en CI con `npm ci`, las versiones
  fijadas y un build/start completos antes de considerarlo estable.
- No se identificó un conflicto de semver declarado entre Next 15.5.24 y
  React 19, ni se cambió ninguna versión.

## Railway

El repositorio Git tiene raíz `webProgresiva`; el monorepo npm se encuentra en
`bolillo-vs-zombie`. Por tanto, `Root Directory=/bolillo-vs-zombie` y las rutas
absolutas de config `/bolillo-vs-zombie/apps/{backend,storefront}/railway.json`
son coherentes con el repositorio. Los comandos `npm run ... --workspace=...`
resuelven los workspaces desde esa raíz.

| Servicio | Instalación | Compilación | Inicio | Puerto y healthcheck |
|---|---|---|---|---|
| Backend | No define comando explícito; depende de la instalación automática de Railway/Nixpacks desde la raíz npm. | `npm run build --workspace=@dtc/backend` | `npm run start --workspace=@dtc/backend` → `medusa start` | **Bloqueante:** Medusa CLI anuncia puerto predeterminado 9000 y no lee `PORT`. La configuración no pasa `--port`. No define healthcheck, aunque Medusa incorpora `GET /health`. |
| Storefront | No define comando explícito; depende de la instalación automática de Railway/Nixpacks desde la raíz npm. | `npm run build --workspace=@dtc/storefront` | `npm run start --workspace=@dtc/storefront` | Next escucha en `PORT`; se comprobó previamente con un puerto asignado. No define healthcheck ni hay una ruta de health dedicada configurada. |

Ambos archivos definen reinicio `ON_FAILURE` y hasta 10 reintentos; no fijan
healthchecks ni instalación. Railway puede detectar e instalar npm desde el
directorio raíz configurado, pero esto no queda expresado en los JSON. Debe
confirmarse en la configuración del servicio que el instalador usa el
`package-lock.json` del monorepo.

**Riesgo temporal:** la documentación actual de Railway marca Config as Code
(`railway.json`/`railway.toml`) como obsoleto y dice que los archivos existentes
siguen funcionando para servicios heredados hasta el **1 de diciembre de
2026**. Al 3 de noviembre de 2026, falta menos de un mes; antes de crear
servicios nuevos conviene confirmar soporte y preferir la configuración vigente
de Infrastructure as Code o los comandos de servicio de Railway.

## Medusa y Redis

La configuración corresponde a las opciones declaradas por los paquetes de
Medusa 2.21.2 instalados:

| Uso | Módulo/proveedor | Opción usada |
|---|---|---|
| Event bus | `@medusajs/medusa/event-bus-redis` | `options.redisUrl` |
| Workflows | `@medusajs/medusa/workflow-engine-redis` | `options.redis.redisUrl` |
| Caché | `@medusajs/medusa/caching` con `@medusajs/caching-redis` | `providers[].options.redisUrl`, prefijo propio |
| Locks | `@medusajs/medusa/locking` con `@medusajs/medusa/locking-redis` | `providers[].options.redisUrl`, namespace propio |
| Sesiones HTTP | `projectConfig.redisUrl` | `REDIS_URL`, prefijo `bolillo:` |

`@medusajs/medusa@2.21.2` incluye estos proveedores como dependencias
transitivas fijadas a `2.21.2`; las opciones coinciden con sus declaraciones
de tipos locales. En producción, el validador requiere `NODE_ENV=production`,
`REDIS_URL`, `DATABASE_URL`, `JWT_SECRET`, `COOKIE_SECRET` y los tres CORS
HTTPS (`STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS`). `REDIS_URL` se comparte entre
los proveedores. En desarrollo no se registran estos proveedores y se
conserva el fallback local/falso de Medusa. El worker permanece en modo
compartido por defecto; no se necesita otro servicio de worker para la
configuración actual.

Antes de publicar, confirma que el Redis elegido permite los comandos de
BullMQ y utiliza una política de memoria compatible con colas (sin expulsión
de claves de cola).

## Analíticas

- El módulo se registra en `apps/backend/medusa-config.ts` desde
  `src/modules/analytics/index.ts`.
- `POST /store/analytics/events` valida el esquema del evento y persiste el
  registro; el servicio busca `event_id` existente y la restricción única de
  PostgreSQL respalda la deduplicación concurrente.
- La migración `Migration20261027020839` crea `analytics_event` e índice único
  parcial para `event_id`.
- `GET /admin/analytics` valida el rango (máximo 90 días) y está protegido por
  `authenticate("user", ["session", "bearer"])`.
- La página `src/admin/routes/analytics/page.tsx` solicita ese endpoint y
  presenta métricas y páginas principales.
- **Abuso del endpoint público:** el límite por sesión está en una `Map` local
  y confía en un UUID enviado por el cliente. IDs nuevos eluden el límite; al
  llegar al máximo de entradas, el mapa puede además rechazar sesiones nuevas
  hasta que expiren entradas. Para una sola instancia y una métrica no crítica
  es una limitación operativa; no es un control antiabuso robusto ni distribuido.

La existencia de la migración no confirma que la base de datos de producción
esté actualizada. Ejecútala una vez, deliberadamente, en el servicio de
Railway antes de usar las rutas; no se ejecutó ninguna migración durante esta
revisión.

## Recomendaciones antes de publicar

1. Corregir el puerto del backend para que Medusa escuche en el `PORT` que
   Railway le asigna (por ejemplo, pasar `--port "$PORT"` al inicio) y
   configurar `/health` como healthcheck.
2. Elegir un healthcheck del storefront que no dependa de que el backend esté
   disponible y de que el middleware resuelva una región.
3. Resolver primero el crítico de Next dentro de la rama 15.5; alinear
   `eslint-config-next` y volver a compilar y auditar. El audit señala
   `15.5.29` como versión corregida.
4. Evaluar la actualización conjunta de Medusa a una versión compatible y
   corregida; los rangos informados sitúan la primera línea aparentemente no
   afectada en `2.22.3` o posterior. Confirmar compatibilidad de cada módulo
   antes de actualizar. Si se mantiene 2.21.2, evitar `npm audit fix` y
   overrides generales; validar cualquier override con Medusa.
5. Revisar mitigaciones/actualizaciones para PostCSS, GraphQL Tools,
   `follow-redirects`, Lodash y `fast-uri`; reejecutar `npm audit` y
   `npm audit --omit=dev` tras cualquier cambio.
6. Usar un limitador de analíticas compartido entre instancias y que no dependa
   únicamente del `session_id` suministrado por el cliente.
7. Validar `npm ci`, builds, typecheck, lint y smoke tests con Node 22.22+ en
   CI; no se instaló ni migró nada en esta revisión.

No se ejecutaron despliegues, migraciones, instalaciones ni actualizaciones.
