const createError = require('http-errors');
const _ = require('lodash');
const { schemaSignIn } = require('../helpers/validation');
const { getTokenBy, createToken, deleteToken } = require('../models/token');
const { getUserBy } = require('../models/user');
const { compareHash } = require('../helpers/bcrypt');
const { signAccessToken, signRefreshToken } = require('../services/jwt');

/*
pseudocode
validate the inputs
if any error then do
  return validation error
else
  get user by email
  if user exist and password is matched then do
    sign accessToken and newRefreshToken
  else return error
  endif
  if {req.cookies.refreshToken as oldRefreshToken} exist then do
    clear refreshToken in cookies
    find token by value of oldRefreshToken
      if token exist then
        delete token
      endif
  endif
  save newRefreshToken to db
  set cookies.refreshToken = newRefreshToken
  return response(object)
endif
*/

const signIn = async (req, res, next) => {
  const {
    email, password,
  } = req.body;
  // To validate the input fields
  const { error, value } = schemaSignIn.validate({
    email, password,
  });
  // if any errors, forward to error handler with error.message
  if (error) {
    return next(createError(400, error.message));
  }
  // list of selected fields to pick
  const selectedFields = ['id', 'firstName', 'lastName', 'email', 'hash'];
  try {
    // To get user by email
    const foundUser = await getUserBy(selectedFields, { email: value.email });
    // if user exist and password is match
    if (foundUser.length > 0 && await compareHash(password, foundUser[0].hash)) {
      const payload = {
        userId: foundUser[0].id,
      };
      const accessToken = await signAccessToken(payload);// sign accessToken
      const newRefreshToken = await signRefreshToken(payload);// sign refreshToken
      const { cookies } = req;
      if (cookies?.refreshToken) {
        // To clear old refreshToken in cookies
        res.clearCookie('refreshToken');
        const oldRefreshToken = await getTokenBy({ refreshToken: cookies.refreshToken });
        if (oldRefreshToken.length > 0) { // used to sign-up
          // remove old refreshToken
          await deleteToken({ id: oldRefreshToken[0].id });
        }
      }
      // save in tokens table
      await createToken({
        userId: foundUser[0].id, refreshToken: newRefreshToken,
      });
      // To set cookies
      res.cookie('refreshToken', newRefreshToken, {
        maxAge: 2592000 * 1000,
        httpOnly: true,
        secure: true,
      });
      // To handle neccessary data for response
      const user = _.pick(foundUser[0], ['firstName', 'lastName', 'email']);
      user.displayName = foundUser[0].firstName + foundUser[0].lastName;
      return res.status(200).json({ token: accessToken, refreshToken: newRefreshToken, user });
    }
    // for user not exist or password wrong
    return next(createError.Unauthorized('Your email or password is incorrect'));
  } catch (err) {
    return next(createError(500, err.message));
  }
};
module.exports = signIn;
