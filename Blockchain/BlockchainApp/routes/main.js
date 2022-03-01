const path = require('path');

const express = require('express');

const mainController = require('../controllers/main');

const router = express.Router();

//Pages
router.get('/', mainController.getIndex);
router.get('/about', mainController.getAbout);

module.exports = router;
