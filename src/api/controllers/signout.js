const createError = require('http-errors');
const {
  getTokenBy, deleteToken,
} = require('../models/token');
/*
pseudocode
1   if req.cookies.refreshToken not exist then do
2       return status(204)
3   else
4       if token exist in db
5           delete token
6       else return status(204)
7       endif
8   endif
*/

const signOut = async (req, res, next) => {
  const { cookies } = req;
  if (!cookies?.refreshToken) return res.sendStatus(204);
  const { refreshToken } = cookies;
  try {
    const foundToken = await getTokenBy({ refreshToken });
    if (foundToken.length === 0) return res.sendStatus(204);
    await deleteToken({ id: foundToken[0].id });
    return res.sendStatus(204);
  } catch (error) {
    return next(createError(500, error.message));
  }
};
module.exports = signOut;
