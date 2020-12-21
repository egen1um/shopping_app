const {Pool} = require('pg');

const pool = new Pool({
    // host: 'localhost',
    host: 'db',
    user: 'shopping_app',
    password: 'pwd',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

console.log(process.env)

module.exports = {pool};