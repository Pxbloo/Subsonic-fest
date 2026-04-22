# Compilar frontend (React + Vite)
FROM node:22-alpine AS frontend-builder

WORKDIR /app/frontend

# Copiar archivos de configuración
COPY frontend/package.json frontend/pnpm-lock.yaml ./

# Instalar pnpm y dependencias
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copiar código fuente del frontend
COPY frontend/src ./src
COPY frontend/index.html ./
COPY frontend/vite.config.js ./
COPY frontend/tailwind.config.js ./
COPY frontend/postcss.config.js ./
COPY frontend/eslint.config.js ./

# Build del frontend
RUN pnpm run build

# ============================================

# Runtime - Backend FastAPI + Frontend estático
FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias del sistema para Firebase/cryptography
RUN apt-get update && apt-get install -y --no-install-recommends gcc && rm -rf /var/lib/apt/lists/*

# Copiar requirements e instalar
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código del backend
COPY backend/app ./app
COPY backend/scripts ./scripts

# Copiar archivos estáticos compilados del frontend
COPY --from=frontend-builder /app/frontend/dist ./app/static

# Copiar serviceAccountKey.json
COPY backend/serviceAccountKey.json ./

# Copiar .env desde la raíz (opcional)
COPY .env* ./

ENV PYTHONUNBUFFERED=1

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/docs')" || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
