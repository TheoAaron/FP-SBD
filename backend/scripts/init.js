

const { execSync } = require('child_process');
const mysql = require('mysql2/promise');
const mongoose = require('mongoose');
const path = require('path');

// Ambil config Sequelize
// Tentukan environment-nya. Jika NODE_ENV tidak ada, anggap 'development'.
const env = process.env.NODE_ENV || 'development';

// Ambil config Sequelize sesuai dengan environment yang aktif
const dbConfig = require('../config/config.js')[env];
const mongoUri = `mongodb+srv://Rozak:Rizkinass1@cluster0.hn1jbqx.mongodb.net/sbdjaya?retryWrites=true&w=majority&appName=Cluster01`;
const isDrop = process.env.npm_lifecycle_event === 'drop';

async function init() {
  // MYSQL
  const connection = await mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.username,
    password: dbConfig.password
  });

  if (isDrop) {
    // Drop MySQL
    execSync(`npx sequelize-cli db:drop --config "${path.resolve(__dirname, '../config/config.js')}"`, {
      stdio: 'inherit'
    });
    console.log(`🗑️  Dropped MySQL database '${dbConfig.database}'`);
  } else {
    // Create DB if not exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
    console.log(`✅ MySQL database '${dbConfig.database}' is ready.`);

    // Migrate
    const migrationsPath = path.resolve(__dirname, '../migrations');
    execSync(`npx sequelize-cli db:migrate --config "${path.resolve(__dirname, '../config/config.js')}" --migrations-path "${migrationsPath}"`, {
      stdio: 'inherit'
    });
    console.log('✅ Sequelize migration completed.');
  }
  await connection.end();

  // MongoDB
  await mongoose.connect(mongoUri);

  const db = mongoose.connection.db;

  if (isDrop) {
    await db.dropDatabase();
    console.log(`🗑️  Dropped MongoDB database '${dbConfig.database}'`);
    await mongoose.disconnect();
    return; // stop here if dropping
  }

  // Buat collection jika belum ada
  const collections = [
    {
      name: 'wishlist',
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['id_user', 'produk'],
          properties: {
            id_user: { bsonType: 'int' },
            produk: { bsonType: 'array', items: { bsonType: 'int' } }
          }
        }
      }
    },
    {
      name: 'cart',
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['id_user', 'produk'],
          properties: {
            id_user: { bsonType: 'int' },
            produk: {
              bsonType: 'array',
              items: {
                bsonType: 'object',
                required: ['product_id', 'qty'],
                properties: {
                  product_id: { bsonType: 'int' },
                  qty: { bsonType: 'int' }
                }
              }
            }
          }
        }
      }
    },
    {
      name: 'last_view',
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['id_user', 'produk'],
          properties: {
            id_user: { bsonType: 'int' },
            produk: { bsonType: 'array', items: { bsonType: 'int' } }
          }
        }
      }
    },
    {
      name: 'product_review',
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['id_produk', 'review'],
          properties: {
            id_produk: { bsonType: 'int' },
            review: {
              bsonType: 'array',
              items: {
                bsonType: 'object',
                required: ['user_id', 'rate', 'comment', 'date'],
                properties: {
                  user_id: { bsonType: 'int' },
                  rate: { bsonType: 'int' },
                  comment: { bsonType: 'string' },
                  date: { bsonType: 'date' }
                }
              }
            }
          }
        }
      }
    }
  ];

  const existingCollections = (await db.listCollections().toArray()).map(c => c.name);
  for (const col of collections) {
    if (!existingCollections.includes(col.name)) {
      await db.createCollection(col.name, { validator: col.validator });
      console.log(`✅ Created MongoDB collection '${col.name}'`);
    } else {
      console.log(`ℹ️ MongoDB collection '${col.name}' already exists`);
    }
  }

  await mongoose.disconnect();
  console.log('✅ MongoDB initialization done.');
}

init().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
