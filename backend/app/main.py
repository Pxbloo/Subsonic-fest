from fastapi import FastAPI
from model.model import SubsonicModel

app = FastAPI()
model = SubsonicModel()

@app.get("/api/festivals")
async def get_festivals():
    festivales = model.listar_festivales()
    return festivales 