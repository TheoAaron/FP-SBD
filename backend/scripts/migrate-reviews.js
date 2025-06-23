const { MongoClient } = require('mongodb');
require('dotenv').config();

async function migrateReviewStructure() {
  const mongoUri = `${process.env.MONGODB_URI}${process.env.DB_NAME}`;
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('product_review');

    console.log('🚀 Starting review structure migration...');


    const oldDocs = await collection.find({}).toArray();
    console.log(`📋 Found ${oldDocs.length} documents to migrate`);

    let migratedCount = 0;

    for (const doc of oldDocs) {
      if (doc.review && Array.isArray(doc.review) && !doc.reviews) {

        const newDoc = {
          id_produk: doc.id_produk,
          total_review: doc.review.length,
          reviews: doc.review.map(review => ({
            id_user: review.id_user || 'unknown',
            username: review.username,
            rate: review.rate,
            comment: review.comment,
            date: review.date
          }))
        };


        await collection.replaceOne(
          { _id: doc._id },
          newDoc
        );

        console.log(`✅ Migrated product ${doc.id_produk}: ${doc.review.length} reviews`);
        migratedCount++;
      } else if (doc.reviews && Array.isArray(doc.reviews)) {
        console.log(`ℹ️  Product ${doc.id_produk} already has new structure`);
      }
    }

    console.log(`🎉 Review structure migration completed! Migrated ${migratedCount} documents`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await client.close();
  }
}

if (require.main === module) {
  migrateReviewStructure()
    .then(() => {
      console.log('✅ Migration script finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateReviewStructure };

