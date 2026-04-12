from fastapi import FastAPI
from .model.model import SubsonicModel
from fastapi import Header, HTTPException
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Puerto del frontend Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = SubsonicModel()

@app.get("/api/auth/verify")
async def verify_user(authorization: Optional[str] = Header(None)):
    """
    Endpoint para verificar la identidad del usuario mediante OAuth.
    Espera un token en la cabecera: 'Authorization: Bearer <token>'
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="No se proporcionó token de autorización")

    try:
        token = authorization.split(" ")[1]
    except IndexError:
        raise HTTPException(status_code=401, detail="Formato de token inválido")
    user = model.verificar_token_oauth(token)

    if not user:
        raise HTTPException(status_code=401, detail="Token inválido o usuario no encontrado")

    return user

@app.get("/api/festivals")
async def get_festivals():
    festivales = model.listar_festivales()
    return festivales 
