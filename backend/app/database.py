from neo4j import GraphDatabase
from .config import settings
import logging

logger = logging.getLogger(__name__)


def get_driver():
    uri = settings.COGNODB_URI
    user = settings.COGNODB_USERNAME
    password = settings.COGNODB_PASSWORD
    try:
        driver = GraphDatabase.driver(uri, auth=(user, password))
        # test connectivity
        with driver.session() as session:
            session.run("RETURN 1")
        return driver
    except Exception as e:
        logger.error('Failed to create Neo4j driver: %s', e)
        raise


_driver = None


def driver():
    global _driver
    if _driver is None:
        _driver = get_driver()
    return _driver


def close_driver():
    global _driver
    if _driver is not None:
        _driver.close()
        _driver = None
