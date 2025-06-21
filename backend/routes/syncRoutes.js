const express = require("express");
const router = express.Router();
const { syncReviewsFromMongoToMySQL, syncSingleProductReview } = require("../utils/syncReviews");
const authMiddleware = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/admin");

// Sync all reviews (admin only)
router.post("/sync/all", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        console.log(`Admin ${req.user.username} initiated full review sync`);
        const result = await syncReviewsFromMongoToMySQL();
        
        if (result.success) {
            res.json({
                message: "Review sync completed successfully",
                syncedCount: result.syncedCount,
                errorCount: result.errorCount
            });
        } else {
            res.status(500).json({
                message: "Review sync failed",
                error: result.error
            });
        }
    } catch (error) {
        console.error("Error in sync all reviews:", error);
        res.status(500).json({
            message: "Internal server error during sync",
            error: error.message
        });
    }
});

// Sync single product reviews (admin only)
router.post("/sync/:id_produk", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id_produk } = req.params;
        console.log(`Admin ${req.user.username} initiated sync for product ${id_produk}`);
        
        const { totalReviews, avgRating } = await syncSingleProductReview(id_produk);
        
        res.json({
            message: `Product ${id_produk} reviews synced successfully`,
            id_produk,
            totalReviews,
            avgRating: parseFloat(avgRating.toFixed(2))
        });
    } catch (error) {
        console.error(`Error syncing product ${req.params.id_produk}:`, error);
        res.status(500).json({
            message: "Failed to sync product reviews",
            error: error.message
        });
    }
});

module.exports = router;
