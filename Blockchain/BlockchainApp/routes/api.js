const path = require('path');

const express = require('express');

const Controller = require('../controllers/api');

const router = express.Router();

//Endpoints

//POST
router.post('/addNode', Controller.addNode);
router.post('/fetchEventHash', Controller.addNode);

//GET
router.post('/Ping', Controller.Ping);
router.get('/validate', Controller.validate);


module.exports = router;
