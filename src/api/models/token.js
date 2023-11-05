const db = require('../../config/db/mysql');

const getTokenBy = (params = {}) => db('tokens').where(params).select('id', 'refreshToken', 'userId');

const createToken = ({ userId, refreshToken }) => db('tokens').insert({ userId, refreshToken });

const deleteToken = ({ id }) => db('tokens').where({ id }).delete({ id });

const deleteAllTokenByUserId = ({ userId }) => db('tokens').where({ userId }).del();

module.exports = {
  getTokenBy, createToken, deleteToken, deleteAllTokenByUserId,
};
