const path = require('path');

const express = require('express');

const Controller = require('../controllers/api');

const router = express.Router();

//Endpoints

//POST
router.post('/addNode', Controller.addNode);
router.post('/fetchEventHash', Controller.fetchEventHash);
router.post('/fetchTruncatedChain', Controller.fetchTruncatedChain);
router.post('/Ping', Controller.Ping);
router.post('/Validators', Controller.fetchValidatorList);



//GET


module.exports = router;
