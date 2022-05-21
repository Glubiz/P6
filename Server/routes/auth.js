const path = require('path');

const express = require('express');

const Controller = require('../controllers/auth');

const router = express.Router();

//Pages
router.get('/Login', Controller.getLogin);
router.post('/Login', Controller.postLogin);

router.get('/Reset', Controller.getReset);

router.get('/User', Controller.getUser);

router.get('/Signup', Controller.getSignup);
router.post('/Signup', Controller.postSignup);

router.get('/Logout', Controller.getLogout);

router.get('/deleteUser', Controller.postDeleteUser);

router.post('/SavePassword', Controller.postChangePassword);

router.post('/AddBlock', Controller.postApprove);
router.post('/RejectBlock', Controller.postReject);

module.exports = router;
