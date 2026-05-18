const mariadb = require('mariadb');
const { URL } = require('url');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

async function check() {
  const dbUrl = new URL(process.env.DATABASE_URL);
  const pool = mariadb.createPool({ 
    host: dbUrl.hostname, 
    port: dbUrl.port ? parseInt(dbUrl.port, 10) : 3306, 
    user: dbUrl.username, 
    password: decodeURIComponent(dbUrl.password), 
    database: dbUrl.pathname.substring(1) 
  });

  try {
    const res = await pool.query('SELECT COUNT(*) as count FROM `Order`');
    console.log('Orders in DB:', res[0].count);
    const sum = await pool.query('SELECT SUM(finalAmount) as sum FROM `Order` WHERE status = \'COMPLETED\'');
    console.log('Total Revenue:', sum[0].sum);
  } catch (err) {
    console.error('Error checking DB:', err);
  } finally {
    await pool.end();
  }
}

check();
