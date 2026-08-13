require('dotenv').config();
const { getDriver } = require('./db');

async function seed() {
  const driver = getDriver();
  const session = driver.session();
  try {
    console.log('Seeding sample movie graph...');
    // Clear small dataset (use with care)
    await session.executeWrite(tx => tx.run('MATCH (n) DETACH DELETE n'));

    // Create constraints
    await session.executeWrite(tx => tx.run('CREATE CONSTRAINT person_name IF NOT EXISTS FOR (p:Person) REQUIRE p.name IS UNIQUE'));
    await session.executeWrite(tx => tx.run('CREATE CONSTRAINT movie_title IF NOT EXISTS FOR (m:Movie) REQUIRE m.title IS UNIQUE'));

    // Sample data
    const people = [
      'Alice', 'Bob', 'Carol', 'Daniel', 'Eve', 'Frank'
    ];

    const movies = [
      { title: 'The Great Heist', year: 2018 },
      { title: 'Lost in Code', year: 2020 },
      { title: 'Graph Theory', year: 2022 },
      { title: 'Node Runner', year: 2019 }
    ];

    // Create people
    for (const name of people) {
      await session.executeWrite(tx => tx.run('CREATE (p:Person {name: $name})', { name }));
    }

    // Create movies
    for (const m of movies) {
      await session.executeWrite(tx => tx.run('CREATE (m:Movie {title: $title, year: $year})', m));
    }

    // Relationships: actors
    await session.executeWrite(tx => tx.run(
      `MATCH (a:Person {name: 'Alice'}), (m:Movie {title: 'Lost in Code'}) CREATE (a)-[:ACTED_IN]->(m)`
    ));
    await session.executeWrite(tx => tx.run(
      `MATCH (a:Person {name: 'Bob'}), (m:Movie {title: 'Lost in Code'}) CREATE (a)-[:ACTED_IN]->(m)`
    ));
    await session.executeWrite(tx => tx.run(
      `MATCH (a:Person {name: 'Carol'}), (m:Movie {title: 'The Great Heist'}) CREATE (a)-[:ACTED_IN]->(m)`
    ));
    await session.executeWrite(tx => tx.run(
      `MATCH (a:Person {name: 'Daniel'}), (m:Movie {title: 'Graph Theory'}) CREATE (a)-[:ACTED_IN]->(m)`
    ));
    await session.executeWrite(tx => tx.run(
      `MATCH (a:Person {name: 'Eve'}), (m:Movie {title: 'Graph Theory'}) CREATE (a)-[:ACTED_IN]->(m)`
    ));
    await session.executeWrite(tx => tx.run(
      `MATCH (a:Person {name: 'Frank'}), (m:Movie {title: 'Node Runner'}) CREATE (a)-[:ACTED_IN]->(m)`
    ));

    // Friend links
    await session.executeWrite(tx => tx.run(`MATCH (a:Person {name:'Alice'}), (b:Person {name:'Bob'}) CREATE (a)-[:FRIEND]->(b)`));
    await session.executeWrite(tx => tx.run(`MATCH (a:Person {name:'Bob'}), (b:Person {name:'Carol'}) CREATE (a)-[:FRIEND]->(b)`));
    await session.executeWrite(tx => tx.run(`MATCH (a:Person {name:'Carol'}), (b:Person {name:'Daniel'}) CREATE (a)-[:FRIEND]->(b)`));
    await session.executeWrite(tx => tx.run(`MATCH (a:Person {name:'Eve'}), (b:Person {name:'Frank'}) CREATE (a)-[:FRIEND]->(b)`));

    console.log('Seed complete.');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await session.close();
    await driver.close();
  }
}

seed();
