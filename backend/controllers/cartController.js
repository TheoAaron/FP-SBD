const { getDB } = require("../config/mongo.js");
const getCart = async (req, res) => {
    const db = getDB();
    const userId = req.user.id;

    try {
        const cart = await db.collection("cart").findOne({ user_id: userId });
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
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
        return res.status(400).json({ message: "Product ID and quantity are required" });
    }

    try {
        const cart = await db.collection("cart").findOneAndUpdate(
            { id_user: userId },
            { $push: { produk: { product_id, quantity } } },
            { upsert: true, returnDocument: 'after' }
        );
        res.status(201).json(cart.value);
    } catch (error) {
        res.status(500).json({ message: "Failed to add to cart", error });
    }
}
const deleteFromCart = async (req, res) => {
    const db = getDB();
    const userId = req.user.id;
    const { product_id } = req.body;

    if (!product_id) {
        return res.status(400).json({ message: "Product ID is required" });
    }

    try {
        const cart = await db.collection("cart").findOneAndUpdate(
            { user_id: userId },
            { $pull: { items: { product_id } } },
            { returnDocument: 'after' }
        );
        if (!cart.value) {
            return res.status(404).json({ message: "Cart not found" });
        }
        res.json(cart.value);
    } catch (error) {
        res.status(500).json({ message: "Failed to delete from cart", error });
    }
}

module.exports = { getCart, addToCart, deleteFromCart };