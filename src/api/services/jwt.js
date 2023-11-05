const jwt = require('jsonwebtoken');
require('dotenv').config();
// const { refershToken } = require('../controllers/jwt');

module.exports = {
    signAccessToken: async (payload) => new Promise((resolve, reject) => {
        const secret = process.env.SECRET_ACCESS_TOKEN;
        const options = {
            expiresIn: '1h',
        };
        jwt.sign(payload, secret, options, (err, token) => {
            if (err) { reject(err); }
            resolve(token);
        });
    }),

    signRefreshToken: (payload) => new Promise((resolve, reject) => {
        const secret = process.env.SECRET_REFRESH_TOKEN;
        const options = {
            expiresIn: '30 days',
        };
        jwt.sign(payload, secret, options, (err, token) => {
            if (err) { reject(err); }
            resolve(token);
        });
    }),
};
