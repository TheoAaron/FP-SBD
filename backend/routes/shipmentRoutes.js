const express = require('express');
const router = express.Router();
const { 
  createShipmentDetail, 
  getShipmentDetails, 
  getShipmentDetailById, 
  deleteShipmentDetail 
} = require('../controllers/shipmentController');
const auth = require('../middlewares/auth'); // Assuming you have auth middleware

// POST /api/shipments - Create new shipment detail (no auth for testing)
router.post('/',auth, createShipmentDetail);

// GET /api/shipments - Get all shipment details for authenticated user
router.get('/', auth, getShipmentDetails);

// GET /api/shipments/:id - Get specific shipment detail by ID
router.get('/:id', auth, getShipmentDetailById);

// DELETE /api/shipments/:id - Delete shipment detail
router.delete('/:id', auth, deleteShipmentDetail);

module.exports = router;
