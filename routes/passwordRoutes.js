const express = require('express');
const router = express.Router();
const { generatePasswordGet, generatePasswordPost } = require('../controllers/passwordController');

router.get('/password', generatePasswordGet);

router.get('/password/:length', generatePasswordGet);

router.post('/password', generatePasswordPost);

module.exports = router;
