const db = require('../../config/db/mysql');

const getUserBy = (selectedFields, params = {}) => db('users').where(params).select(...selectedFields);

const createUser = (user) => db('users').insert(user);

module.exports = { createUser, getUserBy };
