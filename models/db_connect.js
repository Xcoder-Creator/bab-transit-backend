const mysql = require('mysql'); // Import mysql module

// Create mysql connection pool
const pool  = mysql.createPool({
    connectionLimit : process.env.CONNECTION_LIMIT,
    host: 'mysql-119902-0.cloudclusters.net',
    //host            : process.env.HOST,
    user            : process.env.USER,
    password        : 'wg62Hzam',
    database        : process.env.DATABASE,
    charset         : process.env.CHARSET,
    port: 10095,  
    multipleStatements: true
});
//---------------------------------------

module.exports = pool;
