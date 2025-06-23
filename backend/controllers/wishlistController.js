const { getDB } = require("../config/mongo.js");

async function getWishlist(req, res) {
  try {
    console.log('=== GET WISHLIST ===');
    console.log('User from auth:', req.user);

    if (!req.user || !req.user.id) {
      console.log('Authentication issue: req.user not properly set');
      return res.status(401).json({ message: "Authentication required - user ID not found in token" });
    }

    const userId = req.user.id;
    console.log('Getting wishlist for user ID:', userId);

    const db = getDB();

    if (!db) {
      console.error('Failed to connect to MongoDB');
      return res.status(500).json({
        error: 'Database connection failed',
        details: 'Could not establish MongoDB connection'
      });
    }

    const wishlistCollection = db.collection('wishlist');

    const userWishlist = await wishlistCollection.findOne({ id_user: userId });

    if (!userWishlist) {
      console.log('No wishlist found for user');
      return res.status(200).json({
        success: true,
        message: "Wishlist retrieved successfully",
        wishlist: {
          id_user: userId,
          produk: []
        }
      });
    }

    console.log('Wishlist found:', userWishlist);
    const wishlistData = {
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
    console.log('User ID from token:', userId, 'Type:', typeof userId);

    const { product_id } = req.body;

    if (!product_id) {
      console.log('Validation error: product_id is missing');
      return res.status(400).json({
        error: 'product_id is required',
        details: 'Request body must contain a product_id field',
        received_body: req.body
      });
    }

    const productId = String(product_id);
    console.log('Adding product to wishlist:', { userId: userId, productId: productId });

    const db = getDB();

    if (!db) {
      console.error('Failed to connect to MongoDB');
      return res.status(500).json({
        error: 'Database connection failed',
        details: 'Could not establish MongoDB connection'
      });
    }

    const wishlistCollection = db.collection('wishlist');
    const existingWishlist = await wishlistCollection.findOne({ id_user: userId });

    if (existingWishlist) {
      const productExists = existingWishlist.produk.includes(productId);

      if (productExists) {
        return res.status(400).json({
          success: false,
          message: "Product already exists in wishlist"
        });
      }

      const result = await wishlistCollection.updateOne(
        { id_user: userId },
        {
          $push: {
            produk: productId
          }
        }
      );

      console.log('Product added to existing wishlist:', result);
    } else {
      const newWishlist = {
        id_user: userId,
        produk: [productId]
      };

      const result = await wishlistCollection.insertOne(newWishlist);
      console.log('New wishlist created:', result);
    }

    const updatedWishlist = await wishlistCollection.findOne({ id_user: userId });

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
    }

    const userId = req.user.id;
    const { product_id } = req.params;

    if (!product_id) {
      return res.status(400).json({
        error: 'product_id is required'
      });
    }

    const productId = String(product_id);
    console.log('Removing product from wishlist:', { userId, productId });

    const db = getDB();

    if (!db) {
      console.error('Failed to connect to MongoDB');
      return res.status(500).json({
        error: 'Database connection failed',
        details: 'Could not establish MongoDB connection'
      });
    }

    const wishlistCollection = db.collection('wishlist');
    const existingWishlist = await wishlistCollection.findOne({ id_user: userId });

    if (!existingWishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found"
      });
    }

    const productExists = existingWishlist.produk.includes(productId);

    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found in wishlist"
      });
    }

    const result = await wishlistCollection.updateOne(
      { id_user: userId },
      {
        $pull: {
          produk: productId
        }
      }
    );

    console.log('Product removed from wishlist:', result);
    const updatedWishlist = await wishlistCollection.findOne({ id_user: userId });

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
