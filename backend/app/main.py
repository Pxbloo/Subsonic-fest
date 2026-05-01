import os
from pathlib import Path

import firebase_admin
import stripe
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from firebase_admin import credentials

from .controller.controller import router


APP_DIR = Path(__file__).resolve().parent
BACKEND_DIR = APP_DIR.parent
PROJECT_DIR = BACKEND_DIR.parent


def _load_environment() -> None:
    env_path = PROJECT_DIR / ".env"
    if env_path.exists():
        load_dotenv(env_path)


def _first_existing_path(*paths: Path) -> Path | None:
    return next((path for path in paths if path.exists()), None)


_load_environment()


def _initialize_firebase() -> None:
    credential_candidates = []
    if os.getenv("FIREBASE_CREDENTIALS"):
        credential_candidates.append(Path(os.environ["FIREBASE_CREDENTIALS"]))

    credential_candidates.extend(
        [
            BACKEND_DIR / "serviceAccountKey.json",
            PROJECT_DIR / "serviceAccountKey.json",
        ]
    )
    cred_path = _first_existing_path(
        *credential_candidates,
    )
    if cred_path and not firebase_admin._apps:
        firebase_admin.initialize_app(credentials.Certificate(str(cred_path)))


_initialize_firebase()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")

app.include_router(router)

static_dir = _first_existing_path(
    APP_DIR / "static",
    PROJECT_DIR / "frontend" / "dist",
)
if static_dir:
    assets_dir = static_dir / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_frontend(full_path: str):
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="Not Found")

        requested_path = static_dir / full_path
        if requested_path.is_file():
            return FileResponse(requested_path)

        return FileResponse(static_dir / "index.html")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
