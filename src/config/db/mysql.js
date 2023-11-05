require('dotenv').config();

const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: process.env.HOST || 'localhost',
        port: process.env.PORT_DB_MYSQL || 3306,
        user: process.env.USER || 'root',
        database: process.env.DATABASE_NAME || 'testing_round',
    },
});

module.exports = knex;
