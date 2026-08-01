const { Router } = require('express');
const mockController = require('../controllers/mock.controller');

const router = Router();

// Preview: generan datos con forma real, NO se guardan en la base
router.get('/users', mockController.previewUsers);
router.get('/orders', mockController.previewOrders);
router.get('/deliveries', mockController.previewDeliveries);

// Seed: insertan en MongoDB de forma controlada (quedan marcados con isMock: true)
router.post('/seed', mockController.seed); 
router.post('/seed/:collection', mockController.seedCollection); 

module.exports = router;
