const { PrismaClient } = require('@prisma/client');
const { PrismaMariadb } = require('@prisma/adapter-mariadb');
const mariadb = require('mariadb');
const { URL } = require('url');
require('dotenv').config();

const dbUrl = new URL(process.env.DATABASE_URL);
const pool = mariadb.createPool({ 
  host: dbUrl.hostname, 
  port: dbUrl.port ? parseInt(dbUrl.port, 10) : 3306, 
  user: dbUrl.username, 
  password: decodeURIComponent(dbUrl.password), 
  database: dbUrl.pathname.substring(1) 
});
const adapter = new PrismaMariadb(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const restaurants = await prisma.restaurant.findMany({ include: { _count: true } });
    const tables = await prisma.table.count();
    const categories = await prisma.category.count();
    const menuItems = await prisma.menuItem.count();
    const users = await prisma.user.count();

    console.log('--- DB STATUS ---');
    console.log(`Restaurants: ${restaurants.length}`);
    restaurants.forEach(r => {
      console.log(` - ${r.name} (ID: ${r.id})`);
    });
    console.log(`Tables: ${tables}`);
    console.log(`Categories: ${categories}`);
    console.log(`Menu Items: ${menuItems}`);
    console.log(`Users: ${users}`);
    console.log('-----------------');
  } catch (err) {
    console.error('Error querying DB:', err);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
