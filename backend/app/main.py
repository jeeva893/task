from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import driver, close_driver
from .routes import router as api_router
import uvicorn

app = FastAPI(title='SkillGraph API')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(api_router, prefix=f"{settings.API_PREFIX}")


@app.get('/')
def root():
    return {'ok': True}


@app.get('/health')
def health():
    try:
        # quick driver check
        d = driver()
        with d.session() as s:
            s.run('RETURN 1')
        return {'status': 'ok'}
    except Exception as e:
        return {'status': 'db-unreachable', 'error': str(e)}


if __name__ == '__main__':
    uvicorn.run('backend.app.main:app', host='0.0.0.0', port=settings.BACKEND_PORT, reload=True)
