import pytest
import os
from dotenv import load_dotenv

# Load .env for test environment
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
