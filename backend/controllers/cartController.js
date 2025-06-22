const { getDB } = require("../config/mongo.js");
const { pool } = require("../config/mysql.js");
const getCart = async (req, res) => {
    const db = getDB();
    const userId = req.user.id;

    try {
        const cart = await db.collection("cart").findOne({ id_user: userId });
        
        if (!cart || !cart.produk || cart.produk.length === 0) {
            return res.json({ 
                id_user: userId,
                produk: []
            });
        }

        // Extract product IDs from cart
        const productIds = cart.produk.map(item => item.product_id);

        // Get product details from MySQL
        const [rows] = await pool.query(
            `SELECT id_produk, nama_produk, harga, image, stock FROM products WHERE id_produk IN (?)`, 
            [productIds]
        );

        // Merge cart data with product details
        const enrichedProduk = cart.produk.map(cartItem => {
            const productDetail = rows.find(product => product.id_produk === cartItem.product_id);
            return {
                product_id: cartItem.product_id,
                qty: cartItem.qty,
                name: productDetail?.nama_produk || `Product ${cartItem.product_id}`,
                price: productDetail?.harga || 0,
                image: productDetail?.image || null,
                stock: productDetail?.stock || 0
            };
        });

        res.json({
            _id: cart._id,
            id_user: cart.id_user,
            produk: enrichedProduk        });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ message: "Failed to retrieve cart", error: error.message });
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
        // Check if user already has a cart
        const existingCart = await db.collection("cart").findOne({ id_user: userId });
        
        if (existingCart) {
            // Check if product already exists in cart
            const productExists = existingCart.produk && existingCart.produk.some(item => item.product_id === product_id);
            
            if (productExists) {
                // Update existing product quantity using positional operator
                const updateResult = await db.collection("cart").findOneAndUpdate(
                    { 
                        id_user: userId,
                        "produk.product_id": product_id 
                    },
                    { 
                        $inc: { "produk.$.qty": qty } 
                    },
                    { returnDocument: 'after' }
                );
                return res.status(200).json({ message: "Product quantity updated", cart: updateResult.value });
            } else {
                // Add new product to existing cart
                const addResult = await db.collection("cart").findOneAndUpdate(
                    { id_user: userId },
                    { $push: { produk: { product_id, qty } } },
                    { returnDocument: 'after' }
                );
                return res.status(201).json({ message: "Product added to cart", cart: addResult.value });
            }
        } else {
            // Create new cart with first product
            const newCart = await db.collection("cart").insertOne({
                id_user: userId,
                produk: [{ product_id, qty }]
            });
            
            const createdCart = await db.collection("cart").findOne({ _id: newCart.insertedId });
            return res.status(201).json({ message: "New cart created with product", cart: createdCart });
        }
    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({ message: "Failed to add to cart", error: error.message });
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

// Helper function for internal use (without HTTP response)
const deleteCartByUserId = async (userId) => {
    const db = getDB();
    
    try {
        const result = await db.collection("cart").deleteOne({ id_user: userId });
        return { success: true, deletedCount: result.deletedCount };
    } catch (error) {
        console.error('Error deleting cart:', error);
        return { success: false, error: error.message };
    }
};

module.exports = { getCart, addToCart, updateCart, deleteCart, deleteCartByUserId };
