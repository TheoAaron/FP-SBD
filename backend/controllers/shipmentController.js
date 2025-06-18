const { pool } = require('../config/mysql');
const { v4: uuidv4 } = require('uuid');

// POST - Create new shipment detail
const createShipmentDetail = async (req, res) => {
  try {
    const { 
      first_name, 
      last_name, 
      street_address, 
      apartment_floor, 
      kota, 
      label, 
      phone_number, 
      email_address 
    } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !street_address || !kota || !phone_number || !email_address) {
      return res.status(400).json({ 
        message: 'First name, last name, street address, kota, phone number, and email address are required' 
      });
    }    const id_shipment = uuidv4();
    const id_user = req.user ? req.user.id : null; // Get user ID from auth middleware if available

    // Validate that user exists in database
    if (id_user) {
      const [userCheck] = await pool.query('SELECT id_user FROM users WHERE id_user = ?', [id_user]);
      if (userCheck.length === 0) {
        return res.status(400).json({ 
          message: 'Invalid user ID. User does not exist.' 
        });
      }
    }

    // Note: Using the existing model structure, some fields might need to be adapted
    const query = `
      INSERT INTO shipment_details 
      (id_shipment, id_user, first_name, last_name, street_address, apartment_floor, kota, label, no_telepon, email_address, createdAt, updatedAt) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    await pool.query(query, [
      id_shipment,
      id_user,
      first_name,
      last_name,
      street_address,
      apartment_floor || null,
      kota,
      label || null,
      phone_number,
      email_address
    ]);

    res.status(201).json({
      message: 'Shipment detail created successfully',
      data: {
        id_shipment,
        first_name,
        last_name,
        street_address,
        apartment_floor,
        kota,
        label,
        phone_number,
        email_address
      }
    });

  } catch (error) {
    console.error('Error creating shipment detail:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET - Get all shipment details for a user
const getShipmentDetails = async (req, res) => {
  try {
    const id_user = req.user ? req.user.id : null;

    if (!id_user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM shipment_details WHERE id_user = ? ORDER BY createdAt DESC',
      [id_user]
    );

    res.json({
      message: 'Shipment details retrieved successfully',
      data: rows
    });

  } catch (error) {
    console.error('Error getting shipment details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET - Get specific shipment detail by ID
const getShipmentDetailById = async (req, res) => {
  try {
    const { id } = req.params;
    const id_user = req.user ? req.user.id : null;

    const [rows] = await pool.query(
      'SELECT * FROM shipment_details WHERE id_shipment = ? AND id_user = ?',
      [id, id_user]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Shipment detail not found' });
    }

    res.json({
      message: 'Shipment detail retrieved successfully',
      data: rows[0]
    });

  } catch (error) {
    console.error('Error getting shipment detail:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE - Delete shipment detail
const deleteShipmentDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const id_user = req.user ? req.user.id : null;

    if (!id_user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if shipment detail exists and belongs to user
    const [rows] = await pool.query(
      'SELECT * FROM shipment_details WHERE id_shipment = ? AND id_user = ?',
      [id, id_user]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Shipment detail not found' });
    }

    // Delete the shipment detail
    await pool.query(
      'DELETE FROM shipment_details WHERE id_shipment = ? AND id_user = ?',
      [id, id_user]
    );

    res.json({
      message: 'Shipment detail deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting shipment detail:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createShipmentDetail,
  getShipmentDetails,
  getShipmentDetailById,
  deleteShipmentDetail
};
