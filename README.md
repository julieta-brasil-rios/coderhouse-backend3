# ShipNow API — Arquitectura por Capas

Refactor de la API monolítica de ShipNow a una arquitectura profesional
**Controller → Service → Repository**, con configuración de entorno
validada al arranque y constantes de dominio centralizadas.

## Estructura

```
src/
  config/         # Validación y exportación de variables de entorno
  constants/      # Roles, estados y códigos HTTP (Object.freeze)
  models/         # Esquemas de Mongoose (sin lógica de negocio)
  repositories/    # Único lugar que conoce Mongoose/MongoDB
  services/       # Lógica de negocio
  controllers/    # Única puerta de entrada HTTP
  routes/         # Solo conectan path -> método del Controller
  middlewares/    # Manejo centralizado de errores
  utils/          # ApiError y otros helpers
server.js         # Punto de entrada: valida env, conecta Mongo, levanta server
```

Flujo de dependencias: `Router → Controller → Service → Repository → Mongoose`.
El Controller **nunca** importa Mongoose directamente; si necesita datos,
se los pide al Service.

## Cómo correr el proyecto localmente

1. Clonar el repo e instalar dependencias:
   ```bash
   git clone <url-del-repo>
   cd shipnow-api
   npm install
   ```

2. Crear el archivo `.env` a partir del ejemplo:
   ```bash
   cp .env.example .env
   ```
   Completar `PORT`, `MONGODB_URI` (por ejemplo `mongodb://localhost:27017/shipnow`
   o tu connection string de Atlas) y `NODE_ENV=development`.

3. Levantar el servidor:
   ```bash
   npm run dev   # con nodemon
   # o
   npm start
   ```

4. Probar que está vivo: `GET http://localhost:3000/health`

### Endpoints principales

| Método | Ruta                  | Descripción                     |
|--------|-----------------------|----------------------------------|
| GET    | /api/products         | Lista productos                 |
| GET    | /api/products/:id     | Detalle de un producto          |
| POST   | /api/products         | Crea un producto                |
| PUT    | /api/products/:id     | Actualiza un producto           |
| DELETE | /api/products/:id     | Borra (soft delete) un producto |
| GET    | /api/users            | Lista usuarios                  |
| POST   | /api/users/register   | Registra un usuario             |
| POST   | /api/users/login      | Login                           |
| DELETE | /api/users/:id        | Borra un usuario (solo ADMIN)   |

### Robustez de la configuración

Si borrás `MONGODB_URI` (o cualquier variable crítica) del `.env`, la
app **no arranca**: `src/config/env.config.js` valida las variables
requeridas apenas se importa, y lanza un error descriptivo antes de que
`server.js` intente conectar a Mongo o levantar el puerto.


