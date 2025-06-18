const { getDB } = require("../config/mongo.js");
const getCart = async (req, res) => {
    const db = getDB();
    const userId = req.user.id;

    try {
        const cart = await db.collection("cart").findOne({ id_user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve cart", error });
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

module.exports = { getCart, addToCart, updateCart };
