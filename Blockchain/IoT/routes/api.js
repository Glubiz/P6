const path = require('path');

const express = require('express');

const Controller = require('../controllers/api');

const router = express.Router();

//Pages
router.get('/api/get', Controller.get);

module.exports = router;
