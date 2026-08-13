const neo4j = require('neo4j-driver');

function getDriver() {
  const uri = process.env.COGNODB_URI || process.env.NEO4J_URI;
  const user = process.env.COGNODB_USER || 'cognodb';
  const password = process.env.COGNODB_PASSWORD || process.env.NEO4J_PASSWORD;
  if (!uri || !password) {
    console.error('Missing CognoDB connection environment variables. See .env.example');
    throw new Error('Missing database configuration');
  }
  return neo4j.driver(uri, neo4j.auth.basic(user, password), { disableLosslessIntegers: true });
}

module.exports = { getDriver };
