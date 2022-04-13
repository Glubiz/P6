const path = require('path');

const express = require('express');

const Controller = require('../controllers/api');

const router = express.Router();

//Pages
router.post('/addNode', Controller.addNode);
router.get('/Ping', Controller.Ping);
router.get('/validate', Controller.validate);
router.get('/sendData', Controller.sendData);


module.exports = router;
