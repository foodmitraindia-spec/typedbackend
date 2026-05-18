const mysql = require('mysql2/promise');
const { URL } = require('url');
require('dotenv').config();

async function testConnection() {
  const dbOptions = ['u769690987_footmitra', 'u769690987_foodmitra'];
  const dbUrl = new URL(process.env.DATABASE_URL);
  
  for (const dbName of dbOptions) {
    console.log(`\nTesting connection with Database: ${dbName}...`);
    try {
      const connection = await mysql.createConnection({
        host: dbUrl.hostname,
        port: dbUrl.port ? parseInt(dbUrl.port, 10) : 3306,
        user: dbUrl.username,
        password: decodeURIComponent(dbUrl.password),
        database: dbName,
        connectTimeout: 5000
      });

      console.log(`🎉 SUCCESS! Connected to Database: ${dbName}`);
      const [tables] = await connection.query('SHOW TABLES');
      console.log('Tables found:');
      tables.forEach(t => console.log(' -', Object.values(t)[0]));
      
      await connection.end();
      return; // Stop if success
    } catch (err) {
      console.error(`❌ Failed for ${dbName}:`, err.message);
    }
  }
}

testConnection();
