#!/usr/bin/env node

/**
 * Script untuk sync review data dari MongoDB ke MySQL
 * Usage: node scripts/sync-reviews.js
 */

// Load environment variables first
require('dotenv').config();

const { syncReviewsFromMongoToMySQL } = require('../utils/syncReviews');
const { connectDB } = require('../config/mongo');
const { pool } = require('../config/mysql');

async function main() {
    console.log('🚀 Starting review synchronization...');
    
    try {
        // Connect to databases
        console.log('📡 Connecting to databases...');
        await connectDB();
        
        // Test MySQL connection
        await pool.query('SELECT 1');
        console.log('✅ Database connections established');
        
        // Run sync
        const result = await syncReviewsFromMongoToMySQL();
        
        if (result.success) {
            console.log(`🎉 Sync completed successfully!`);
            console.log(`📊 Results: ${result.syncedCount} products synced, ${result.errorCount} errors`);
        } else {
            console.error('❌ Sync failed:', result.error);
            process.exit(1);
        }
        
    } catch (error) {
        console.error('💥 Fatal error:', error);
        process.exit(1);
    } finally {
        // Close connections
        try {
            await pool.end();
            console.log('🔒 Database connections closed');
        } catch (error) {
            console.error('Error closing connections:', error);
        }
        process.exit(0);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = main;
