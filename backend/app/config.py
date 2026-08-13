from pydantic_settings import BaseSettings
import os


class Settings(BaseSettings):
    COGNODB_URI: str
    COGNODB_USERNAME: str = 'cognodb'
    COGNODB_PASSWORD: str
    BACKEND_PORT: int = 8000
    API_PREFIX: str = '/api'

    class Config:
        # Look for .env in backend directory (works from any working directory)
        env_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')


settings = Settings()
