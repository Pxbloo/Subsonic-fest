## Subsonic Festival

Aplicación full‑stack para la gestión de festivales de música:

- Backend: API REST con FastAPI (Python) + Firebase/Firestore.
- Frontend: SPA en React con TailwindCSS y autenticación con Firebase Auth.

Este README describe cómo levantar el proyecto en local y cómo se conectan las dos partes.

---

## Requisitos previos

- Python 3.11+ (recomendado) y `pip`.
- Node.js 18+ y `npm`.
- Cuenta de Firebase con el fichero de credenciales de servicio (service account) ya configurado en `backend/serviceAccountKey.json`.

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

5. Lanzar el servidor de desarrollo:

   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

6. Endpoints útiles:
   - API base: `http://localhost:8000/api`
   - Documentación interactiva (Swagger): `http://localhost:8000/docs`

---

## Frontend (React)

Código en `frontend/`.

El frontend consume la API del backend a través de `frontend/src/config/api.js`, que por defecto apunta a:

```js
const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";
```

Si no defines ninguna variable de entorno, usará `http://localhost:8000/api`.

1. Ir a la carpeta del frontend:

   ```bash
   cd frontend
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. (Opcional) Crear un fichero `.env` en `frontend/` para configurar la URL de la API:

   ```bash
   VITE_API_URL=http://localhost:8000/api
   ```

4. Lanzar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

5. Abrir el navegador en:
   - `http://localhost:5173`

---

## Flujo típico de desarrollo

En dos terminales distintas:

1. **Terminal 1 (backend)**
   - `cd backend`
   - Activar entorno virtual.
   - `pip install -r requirements.txt` (solo la primera vez).
   - `uvicorn app.main:app --reload --port 8000`.

2. **Terminal 2 (frontend)**
   - `cd frontend`
   - `npm install` (solo la primera vez).
   - `npm run dev`.

De esta forma el frontend se servirá en `http://localhost:5173` y se comunicará con la API del backend en `http://localhost:8000/api`.

---

## Notas

- La autenticación de usuarios se gestiona con Firebase Auth en el frontend y se valida en el backend a través de tokens de Firebase.
- Los datos de dominio (usuarios, festivales, artistas, blog, merchandising, etc.) se almacenan en Firestore.
