const express = require('express');
const router = express.Router();
const {
  createShipmentDetail,
  getShipmentDetails,
  getShipmentDetailById,
  deleteShipmentDetail
} = require('../controllers/shipmentController');
const auth = require('../middlewares/auth');

router.post('/',auth, createShipmentDetail);

router.get('/', auth, getShipmentDetails);

router.get('/:id', auth, getShipmentDetailById);

router.delete('/:id', auth, deleteShipmentDetail);

module.exports = router;

