const path = require('path');

const express = require('express');

const mainController = require('../controllers/main');

const router = express.Router();

//Pages
router.get('/', mainController.getIndex);
router.get('/Dashboard', mainController.getDashboard);
router.get('/Dev', mainController.getDev);
router.get('/CreateArea', mainController.getCreateArea);
router.get('/about', mainController.getAbout);
router.get('/Admin', mainController.getAdmin);

//Actions
router.post('/CreateArea', mainController.postCreateArea);

module.exports = router;
