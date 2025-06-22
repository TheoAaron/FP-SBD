const { pool } = require('../config/mysql');
const { v4: uuidv4 } = require('uuid');

// POST - Create new coupon
const createCoupon = async (req, res) => {
  try {
    console.log('📝 Request body:', req.body);
    const { kode_kupon, expire_date, expired_at, status, diskon } = req.body;
    
    // Support both expire_date and expired_at field names
    const expireDateValue = expired_at || expire_date;

    // Validasi input
    if (!kode_kupon || !expireDateValue || !diskon) {
      console.log('❌ Validation error: Missing required fields');
      return res.status(400).json({
        error: 'Kode kupon, tanggal kadaluwarsa, dan diskon harus diisi'
      });
    }

    // Validasi diskon (0-100)
    if (diskon < 0 || diskon > 100) {
      console.log('❌ Validation error: Invalid discount range');
      return res.status(400).json({
        error: 'Diskon harus antara 0-100 persen'
      });
    }

    // Validasi tanggal kadaluwarsa
    const expireDate = new Date(expireDateValue);
    const currentDate = new Date();
    console.log('📅 Expire date:', expireDate, 'Current date:', currentDate);
    
    if (expireDate <= currentDate) {
      console.log('❌ Validation error: Past expiry date');
      return res.status(400).json({
        error: 'Tanggal kadaluwarsa harus lebih dari tanggal sekarang'
      });
    }

    // Cek apakah kode kupon sudah ada
    console.log('🔍 Checking existing coupon with code:', kode_kupon);
    const [existingCoupons] = await pool.query(
      'SELECT id_kupon FROM coupons WHERE kode_kupon = ?',
      [kode_kupon]
    );

    if (existingCoupons.length > 0) {
      console.log('❌ Coupon code already exists');
      return res.status(409).json({
        error: 'Kode kupon sudah ada, gunakan kode yang berbeda'
      });
    }

    // Buat kupon baru
    console.log('✅ Creating new coupon...');
    const id_kupon = uuidv4();
    const currentDateTime = new Date();
    
    await pool.query(
      'INSERT INTO coupons (id_kupon, kode_kupon, expired_at, status, diskon, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id_kupon, kode_kupon, expireDate, status || 'active', parseFloat(diskon), currentDateTime, currentDateTime]
    );

    // Ambil data kupon yang baru dibuat
    const [newCouponRows] = await pool.query(
      'SELECT * FROM coupons WHERE id_kupon = ?',
      [id_kupon]
    );

    console.log('✅ Coupon created successfully:', newCouponRows[0]);
    
    res.status(201).json({
      message: 'Kupon berhasil dibuat',
      data: newCouponRows[0]
    });

  } catch (error) {
    console.error('❌ Error creating coupon:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({
      error: 'Terjadi kesalahan saat membuat kupon',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// DELETE - Delete coupon by ID
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    // Validasi ID
    if (!id) {
      return res.status(400).json({
        error: 'ID kupon harus disediakan'
      });
    }

    // Cari kupon berdasarkan ID
    const [couponRows] = await pool.query(
      'SELECT id_kupon FROM coupons WHERE id_kupon = ?',
      [id]
    );

    if (couponRows.length === 0) {
      return res.status(404).json({
        error: 'Kupon tidak ditemukan'
      });
    }

    // Hapus kupon
    await pool.query(
      'DELETE FROM coupons WHERE id_kupon = ?',
      [id]
    );

    res.status(200).json({
      message: 'Kupon berhasil dihapus',
      data: { id_kupon: id }
    });

  } catch (error) {
    console.error('Error deleting coupon:', error);
    res.status(500).json({
      error: 'Terjadi kesalahan saat menghapus kupon'
    });
  }
};

// GET - Get all coupons
const getAllCoupons = async (req, res) => {
  try {
    const [coupons] = await pool.query(
      'SELECT * FROM coupons ORDER BY createdAt DESC'
    );

    res.status(200).json({
      message: 'Berhasil mengambil data kupon',
      data: coupons
    });

  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({
      error: 'Terjadi kesalahan saat mengambil data kupon'
    });
  }
};

// GET - Get coupon by ID
const getCouponById = async (req, res) => {
  try {
    const { kode_kupon } = req.params;

    const [couponRows] = await pool.query(
      'SELECT * FROM coupons WHERE id_kupon = ?',
      [kode_kupon]
    );

    if (couponRows.length === 0) {
      return res.status(404).json({
        error: 'Kupon tidak ditemukan'
      });
    }

    res.status(200).json({
      message: 'Berhasil mengambil data kupon',
      data: couponRows[0]
    });

  } catch (error) {
    console.error('Error fetching coupon:', error);
    res.status(500).json({
      error: 'Terjadi kesalahan saat mengambil data kupon'
    });
  }
};

// PUT - Update existing coupon
const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { kode_kupon, expired_at, expire_date, status, diskon } = req.body;

    // Support both expired_at and expire_date field names
    const expiredAtValue = expired_at || expire_date;

    // Validasi input
    if (!kode_kupon || !expiredAtValue || !diskon) {
      return res.status(400).json({
        error: 'Kode kupon, tanggal kadaluwarsa, dan diskon harus diisi'
      });
    }

    // Validasi diskon (0-100)
    if (diskon < 0 || diskon > 100) {
      return res.status(400).json({
        error: 'Diskon harus antara 0-100 persen'
      });
    }

    // Cari coupon yang akan diupdate
    const [existingCouponRows] = await pool.query(
      'SELECT id_kupon FROM coupons WHERE id_kupon = ?',
      [id]
    );

    if (existingCouponRows.length === 0) {
      return res.status(404).json({
        error: 'Kupon tidak ditemukan'
      });
    }

    // Cek apakah kode kupon sudah digunakan oleh coupon lain
    const [duplicateCoupons] = await pool.query(
      'SELECT id_kupon FROM coupons WHERE kode_kupon = ? AND id_kupon != ?',
      [kode_kupon, id]
    );

    if (duplicateCoupons.length > 0) {
      return res.status(409).json({
        error: 'Kode kupon sudah digunakan oleh kupon lain'
      });
    }

    // Update coupon
    const currentDateTime = new Date();
    const [updateResult] = await pool.query(
      'UPDATE coupons SET kode_kupon = ?, expired_at = ?, status = ?, diskon = ?, updatedAt = ? WHERE id_kupon = ?',
      [kode_kupon, new Date(expiredAtValue), status || 'active', parseFloat(diskon), currentDateTime, id]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({
        error: 'Kupon tidak ditemukan atau tidak ada perubahan'
      });
    }

    // Ambil data coupon yang sudah diupdate
    const [updatedCouponRows] = await pool.query(
      'SELECT * FROM coupons WHERE id_kupon = ?',
      [id]
    );

    res.status(200).json({
      message: 'Kupon berhasil diperbarui',
      coupon: updatedCouponRows[0]
    });

  } catch (error) {
    console.error('Error updating coupon:', error);
    res.status(500).json({
      error: 'Terjadi kesalahan saat memperbarui kupon'
    });
  }
};

// POST - Validate and apply coupon (bonus feature)
const validateCoupon = async (req, res) => {
  try {
    const { kode_kupon } = req.body;

    if (!kode_kupon) {
      return res.status(400).json({
        error: 'Kode kupon harus disediakan'
      });
    }

    const [couponRows] = await pool.query(
      'SELECT * FROM coupons WHERE kode_kupon = ? AND status = "active"',
      [kode_kupon]
    );

    if (couponRows.length === 0) {
      return res.status(404).json({
        error: 'Kupon tidak ditemukan atau tidak aktif'
      });
    }

    const coupon = couponRows[0];
    const currentDate = new Date();
    const expiredDate = new Date(coupon.expired_at);

    if (expiredDate <= currentDate) {
      return res.status(400).json({
        error: 'Kupon sudah kadaluwarsa'
      });
    }

    res.status(200).json({
      message: 'Kupon valid',
      data: {
        id_kupon: coupon.id_kupon,
        kode_kupon: coupon.kode_kupon,
        diskon: coupon.diskon,
        expired_at: coupon.expired_at
      }
    });

  } catch (error) {
    console.error('Error validating coupon:', error);
    res.status(500).json({
      error: 'Terjadi kesalahan saat memvalidasi kupon'
    });
  }
};

module.exports = {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  validateCoupon
};