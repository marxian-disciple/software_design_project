const express = require('express');	
const router = express.Router();
const{
    getLogin,
    postLogin,
    getRegistrationPage,
    postRegistrationPage
} = require('../controllers/authController');

router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/register', getRegistrationPage);
router.post('/register', postRegistrationPage);

module.exports = router;
