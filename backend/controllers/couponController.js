const Coupon = require('../models/Coupon');
const { v4: uuidv4 } = require('uuid');

// POST - Create new coupon
const createCoupon = async (req, res) => {
  try {    console.log('📝 Request body:', req.body);
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
    }    // Validasi tanggal kadaluwarsa
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
    const existingCoupon = await Coupon.findOne({
      where: { kode_kupon }
    });

    if (existingCoupon) {
      console.log('❌ Coupon code already exists');
      return res.status(409).json({
        error: 'Kode kupon sudah ada, gunakan kode yang berbeda'
      });
    }    // Buat kupon baru
    console.log('✅ Creating new coupon...');
    const newCoupon = await Coupon.create({
      id_kupon: uuidv4(),
      kode_kupon,
      expired_at: expireDate,
      status: status || 'active',
      diskon: parseFloat(diskon)
    });console.log('✅ Coupon created successfully:', newCoupon.toJSON());
    
    res.status(201).json({
      message: 'Kupon berhasil dibuat',
      data: newCoupon
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
    const coupon = await Coupon.findOne({
      where: { id_kupon: id }
    });

    if (!coupon) {
      return res.status(404).json({
        error: 'Kupon tidak ditemukan'
      });
    }

    // Hapus kupon
    await Coupon.destroy({
      where: { id_kupon: id }
    });

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

// GET - Get all coupons (bonus untuk testing)
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.findAll({
      order: [['createdAt', 'DESC']]
    });

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

// GET - Get coupon by ID (bonus untuk testing)
const getCouponById = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findOne({
      where: { id_kupon: id }
    });

    if (!coupon) {
      return res.status(404).json({
        error: 'Kupon tidak ditemukan'
      });
    }

    res.status(200).json({
      message: 'Berhasil mengambil data kupon',
      data: coupon
    });

  } catch (error) {
    console.error('Error fetching coupon:', error);
    res.status(500).json({
      error: 'Terjadi kesalahan saat mengambil data kupon'
    });
  }
};

module.exports = {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCouponById
};