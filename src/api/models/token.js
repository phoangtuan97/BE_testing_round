const db = require('../../config/db/mysql');

const getTokenBy = (params = {}) => db('tokens').where(params).select('id', 'refreshToken');

const createToken = ({ userId, refreshToken }) => db('tokens').insert({ userId, refreshToken });

// const updateUser = ({ id, data }) => db('users').where({ id }).update(data);

const deleteToken = ({ id }) => db('tokens').where({ id }).delete({ id });

module.exports = { getTokenBy, createToken, deleteToken };
