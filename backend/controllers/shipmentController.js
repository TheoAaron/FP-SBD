const { pool } = require('../config/mysql');
const { v4: uuidv4 } = require('uuid');

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
      kode_pos
    } = req.body;

    if (!first_name || !street_address || !kota || !phone_number) {
      return res.status(400).json({
        message: 'First name, street address, kota, and phone number are required'
      });
    }

    const id_shipment = uuidv4();
    const id_user = req.user ? req.user.id : null;

    if (id_user) {
      const [userCheck] = await pool.query('SELECT id_user FROM users WHERE id_user = ?', [id_user]);
      if (userCheck.length === 0) {
        return res.status(400).json({
          message: 'Invalid user ID. User does not exist.'
        });
      }
    }

    const query = `
      INSERT INTO shipment_details
      (id_shipment, id_user, first_name, street_address, kota, kode_pos, no_telepon, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    await pool.query(query, [
      id_shipment,
      id_user,
      first_name,
      street_address,
      kota,
      kode_pos || '',
      phone_number
    ]);

    const responseData = {
      id_shipment,
      first_name,
      last_name: last_name || '',
      street_address,
      apartment_floor: apartment_floor || '',
      kota,
      label: label || '',
      phone_number,
      kode_pos: kode_pos || ''
    };

    res.status(201).json({
      message: 'Shipment detail created successfully',
      data: responseData
    });

  } catch (error) {
    console.error('Error creating shipment detail:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

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

    const mappedRows = rows.map(row => ({
      id_shipment: row.id_shipment,
      first_name: row.first_name,
      last_name: row.last_name || '',
      street_address: row.street_address,
      apartment_floor: row.apartment_floor || '',
      kota: row.kota,
      label: row.label || '',
      phone_number: row.no_telepon,
      kode_pos: row.kode_pos || ''
    }));

    res.json({
      message: 'Shipment details retrieved successfully',
      data: mappedRows
    });

  } catch (error) {
    console.error('Error getting shipment details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

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

    const row = rows[0];

    const mappedData = {
      id_shipment: row.id_shipment,
      first_name: row.first_name,
      last_name: row.last_name || '',
      street_address: row.street_address,
      apartment_floor: row.apartment_floor || '',
      kota: row.kota,
      label: row.label || '',
      phone_number: row.no_telepon,
      kode_pos: row.kode_pos || ''
    };

    res.json({
      message: 'Shipment detail retrieved successfully',
      data: mappedData
    });

  } catch (error) {
    console.error('Error getting shipment detail:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteShipmentDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const id_user = req.user ? req.user.id : null;

    if (!id_user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM shipment_details WHERE id_shipment = ? AND id_user = ?',
      [id, id_user]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Shipment detail not found' });
    }

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
