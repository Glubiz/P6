const path = require('path');

const express = require('express');

const Controller = require('../controllers/api');

const router = express.Router();

//Pages
router.post('/Data', Controller.postData);
router.get('/Data', Controller.getData);

router.post('/addme', Controller.addMe);
router.get('/sendData', Controller.sendData);


module.exports = router;
