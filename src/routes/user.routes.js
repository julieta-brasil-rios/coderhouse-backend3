const { Router } = require('express');
const userController = require('../controllers/user.controller');

const router = Router();

router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.delete('/:id', userController.remove);

module.exports = router;
