const express = require('express');

const router = express.Router();
const signUp = require('../controllers/signup');
const signIn = require('../controllers/signin');
const signOut = require('../controllers/signout');
const refreshToken = require('../controllers/refreshToken');

// public routes
// [POST] /sign-up
router.post('/sign-up', signUp);

// [POST] /sign-in
router.post('/sign-in', signIn);

// [POST] /sign-out
router.post('/sign-out', signOut);

// [POST] /refresh-token
router.post('/refresh-token', refreshToken);

module.exports = router;
