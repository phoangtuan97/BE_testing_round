const express = require('express');

const router = express.Router();
const signUp = require('../controllers/signup');
const signIn = require('../controllers/signin');

// [POST] /sign-up
router.post('/sign-up', signUp);

// [POST] /sign-in
router.post('/sign-in', signIn);

module.exports = router;
