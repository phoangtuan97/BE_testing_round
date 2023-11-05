const createError = require('http-errors');
const _ = require('lodash');
const { schemaSignUp } = require('../helpers/validation');
const { getUserBy, createUser } = require('../models/user');
const { hashPassword } = require('../helpers/bcrypt');

/*
pseudocode
1   validate the inputs
2   if any errors then do
3       return validation error
4   else
5       get user by email
6       if user exist then do
7           return conflict error
8       else
9           hash password
10          save user to db
11          handle data for response
12      endif
13  endif
*/
const signUp = async (req, res, next) => {
  const {
    firstName, lastName, email, password,
  } = req.body;
  // To validate the input fields
  const { error, value } = schemaSignUp.validate({
    firstName, lastName, email, password,
  });
  // if any errors, forward to error handler with error.message
  if (error) {
    return next(createError(400, error.message));
  }
  try {
    // To check duplicate user
    const selectedFields = ['id', 'firstName', 'lastName', 'email'];
    const foundUser = await getUserBy(selectedFields, { email });
    if (foundUser.length > 0) {
      return next(createError.Conflict(`${email} is already registered`));
    }
    const user = _.pick(value, ['firstName', 'lastName', 'email']);
    // To hash password
    const encryptedPassword = await hashPassword(value.password);
    user.hash = encryptedPassword;
    // To save in 'users' table
    const newUser = await createUser(user);
    const insertId = newUser[0];// last_insert_id
    // To get the newly created user by last_insert_id
    // then handle data for response
    const newlyCreatedUser = await getUserBy(selectedFields, { id: insertId });
    const displayName = newlyCreatedUser[0].firstName + newlyCreatedUser[0].lastName;
    return res.status(201).json({ ...newlyCreatedUser[0], displayName });
  } catch (err) {
    return next(createError(500, err.message));
  }
};
module.exports = signUp;
