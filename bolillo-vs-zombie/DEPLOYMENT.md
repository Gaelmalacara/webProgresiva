# Guía urgente para la demo pública en Railway

Esta guía prepara una demo temporal y no constituye una configuración definitiva de producción. No despliegues desde este equipo, no conectes el backend a una base local y no reutilices secretos de desarrollo. Railway se configura manualmente desde su panel; los `railway.json` existentes no son necesarios para crear estos servicios.

## 1. Crear los servicios

1. Crea un proyecto en Railway y conéctalo al repositorio GitHub que contiene este monorepo. Selecciona la rama que quieres presentar.
2. Añade un servicio PostgreSQL y un servicio Redis desde Railway. No es necesario exponerlos a internet.
3. Añade dos servicios desde el mismo repositorio:
   - **Backend**: Root Directory `/bolillo-vs-zombie/apps/backend` no es adecuado para el lockfile raíz. Configura Root Directory como `/bolillo-vs-zombie` y usa los comandos workspace indicados abajo.
   - **Storefront**: Root Directory `/bolillo-vs-zombie`.
4. Genera un dominio público para cada servicio de aplicación desde **Settings → Networking → Generate Domain**. El backend necesita dominio para que el storefront pueda acceder a la API; el storefront necesita dominio para la presentación.

La raíz del monorepo npm y del `package-lock.json` es `bolillo-vs-zombie`. En ambos servicios de aplicación configura esa ruta como Root Directory. Así `npm ci` y los comandos `--workspace` usan el lockfile correcto.

La raíz del monorepo declara Node `>=22.22.0` y `npm@11.6.1`; no fuerces una versión anterior en Railway.

## 2. Comandos de Railway

En cada servicio de aplicación, configura los comandos desde **Settings → Build** y **Settings → Deploy**. Si Railway ofrece detección automática de npm, también puede instalar desde el lockfile raíz; para esta demo, el comando explícito de instalación conserva las dependencias de desarrollo necesarias durante la compilación.

### Backend (`@dtc/backend`)

| Ajuste | Valor |
|---|---|
| Root Directory | `/bolillo-vs-zombie` |
| Install Command | `npm ci --include=dev` |
| Build Command | `npm run build --workspace=@dtc/backend` |
| Pre-deploy Command | `npm run migrate --workspace=@dtc/backend` |
| Start Command | `npm run start --workspace=@dtc/backend` |
| Healthcheck Path (opcional) | `/health` |

El script `start` invoca el CLI oficial de Medusa 2.21.2 con `--host 0.0.0.0 --port $PORT`; si se ejecuta fuera de Railway, utiliza el puerto local 9000. No configures un puerto fijo en Railway. El `prestart` existente valida las variables de producción y falla explícitamente si falta alguna. Railway ejecuta las migraciones del comando Pre-deploy antes de iniciar cada nueva versión; si fallan, el deploy se detiene.

### Storefront (`@dtc/storefront`)

| Ajuste | Valor |
|---|---|
| Root Directory | `/bolillo-vs-zombie` |
| Install Command | `npm ci --include=dev` |
| Build Command | `npm run build --workspace=@dtc/storefront` |
| Start Command | `npm run start --workspace=@dtc/storefront` |
| Healthcheck Path (opcional) | `/opengraph-image.jpg` |

El servidor Next.js ya escucha en `0.0.0.0` y toma el puerto de `PORT`. Configura las variables `NEXT_PUBLIC_*` antes de compilar; Next las incorpora al build y cambiar una de ellas requiere una nueva compilación/deploy. El build genera `/opengraph-image.jpg`, y la ruta con extensión evita el middleware que consulta Medusa; úsala como healthcheck de proceso. Verifica manualmente `https://<dominio-storefront>/dk` para comprobar también la conexión con el backend.

No uses `/bolillo-vs-zombie/apps/backend` como raíz del servicio: npm necesita el `package-lock.json` del directorio superior. Si la interfaz de Railway no acepta una ruta que comienza con `/`, selecciona el directorio `bolillo-vs-zombie` en el selector.

## 3. Variables de entorno

Añádelas en **Variables** del servicio correspondiente. Las referencias entre servicios evitan copiar credenciales de base de datos. Usa el nombre exacto de servicio que Railway muestra en el selector de referencias (`Postgres`/`Redis` o el nombre que hayas asignado).

### Backend

| Variable | Valor/uso |
|---|---|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Referencia Railway: `${{Postgres.DATABASE_URL}}` |
| `REDIS_URL` | Referencia Railway: `${{Redis.REDIS_URL}}` |
| `JWT_SECRET` | Secreto aleatorio único para esta demo. |
| `COOKIE_SECRET` | Otro secreto aleatorio único; no reutilices `JWT_SECRET`. |
| `STORE_CORS` | Origen HTTPS público del storefront, sin `/` final. |
| `ADMIN_CORS` | Origen HTTPS del dominio del backend, sin `/` final. El Admin de Medusa se sirve desde el backend. |
| `AUTH_CORS` | Orígenes HTTPS del storefront y del backend, separados por comas y sin `/` final. |

Genera secretos nuevos en un gestor de contraseñas o con un generador criptográficamente seguro y guárdalos solo en Railway. No los incluyas en Git, mensajes, capturas ni documentos. Configura las tres variables CORS con los dominios públicos que Railway haya asignado; si cambian, actualízalas y reinicia/redeploya el backend.

PostgreSQL y Redis deben estar en el mismo proyecto Railway. Comprueba en la pantalla de variables que las referencias resuelvan a valores no vacíos antes del primer deploy del backend. Medusa usa `DATABASE_URL` y `REDIS_URL`; no hay que configurar Redis local o simulado en el servicio remoto.

### Storefront

| Variable | Valor/uso |
|---|---|
| `NODE_ENV` | `production` |
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | `https://<dominio-publico-del-backend>` sin `/` final ni `/health`. |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | Clave publicable creada por el seed inicial o en el Admin de Medusa. |
| `NEXT_PUBLIC_BASE_URL` | `https://<dominio-publico-del-storefront>` sin `/` final. |
| `NEXT_PUBLIC_DEFAULT_REGION` | `dk`, que pertenece a la región que crea el seed inicial. |

La clave publicable no es un secreto: el storefront necesita enviarla al API. No pongas aquí una clave `sk_` privada o secreta. Configura todas estas variables antes del build.

## 4. Orden de publicación

1. Genera ambos dominios públicos y configura las variables del backend, incluidos CORS y las referencias a PostgreSQL/Redis. Antes del primer deploy, confirma que `DATABASE_URL` y `REDIS_URL` referencian los servicios de Railway.
2. Despliega el backend. Railway ejecuta `npm run migrate --workspace=@dtc/backend` como Pre-deploy Command antes de iniciar Medusa. Revisa sus logs y confirma que el deploy esté activo y que `https://<dominio-backend>/health` devuelva HTTP 200. No ejecutes el comando de migración desde tu entorno local.
3. Para una base de datos **nueva y vacía**, abre una shell de Railway en el servicio backend y ejecuta el seed inicial una sola vez:

   ```sh
   cd apps/backend
   npx medusa exec ./src/migration-scripts/initial-data-seed.ts
   ```

   El seed crea canal de ventas, región europea, clave publicable asociada al canal, configuración de envío y productos de ejemplo. Incluye el proveedor `pp_system_default` para un checkout manual de demostración, sin Stripe ni cobros reales. No vuelvas a ejecutarlo en una base que ya tenga datos: no está pensado para repetirse y podría crear registros duplicados.

4. Si la demostración requiere más productos ficticios, el seed adicional es re-ejecutable y omite los handles demo existentes:

   ```sh
   cd apps/backend
   npx medusa exec ./src/scripts/seed-demo-products.ts
   ```

   Es opcional; ejecútalo solo en la base de Railway y después de revisar que el seed inicial terminó.

5. Crea el usuario administrativo en la shell del backend:

   ```sh
   cd apps/backend
   npx medusa user --email '<CORREO_ADMIN>' --password '<CONTRASEÑA_UNICA>'
   ```

   Sustituye los marcadores por credenciales nuevas; no uses las de archivos de ejemplo. Inicia sesión en `https://<dominio-backend>/app`.
6. En el Admin, copia la clave publicable del API key asociado al canal de ventas (o crea una nueva y vincúlala al canal). Configura `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` en el servicio storefront junto con las URLs y la región anteriores.
7. Despliega/redeploya el storefront. El build necesita que esas variables ya estén configuradas.

Si la instancia administrativa ya existía, no repitas el seed inicial ni la creación del usuario. Revisa primero las regiones, el canal de ventas, la clave publicable y los productos existentes.

## 5. Datos locales y privacidad

La opción más rápida y segura para la demo es usar una base PostgreSQL nueva de Railway y los datos ficticios del seed. No importes la base local por defecto: puede contener clientes, credenciales, pedidos o datos personales.

Si necesitas mostrar catálogo local, haz una copia de la base local, elimina/anónimiza en esa copia cualquier dato personal o secreto y exporta desde esa copia. No hagas el dump de la base original si contiene información privada. Desde una terminal confiable con las herramientas de PostgreSQL, define `LOCAL_DATABASE_URL` para la copia sanitizada y `RAILWAY_DATABASE_URL` para la base Railway nueva y vacía, y ejecuta:

```sh
pg_dump --format=custom --no-owner --no-acl "$LOCAL_DATABASE_URL" --file=bolillo-demo.dump
pg_restore --no-owner --no-acl --dbname="$RAILWAY_DATABASE_URL" bolillo-demo.dump
```

No agregues `--clean` o `--create`, y nunca uses el URL de Railway como origen del dump. Si restauras desde tu PC, Railway debe ofrecer una URL pública de conexión para la transferencia; protégela como credencial y no la publiques. Una restauración con tablas existentes puede fallar; no borres tablas para forzarla.

Esta importación debe hacerse **antes del primer deploy del backend**, mientras PostgreSQL Railway sigue vacío. Después despliega el backend para que el Pre-deploy aplique las migraciones y no ejecutes el seed inicial sobre la base importada. Si el backend ya migró la base, no restaures un dump completo encima: no borres ni reemplaces sus tablas.

## 6. Verificaciones para la presentación

1. Backend: `https://<dominio-backend>/health` responde 200.
2. Admin: `https://<dominio-backend>/app` carga y permite iniciar sesión.
3. Storefront: abre `https://<dominio-storefront>/dk`; la página carga sin errores de CORS ni errores de conexión al store API.
4. Catálogo: abre una categoría/listado, entra a un producto y confirma que precio, región y moneda se muestran.
5. Carrito: añade un producto y confirma que el carrito persiste al navegar.
6. Checkout: usa la opción **Manual Payment** (`pp_system_default`) para verificar el flujo de demo. No configures pagos reales ni completes una transacción de dinero.
7. Analíticas: confirma que el backend inicia sin errores de carga de módulos y que el módulo/página de analíticas aparece en Admin. La migración del módulo se aplica con `medusa db:migrate`; la página no tendrá datos hasta recibir eventos.
8. Si falla el frontend, comprueba los logs del backend y storefront, que el valor público del backend sea HTTPS y correcto, que la clave publishable pertenezca al canal y que `STORE_CORS` coincida exactamente con el origen del storefront.

## 7. Alcance y seguridad de la demo

- Los archivos `railway.json` permanecen en el repositorio, pero esta guía usa los comandos del panel para que los servicios nuevos no dependan de Config as Code.
- No despliegues migraciones a una base con datos que deban conservarse sin backup y revisión previa.
- Usa solo datos ficticios y evita capturar o compartir credenciales, URLs con credenciales o datos de clientes.
- No se configura Stripe ni otro proveedor de pago real.
- No se crea un servicio worker separado para esta demo. Si el backend presenta problemas de concurrencia o tareas largas, detén la publicación y revisa la arquitectura antes de añadir procesos.

## Fuentes oficiales consultadas

- [Railway: Railpack](https://docs.railway.com/builds/railpack)
- [Railway: Pre-deploy Command](https://docs.railway.com/deployments/pre-deploy-command)
- [Medusa: Custom CLI Scripts](https://docs.medusajs.com/learn/fundamentals/custom-cli-scripts)
