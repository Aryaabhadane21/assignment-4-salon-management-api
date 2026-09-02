const express = require('express');
const router = express.Router();
const salonController = require('../controllers/salonController');
const serviceController = require('../controllers/serviceController');
const authMiddleware = require('../middleware/authMiddleware');

// Bonus routes (must be defined before /:id to avoid conflict)
router.get('/top', salonController.getTopSalons);
router.get('/city/:city', salonController.getSalonsByCity);

// Public routes
router.get('/', salonController.getAllSalons);
router.get('/:id', salonController.getSalonById);

// Protected routes
router.post('/', authMiddleware, salonController.createSalon);
router.put('/:id', authMiddleware, salonController.updateSalon);
router.delete('/:id', authMiddleware, salonController.deleteSalon);

// Service routes nested under salons
router.get('/:id/services', serviceController.getServicesBySalon);
router.post('/:id/services', authMiddleware, serviceController.createService);

module.exports = router;
