const mysql = require('mysql'); // Import mysql module

// Create mysql connection pool
const pool  = mysql.createPool({
    connectionLimit : process.env.CONNECTION_LIMIT,
    host: 'mysql-114838-0.cloudclusters.net',
    //host            : process.env.HOST,
    user            : process.env.USER,
    password        : 'i0PDPYCk',
    database        : process.env.DATABASE,
    charset         : process.env.CHARSET,
    port: 18221,  
    multipleStatements: true
});
//---------------------------------------

module.exports = pool;
