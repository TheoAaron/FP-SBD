const { execSync } = require('child_process');
const { connectMongo } = require('../config/mongo');
const { seedReviews } = require('../seeders/seed-reviews-mongo');
const { migrateReviewStructure } = require('./migrate-reviews');

async function setupComplete() {
  try {
    console.log('🚀 Starting complete database setup...');


    console.log('\n📊 Step 1: Initializing databases...');
    execSync('npm run migrate', { stdio: 'inherit' });


    console.log('\n🌱 Step 2: Seeding MySQL data...');
    execSync('npm run seed', { stdio: 'inherit' });


    console.log('\n🍃 Step 3: Connecting to MongoDB...');
    await connectMongo();


    console.log('\n🔄 Step 4: Migrating existing MongoDB reviews...');
    await migrateReviewStructure();


    console.log('\n📝 Step 5: Seeding MongoDB reviews...');
    await seedReviews();

    console.log('\n🎉 Complete database setup finished successfully!');
    console.log('\n📋 Summary:');
    console.log('   ✅ MySQL database initialized and seeded');
    console.log('   ✅ MongoDB collections created');
    console.log('   ✅ Review structure migrated to new format');
    console.log('   ✅ Sample reviews added to MongoDB');
    console.log('\n🚀 You can now start the server with: npm start');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.error('\n💡 Please check:');
    console.error('   - MySQL server is running');
    console.error('   - MongoDB server is running');
    console.error('   - Database credentials in .env are correct');
    process.exit(1);
  }
}

if (require.main === module) {
  setupComplete()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('❌ Setup script failed:', error);
      process.exit(1);
    });
}

module.exports = { setupComplete };

