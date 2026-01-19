const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Load .env.local manually
const envPath = path.join(__dirname, '../../.env.local');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

async function runMigration() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT),
      multipleStatements: true,
    });

    console.log('Connected to database');
    
    const sql = fs.readFileSync(
      path.join(__dirname, 'create_materials_products.sql'),
      'utf8'
    );

    console.log('Running migration...');
    await connection.query(sql);
    
    console.log('✅ Migration completed successfully!');
    console.log('\nTables created:');
    console.log('  - materials (id, name, grades)');
    console.log('  - products (id, title, slug, material_id, ...)');
    console.log('  - product_pricing (id, product_id, material_id, grade, size, price)');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

runMigration();
