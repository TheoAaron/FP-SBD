const { getDB } = require("../config/mongo.js");
async function getWishlist(req, res) {
  try {
    console.log('=== GET WISHLIST ===');
    console.log('User from auth:', req.user);

    if (!req.user || !req.user.id) {
      console.log('Authentication issue: req.user not properly set');
      return res.status(401).json({ message: "Authentication required - user ID not found in token" });    }

    const userId = req.user.id;
    console.log('Getting wishlist for user ID:', userId);
    const userIdString = String(userId);

     const db = getDB(); 
    
    if (!db) {
      console.error('Failed to connect to MongoDB');
      return res.status(500).json({ 
        error: 'Database connection failed',
        details: 'Could not establish MongoDB connection'
      });
    }
    
    const wishlistCollection = db.collection('wishlist');

    const userWishlist = await wishlistCollection.findOne({ id_user: userIdString });

    if (!userWishlist) {
      console.log('No wishlist found for user');return res.status(200).json({
        success: true,
        message: "Wishlist retrieved successfully",
        wishlist: {
          id_user: userId,
          produk: []
        }
      });
    }

    console.log('Wishlist found:', userWishlist);    const wishlistData = {
      id_user: userWishlist.id_user,
      produk: userWishlist.produk || [],
      total_items: userWishlist.produk ? userWishlist.produk.length : 0
    };

    res.status(200).json({
      success: true,
      message: "Wishlist retrieved successfully",
      wishlist: wishlistData
    });

  } catch (error) {
    console.error('=== GET WISHLIST ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
}
async function addToWishlist(req, res) {
  try {
    console.log('=== ADD TO WISHLIST ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('User from auth:', req.user);
    if (!req.user || !req.user.id) {
      console.log('Authentication issue: req.user not properly set');
      return res.status(401).json({ message: "Authentication required - user ID not found in token" });
    }
    const userId = req.user.id;
    console.log('Raw user ID from token:', userId, 'Type:', typeof userId);

    const userIdString = String(userId);
    const { product_id } = req.body;

    if (!product_id && product_id !== 0) {
      console.log('Validation error: product_id is missing');
      return res.status(400).json({ 
        error: 'product_id is required',
        details: 'Request body must contain a product_id field',
        received_body: req.body
      });
    }

    if (isNaN(product_id)) {
      console.log('Validation error: product_id is not a number');
      return res.status(400).json({ 
        error: 'product_id must be a valid number',
        details: `Received: ${product_id} (type: ${typeof product_id})`,
        received_body: req.body
      });
    }    const productIdInt = parseInt(product_id);
    
    if (productIdInt <= 0) {
      console.log('Validation error: product_id must be positive');
      return res.status(400).json({ 
        error: 'product_id must be a positive number',
        details: `Received: ${productIdInt}`,
        received_body: req.body
      });
    }

    console.log('Adding product to wishlist:', { userId: userIdString, productIdInt });

     const db = getDB(); 
    
    if (!db) {
      console.error('Failed to connect to MongoDB');
      return res.status(500).json({ 
        error: 'Database connection failed',
        details: 'Could not establish MongoDB connection'
      });
    }
    
    const wishlistCollection = db.collection('wishlist');
    const existingWishlist = await wishlistCollection.findOne({ id_user: userIdString });

    if (existingWishlist) {
      const productExists = existingWishlist.produk.includes(productIdInt);

      if (productExists) {
        return res.status(400).json({
          success: false,
          message: "Product already exists in wishlist"
        });
      }
      const result = await wishlistCollection.updateOne(
        { id_user: userIdString },
        { 
          $push: { 
            produk: productIdInt
          } 
        }
      );

      console.log('Product added to existing wishlist:', result);
    } else {
      const newWishlist = {
        id_user: userIdString,
        produk: [productIdInt]
      };

      const result = await wishlistCollection.insertOne(newWishlist);
      console.log('New wishlist created:', result);
    }    // Get updated wishlist
    const updatedWishlist = await wishlistCollection.findOne({ id_user: userIdString });

    res.status(201).json({
      success: true,
      message: "Product added to wishlist successfully",
      wishlist: {
        id_user: updatedWishlist.id_user,
        produk: updatedWishlist.produk,
        total_items: updatedWishlist.produk.length
      }
    });

  } catch (error) {
    console.error('=== ADD TO WISHLIST ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
}

async function removeFromWishlist(req, res) {
  try {
    console.log('=== REMOVE FROM WISHLIST ===');
    console.log('Request params:', req.params);
    console.log('User from auth:', req.user);

    if (!req.user || !req.user.id) {
      console.log('Authentication issue: req.user not properly set');
      return res.status(401).json({ message: "Authentication required - user ID not found in token" });
    }    const userId = req.user.id;
    const { product_id } = req.params;
    const userIdString = String(userId);

    if (!product_id) {
      return res.status(400).json({ 
        error: 'product_id is required' 
      });
    }    const productIdInt = parseInt(product_id);
    console.log('Removing product from wishlist:', { userId, productIdInt });
    const db = getDB();
    
    if (!db) {
      console.error('Failed to connect to MongoDB');
      return res.status(500).json({ 
        error: 'Database connection failed',
        details: 'Could not establish MongoDB connection'
      });
    }
    
    const wishlistCollection = db.collection('wishlist');
    const existingWishlist = await wishlistCollection.findOne({ id_user: userIdString });

    if (!existingWishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found"
      });
    }

    const productExists = existingWishlist.produk.includes(productIdInt);

    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found in wishlist"
      });
    }
    const result = await wishlistCollection.updateOne(
      { id_user: userIdString },
      { 
        $pull: { 
          produk: productIdInt
        } 
      }
    );

    console.log('Product removed from wishlist:', result);
    const updatedWishlist = await wishlistCollection.findOne({ id_user: userIdString });

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist successfully",
      wishlist: {
        id_user: updatedWishlist.id_user,
        produk: updatedWishlist.produk,
        total_items: updatedWishlist.produk.length
      }
    });

  } catch (error) {
    console.error('=== REMOVE FROM WISHLIST ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
}

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
