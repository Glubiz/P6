const path = require('path');

const express = require('express');

const mainController = require('../controllers/main');

const router = express.Router();

//Pages
router.get('/', mainController.getIndex);
router.get('/Dashboard', mainController.getDashboard);
router.get('/Dev', mainController.getDev);

router.get('/about', mainController.getAbout);
router.get('/Admin', mainController.getAdmin);


module.exports = router;