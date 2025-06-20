const { getDB } = require("../config/mongo");
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'APINGANTENG';

// Mendapatkan lastView pengguna berdasarkan user id
const getLastViewByUser = async (req, res) => {
  try {
    const db = getDB();
    // Ambil userId dari query atau body
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ message: "id_user wajib diisi" });
    }
    const lastView = await db.collection("last_view").findOne({ id_user: userId });
    if (!lastView) {
      return res.status(404).json({ message: "Data lastView tidak ditemukan" });
    }
    res.json({ lastView });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil lastView", error });
  }
};

// Buat helper function untuk operasi delete
// Helper function untuk operasi delete
const removeProductFromLastView = async (userId, produkId) => {
  try {
    const db = getDB();
    const result = await db.collection("last_view").updateOne(
      { id_user: userId },
      { $pull: { produk: produkId } }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    throw error;
  }
}

const addLastView = async (req, res) => {
  try {
    const db = getDB();
    const { produk } = req.body;
    const id_user = req.user.id;

    if (!id_user || !produk) {
      return res.status(400).json({ message: "id_user dan id_produk wajib diisi" });
    }

    // Pastikan produk dalam bentuk array untuk konsistensi
    const produkArray = Array.isArray(produk) ? produk : [produk];

    // Hapus produk dari lastView dulu kalau sudah ada (supaya bisa dipindah ke urutan pertama)
    for (const p of produkArray) {
      await removeProductFromLastView(id_user, p);
    }

    // Cek apakah user sudah memiliki lastView
    const existingLastView = await db.collection("last_view").findOne({ id_user });

    if (existingLastView) {
      // Tambahkan ke urutan pertama menggunakan $push dengan $position: 0
      await db.collection("last_view").updateOne(
        { id_user },
        { 
          $push: { 
            produk: { 
              $each: produkArray,
              $position: 0  // Tambahkan di posisi pertama (index 0)
            } 
          } 
        }
      );
    } else {
      // Buat lastView baru jika belum ada
      await db.collection("last_view").insertOne({
        id_user,
        produk: produkArray
      });
    }

    res.json({ message: "LastView berhasil ditambahkan/diupdate" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambahkan/mengupdate lastView", error });
  }
}

// Fungsi deleteLastView untuk endpoint
const deleteLastView = async (req, res) => {
  try {
    const userId = req.user.id;
    const { produk_id } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: "id_user wajib diisi" });
    }

    if (!produk_id) {
      return res.status(400).json({ message: "produk_id wajib diisi" });
    }

    const success = await removeProductFromLastView(userId, produk_id);

    if (!success) {
      return res.status(404).json({ message: "Data produk tidak ditemukan atau sudah tidak ada di lastView" });
    }

    res.json({ message: "Produk berhasil dihapus dari lastView" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus produk dari lastView", error });
  }
}
module.exports = { getLastViewByUser, addLastView };
