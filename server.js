require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getDriver } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const driver = getDriver();

app.get('/api/health', async (req, res) => {
  try {
    const session = driver.session();
    await session.executeRead(() => 'OK');
    await session.close();
    res.json({ status: 'ok' });
  } catch (err) {
    console.error('DB unreachable', err.message);
    res.status(503).json({ status: 'db-unreachable', message: err.message });
  }
});

// Get movies for an actor (parameterised query)
app.get('/api/actors/:name/movies', async (req, res) => {
  const name = req.params.name;
  const session = driver.session();
  try {
    const result = await session.executeRead(tx =>
      tx.run(
        'MATCH (p:Person {name: $name})-[:ACTED_IN]->(m:Movie) RETURN m.title AS title, m.year AS year',
        { name }
      )
    );
    const movies = result.records.map(r => ({ title: r.get('title'), year: r.get('year') }));
    res.json({ actor: name, movies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    await session.close();
  }
});

// Recommend movies for a person using a multi-hop traversal: friends' favourite movies and co-actors
app.get('/api/recommendations/:person', async (req, res) => {
  const person = req.params.person;
  const session = driver.session();
  try {
    const cypher = `
      MATCH (me:Person {name: $person})-[:FRIEND]->(f:Person)-[:ACTED_IN]->(m:Movie)
      OPTIONAL MATCH (m)<-[:ACTED_IN]-(co:Person)
      WHERE co <> f AND co <> me
      RETURN m.title AS title, m.year AS year, collect(DISTINCT co.name)[0..5] AS coActors, count(*) AS score
      ORDER BY score DESC, m.year DESC
      LIMIT 20
    `;
    const result = await session.executeRead(tx => tx.run(cypher, { person }));
    const recs = result.records.map(r => ({ title: r.get('title'), year: r.get('year'), coActors: r.get('coActors'), score: r.get('score').toNumber ? r.get('score').toNumber() : r.get('score') }));
    res.json({ person, recommendations: recs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    await session.close();
  }
});

// Simple search across movies and people
app.get('/api/search', async (req, res) => {
  const q = req.query.q || '';
  const session = driver.session();
  try {
    const result = await session.executeRead(tx => tx.run(
      'CALL {\n        MATCH (m:Movie) WHERE toLower(m.title) CONTAINS toLower($q) RETURN "Movie" AS type, m.title AS label, id(m) AS id LIMIT 10\n        UNION\n        MATCH (p:Person) WHERE toLower(p.name) CONTAINS toLower($q) RETURN "Person" AS type, p.name AS label, id(p) AS id LIMIT 10\n      } RETURN type, label, id', { q }
    ));
    const items = result.records.map(r => ({ type: r.get('type'), label: r.get('label'), id: r.get('id').toNumber ? r.get('id').toNumber() : r.get('id') }));
    res.json({ q, items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    await session.close();
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
