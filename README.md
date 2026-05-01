## Subsonic Festival

Aplicación full‑stack para la gestión de festivales de música:

- Backend: API REST con FastAPI (Python) + Firebase/Firestore.
- Frontend: SPA en React con TailwindCSS y autenticación con Firebase Auth.

Este README describe cómo levantar el proyecto en local y cómo se conectan las dos partes.

---

## Configuración global

El proyecto usa un único fichero `.env` en la raíz del repositorio. No se usan ficheros `.env` dentro de `frontend/` ni `backend/`.

Configuración mínima:

```env
DATA_BACKEND=firebase
FIREBASE_CREDENTIALS=backend/serviceAccountKey.json
FRONTEND_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_xxx
VITE_API_URL=/api
PYTHONUNBUFFERED=1
```

En producción, `FRONTEND_URL` debe apuntar al dominio público, por ejemplo:

```env
FRONTEND_URL=http://subsonic-festival-l1g4.duckdns.org
```

`VITE_API_URL=/api` permite que el frontend use la misma URL base que la web desplegada. En desarrollo, Vite redirige `/api` al backend local mediante proxy.

---

## Requisitos previos

- Python 3.11+ (recomendado) y `pip`.
- Node.js 18+ y `npm`.
- Cuenta de Firebase con el fichero de credenciales de servicio (service account) en `backend/serviceAccountKey.json` si vas a usar modo `firebase`.

---

## Backend (FastAPI)

Código en `backend/`.

1. Ir a la carpeta del backend:

   ```bash
   cd backend
   ```

2. (Opcional pero recomendado) Crear entorno virtual:

   ```bash
   python -m venv .venv
   ```

3. Activar el entorno virtual (Windows):

   ```bash
   .\.venv\Scripts\activate
   ```

4. Instalar dependencias:

   ```bash
   pip install -r requirements.txt
   ```

5. Crear/editar el `.env` de la raíz del proyecto.

   Opciones de `DATA_BACKEND`:
   - `firebase`: usa Firestore y requiere `serviceAccountKey.json` válido.
   - `fake`: guarda pedidos en `backend/app/data/order_items.json`.

6. Lanzar el servidor de desarrollo:

   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

7. Endpoints útiles:
   - API base: `http://localhost:8000/api`
   - Documentación interactiva (Swagger): `http://localhost:8000/docs`

---

## Frontend (React)

Código en `frontend/`.

El frontend consume la API del backend a través de `frontend/src/config/api.js`, que lee `VITE_API_URL` desde el `.env` de la raíz.

```js
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "/api";
```

La configuración recomendada es:

```env
VITE_API_URL=/api
```

En desarrollo, `frontend/vite.config.js` incluye un proxy para enviar `/api` a `http://localhost:8000`.

1. Ir a la carpeta del frontend:

   ```bash
   cd frontend
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Lanzar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

4. Abrir el navegador en:
   - `http://localhost:5173`

---

## Flujo típico de desarrollo

En dos terminales distintas:

1. **Terminal 1 (backend)**
   - `cd backend`
   - Activar entorno virtual.
   - `pip install -r requirements.txt` (solo la primera vez).
   - Revisar el `.env` de la raíz.
   - `uvicorn app.main:app --reload --port 8000`.

2. **Terminal 2 (frontend)**
   - `cd frontend`
   - `npm install` (solo la primera vez).
   - `npm run dev`.

## De esta forma el frontend se servirá en `http://localhost:5173` y se comunicará con la API del backend en `http://localhost:8000/api`.

---

## Docker

El Dockerfile está en `Docker/Dockerfile`, pero el contexto de build debe ser la raíz del proyecto:

```bash
docker build -f Docker/Dockerfile -t pablofr4/subsonic-festival:latest .
```

Para ejecutar el contenedor usando el `.env` global:

```bash
docker run -d \
  -p 80:8000 \
  --name subsonic-festival \
  --restart unless-stopped \
  --env-file .env \
  pablofr4/subsonic-festival:latest
```

## Notas

- La autenticación de usuarios se gestiona con Firebase Auth en el frontend y se valida en el backend a través de tokens de Firebase.
- Los datos de dominio (usuarios, festivales, artistas, blog, merchandising, etc.) se almacenan en Firestore.

---

## Anexo Stripe de entrega

- La integración se ejecuta exclusivamente con claves de prueba: `sk_test_...` en backend y `pk_test_...` en frontend.
- Tarjetas de prueba recomendadas para evaluar el flujo:
  - `4242 4242 4242 4242` para un pago correcto.
  - `4000 0000 0000 9995` para simular fondos insuficientes.
  - `4000 0025 0000 3155` para simular autenticación 3D Secure si hace falta.
- El proyecto usa Checkout Sessions alojadas por Stripe y confirma el pago de forma síncrona al volver a la web.
- No se han configurado webhooks ni Stripe CLI; el retorno a `/checkout/success` activa la confirmación directa en backend.
