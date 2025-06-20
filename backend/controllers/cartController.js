const { getDB } = require("../config/mongo.js");
const { pool } = require("../config/mysql.js");
const getCart = async (req, res) => {
    const db = getDB();
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ 
            success: false,
            message: "Unauthorized: User ID not found" 
        });
    }

    try {
        const cart = await db.collection("cart").findOne({ id_user: userId });
          if (!cart) {
            return res.status(404).json({ 
                success: false,
                message: "Cart not found" 
            });
        }

        // Extract product IDs from cart
        const productIds = cart.produk ? cart.produk.map(item => item.product_id) : [];
        
        if (productIds.length === 0) {
            return res.json({
                success: true,
                cart: cart
            }); // Return empty cart
        }// Get product details from MySQL
        const [rows] = await pool.query(
            `SELECT p.id_produk, p.nama_produk, p.harga, p.image, p.stock FROM products p WHERE p.id_produk IN (?)`, 
            [productIds]
        );

        // Merge cart data with product details
        const enrichedCart = {
            ...cart,
            produk: cart.produk.map(cartItem => {
                const productDetail = rows.find(product => product.id_produk === cartItem.product_id);
                return {
                    ...cartItem,
                    product_name: productDetail?.nama_produk || `Product ${cartItem.product_id}`,
                    price: productDetail?.harga || 0,
                    image: productDetail?.image || null,
                    stock: productDetail?.stock || 0
                };
            })
        };

        res.json({
            success: true,
            cart: enrichedCart
        });    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ 
            success: false,
            message: "Failed to retrieve cart", 
            error: error.message 
        });
    }
}
const addToCart = async (req, res) => {
    const db = getDB();
    const userId = req.user.id;
    const { product_id, qty } = req.body;

    if (!product_id || !qty) {
        return res.status(400).json({ message: "Product ID and qty are required" });
    }

    try {
        const cart = await db.collection("cart").findOneAndUpdate(
            { id_user: userId },
            { $push: { produk: { product_id, qty } } },
            { upsert: true, returnDocument: 'after' }
        );
        res.status(201).json(cart.value);
    } catch (error) {
        res.status(500).json({ message: "Failed to add to cart", error });
    }
}


const updateCart = async (req, res) => {
    const db = getDB();
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized: User ID not found" });
    }

    const produk = req.body.produk; 
    if (!Array.isArray(produk) || produk.length === 0) {
        return res.status(400).json({ message: "Produk array is required and cannot be empty" });
    }

    try {
        const result = await db.collection("cart").findOneAndUpdate(
            { id_user: userId },                 
            { $set: { produk: produk } },        
            { upsert: true, returnDocument: 'after' } 
        );

        if (!result) {
            return res.status(404).json({ message: "Cart not found" });
        }

        return res.status(200).json({ message: "Success Update Cart" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to update cart", error: error.message });
    }
};

const deleteCart = async (req, res) => {
    const db = getDB();
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized: User ID not found" });
    }

    try {
        const result = await db.collection("cart").deleteOne({ id_user: userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Cart not found" });
        }

        return res.status(200).json({ message: "Cart deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to delete cart", error: error.message });
    }
};

// Utility function for internal use by other controllers
const clearUserCart = async (userId) => {
    const db = getDB();
    
    try {
        const result = await db.collection("cart").deleteOne({ id_user: userId });
        return { success: true, deletedCount: result.deletedCount };
    } catch (error) {
        console.error('Error clearing user cart:', error);
        return { success: false, error: error.message };
    }
};

module.exports = { getCart, addToCart, updateCart, deleteCart, clearUserCart };
