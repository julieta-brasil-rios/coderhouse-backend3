# ShipNow API — Pre-entrega Módulo 1

Este es el refactor de la API de ShipNow que pasé de un solo archivo gigante
a una arquitectura por capas (Controller - Service - Repository). También le
agregué validación de variables de entorno para que la app no arranque si
falta algo importante.

## Cómo está organizado


src/
config/        -> acá se valida el .env y se conecta a Mongo
constants/     -> roles, estados de producto y códigos HTTP, todo centralizado
models/        -> los schemas de Mongoose, nada más
repositories/  -> lo único que habla con Mongoose directamente
services/      -> toda la lógica de negocio
controllers/   -> reciben el request y devuelven la respuesta
routes/        -> solo conectan la ruta con el controller
middlewares/   -> manejo de errores
server.js        -> arranca todo



La idea es que las cosas fluyan así: `Router -> Controller -> Service -> Repository`.
El Controller nunca toca Mongoose directamente, siempre le pregunta al Service.

## Cómo correrlo

1. Instalar dependencias:
```bash
npm install
```

2. Copiar el `.env.example` y completarlo con tus datos:
```bash
cp .env.example .env
```
Le tenés que poner el `PORT`, el `MONGODB_URI` (local o de Atlas) y `NODE_ENV`.

3. Levantar el server:
```bash
npm start
```

4. Para chequear que anda, entrás a `http://localhost:3000/health` y te
tiene que devolver que está todo ok.

## Endpoints

**Products**
- GET `/api/products` - lista todos
- GET `/api/products/:id` - uno solo
- POST `/api/products` - crea
- PUT `/api/products/:id` - edita
- DELETE `/api/products/:id` - borra

**Users**
- GET `/api/users` - lista todos
- POST `/api/users/register` - registra uno nuevo
- POST `/api/users/login` - login
- DELETE `/api/users/:id` - borra (solo un ADMIN puede)

## Por qué separé la lógica como la separé

Lo que traté de hacer fue que el Repository solo se ocupe de ir a buscar
o guardar datos en Mongo, sin pensar. Y que el Service sea el que decide
qué significan esos datos: por ejemplo, si un producto está "disponible"
no es solo un dato que está en la base, es una regla (que tenga stock y
que no esté descontinuado), y esa regla vive en el Service. Lo mismo con
los permisos: que solo un ADMIN pueda borrar algo es una decisión de
negocio, no algo que tenga que saber el Repository.

## Sobre la validación del .env

Si borrás `MONGODB_URI` del `.env` y tratás de levantar el server, no
arranca. Tira un error que te dice justo qué variable falta, antes de
siquiera intentar conectarse a la base. Eso está en `config/env.config.js`.