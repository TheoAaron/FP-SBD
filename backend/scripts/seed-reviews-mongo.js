const { getDB } = require("../config/mongo");

async function seedReviews(db = null) {
  try {

    const database = db || getDB();
    const collection = database.collection("product_review");

    console.log('🌱 Starting MongoDB product_review seeding...');


    const existingCount = await collection.countDocuments();
    if (existingCount > 0) {
      console.log(`ℹ️  Found ${existingCount} existing reviews, skipping seeding`);
      console.log('💡 Use "npm run drop && npm run setup" to reset all data');
      return;
    }


    const reviewData = [
      {
        id_produk: "1",
        total_review: 3,
        reviews: [
          {
            id_user: "1",
            username: "john_doe",
            rate: 5,
            comment: "Amazing phone! The camera quality is outstanding and the performance is top-notch.",
            date: new Date('2025-06-15')
          },
          {
            id_user: "2",
            username: "jane_smith",
            rate: 4,
            comment: "Great phone overall, but the battery could be better. Love the design though!",
            date: new Date('2025-06-16')
          },
          {
            id_user: "3",
            username: "tech_lover",
            rate: 5,
            comment: "Best iPhone ever! The A16 chip is incredibly fast and the display is gorgeous.",
            date: new Date('2025-06-17')
          }
        ]
      },
      {
        id_produk: "2",
        total_review: 2,
        reviews: [
          {
            id_user: "1",
            username: "john_doe",
            rate: 5,
            comment: "Perfect for development work. The M2 chip is a beast and battery life is amazing.",
            date: new Date('2025-06-18')
          },
          {
            id_user: "4",
            username: "developer_pro",
            rate: 4,
            comment: "Excellent laptop for coding. Only wish it had more ports, but performance is stellar.",
            date: new Date('2025-06-19')
          }
        ]
      },
      {
        id_produk: "3",
        total_review: 2,
        reviews: [
          {
            id_user: "2",
            username: "jane_smith",
            rate: 4,
            comment: "Great tablet for drawing and note-taking. The Apple Pencil support is excellent.",
            date: new Date('2025-06-20')
          },
          {
            id_user: "5",
            username: "artist_designer",
            rate: 5,
            comment: "As a digital artist, this iPad is perfect. The display colors are accurate and responsive.",
            date: new Date('2025-06-21')
          }
        ]
      },
      {
        id_produk: "4",
        total_review: 1,
        reviews: [
          {
            id_user: "3",
            username: "tech_lover",
            rate: 4,
            comment: "Good smartwatch with excellent health tracking. Battery lasts all day with moderate use.",
            date: new Date('2025-06-22')
          }
        ]
      },
      {
        id_produk: "5",
        total_review: 2,
        reviews: [
          {
            id_user: "4",
            username: "developer_pro",
            rate: 5,
            comment: "Best noise canceling earbuds I've ever used. Perfect for focus work and calls.",
            date: new Date('2025-06-14')
          },
          {
            id_user: "1",
            username: "john_doe",
            rate: 4,
            comment: "Great sound quality and the noise cancellation is impressive. Comfortable fit.",
            date: new Date('2025-06-13')
          }
        ]
      }
    ];


    const result = await collection.insertMany(reviewData);
    console.log(`✅ Successfully seeded ${result.insertedCount} product reviews`);


    for (const review of reviewData) {
      const avgRating = review.reviews.reduce((sum, r) => sum + r.rate, 0) / review.reviews.length;
      console.log(`   📱 Product ${review.id_produk}: ${review.total_review} reviews, avg rating: ${avgRating.toFixed(1)}/5`);
    }

    console.log('🎉 MongoDB review seeding completed!');

  } catch (error) {
    console.error('❌ Error seeding reviews:', error);
    throw error;
  }
}

module.exports = { seedReviews };

if (require.main === module) {
  const { connectMongo } = require("../config/mongo");

  const runSeeder = async () => {
    try {
      await connectMongo();
      await seedReviews();
      process.exit(0);
    } catch (error) {
      console.error('❌ Seeder failed:', error);
      process.exit(1);
    }
  };

  runSeeder();
}

