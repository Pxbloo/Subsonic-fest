import os
from pathlib import Path

import firebase_admin
import stripe
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from firebase_admin import credentials

from .controller.controller import router 


BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR.parent / ".env")


def _initialize_firebase() -> None:
    cred_path = BASE_DIR.parent / "serviceAccountKey.json"
    if cred_path.exists() and not firebase_admin._apps:
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


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)