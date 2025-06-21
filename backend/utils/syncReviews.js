const { getDB } = require("../config/mongo");
const { pool } = require("../config/mysql");

/**
 * Sync review data from MongoDB to MySQL
 * Updates total_review and avg_rating in products table
 */
const syncReviewsFromMongoToMySQL = async () => {
    console.log('🔄 Starting review sync from MongoDB to MySQL...');
    
    try {
        const db = getDB();
        
        // Get all products from MySQL
        const [products] = await pool.query('SELECT id_produk FROM products');
        console.log(`📊 Found ${products.length} products to sync`);
        
        let syncedCount = 0;
        let errorCount = 0;
        
        for (const product of products) {
            const id_produk = product.id_produk.toString();
            
            try {
                // Get reviews from MongoDB for this product
                const productReviews = await db.collection("product_review").findOne({ id_produk });
                
                let totalReviews = 0;
                let avgRating = 0;
                
                if (productReviews && productReviews.review && Array.isArray(productReviews.review)) {
                    totalReviews = productReviews.review.length;
                    
                    if (totalReviews > 0) {
                        const totalRating = productReviews.review.reduce((sum, review) => {
                            return sum + (review.rate || 0);
                        }, 0);
                        avgRating = totalRating / totalReviews;
                    }
                }
                
                // Update MySQL with calculated values
                await pool.query(
                    'UPDATE products SET total_review = ?, avg_rating = ? WHERE id_produk = ?',
                    [totalReviews, avgRating, id_produk]
                );
                
                if (totalReviews > 0) {
                    console.log(`✅ Product ${id_produk}: ${totalReviews} reviews, avg rating: ${avgRating.toFixed(2)}`);
                }
                
                syncedCount++;
            } catch (productError) {
                console.error(`❌ Error syncing product ${id_produk}:`, productError);
                errorCount++;
            }
        }
        
        console.log(`🎉 Sync completed! Synced: ${syncedCount}, Errors: ${errorCount}`);
        return { success: true, syncedCount, errorCount };
        
    } catch (error) {
        console.error('💥 Fatal error during sync:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Sync reviews for a specific product
 */
const syncSingleProductReview = async (id_produk) => {
    console.log(`🔄 Syncing reviews for product ${id_produk}...`);
    
    try {
        const db = getDB();
        
        // Get reviews from MongoDB for this product
        const productReviews = await db.collection("product_review").findOne({ 
            id_produk: id_produk.toString() 
        });
        
        let totalReviews = 0;
        let avgRating = 0;
        
        if (productReviews && productReviews.review && Array.isArray(productReviews.review)) {
            totalReviews = productReviews.review.length;
            
            if (totalReviews > 0) {
                const totalRating = productReviews.review.reduce((sum, review) => {
                    return sum + (review.rate || 0);
                }, 0);
                avgRating = totalRating / totalReviews;
            }
        }
        
        // Update MySQL
        await pool.query(
            'UPDATE products SET total_review = ?, avg_rating = ? WHERE id_produk = ?',
            [totalReviews, avgRating, id_produk]
        );
        
        console.log(`✅ Product ${id_produk} synced: ${totalReviews} reviews, avg rating: ${avgRating.toFixed(2)}`);
        return { totalReviews, avgRating };
        
    } catch (error) {
        console.error(`❌ Error syncing product ${id_produk}:`, error);
        throw error;
    }
};

module.exports = {
    syncReviewsFromMongoToMySQL,
    syncSingleProductReview
};
