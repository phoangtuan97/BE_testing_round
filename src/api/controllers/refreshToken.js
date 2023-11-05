require('dotenv').config();
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const {
    getTokenBy, deleteAllTokenByUserId, createToken, deleteToken,
} = require('../models/token');

const { signAccessToken, signRefreshToken } = require('../services/jwt');

/*
pseudocode
1   if req.cookies.refreshToken exist then do
2       clear refreshToken in cookies
3       if this refreshToken not exist in 'tokens' table then do
4           verify refreshToken to get payload(hackedToken case)
5           delete all tokens by payload.userId
6           return forbidden error
7       else
8           verify refreshToken to get payload
9           if token is valid then do(rotateToken case)
10              sign new accessToken and refreshToken
11              delete old refreshToken
12              store new refreshToken to db
13              set cookies again
14          endif
15      endif
16  endif
*/

// eslint-disable-next-line consistent-return
const handleRefreshToken = async (req, res, next) => {
    const { cookies } = req;
    if (!cookies?.refreshToken) return next(createError.Unauthorized());
    const { refreshToken } = cookies;
    res.clearCookie('refreshToken');
    try {
        const foundToken = await getTokenBy({ refreshToken });
        // To detect reuse token
        if (foundToken.length === 0) {
            jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN, async (err, payload) => {
                if (err) return next(createError.Forbidden());
                await deleteAllTokenByUserId({ userId: payload.userId });
                return next(createError.Forbidden());
            });
        }
        // To check whether refresh token is still valid, then rotate token
        // add new token and delete old token(invalidate refreshToken)
        jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN, async (err, payload) => {
            if (err) {
                return next(createError.Forbidden({ message: err.message }));
            }
            if (foundToken[0].userId !== payload.userId) return next(createError.Forbidden());
            const newPayload = { userId: payload.userId };
            const accessToken = await signAccessToken(newPayload);// sign new accessToken
            const newRefreshToken = await signRefreshToken(newPayload);// sign new refreshToken
            // To add new token and delete old token(invalidate refreshToken)
            await deleteToken({ id: foundToken[0].id });
            await createToken({ userId: newPayload.userId, refreshToken: newRefreshToken });
            // To set cookies again
            res.cookie('refreshToken', newRefreshToken, {
                maxAge: 2592000 * 1000,
                httpOnly: true,
                secure: true,
            });
            return res.status(200).json({ token: accessToken, refreshToken: newRefreshToken });
        });
    } catch (error) {
        return next(createError(500, error.message));
    }
};
module.exports = handleRefreshToken;
