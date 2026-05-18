const { PrismaClient } = require('@prisma/client');
const { PrismaMariadb } = require('@prisma/adapter-mariadb');
const mariadb = require('mariadb');
const { URL } = require('url');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

async function clear() {
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

  try {
    console.log('🗑️ Clearing all data...');
    
    // Ordered deletion to avoid foreign key issues
    await prisma.orderItem.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.order.deleteMany();
    await prisma.menuItem.deleteMany();
    await prisma.category.deleteMany();
    await prisma.table.deleteMany();
    await prisma.user.deleteMany();
    await prisma.restaurant.deleteMany();

    console.log('✅ All data cleared successfully!');

    // Re-seed the SUPER ADMIN so the user can still log in
    const bcrypt = require('bcrypt');
    const superAdminPassword = await bcrypt.hash('superadmin123', 10);
    
    console.log('🔑 Re-seeding Super Admin...');
    await prisma.user.create({
      data: {
        email: 'super@admin.com',
        name: 'Global Super Admin',
        password: superAdminPassword,
        role: 'SUPER_ADMIN',
      },
    });
    console.log('✅ Super Admin created: super@admin.com / superadmin123');

  } catch (err) {
    console.error('❌ Error clearing DB:', err);
  } finally {
    await prisma.$disconnect();
  }
}

clear();
