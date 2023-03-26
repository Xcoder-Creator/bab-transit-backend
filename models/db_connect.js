const mysql = require('mysql'); // Import mysql module

// Create mysql connection pool
const pool  = mysql.createPool({
    connectionLimit : process.env.CONNECTION_LIMIT,
    host: 'mysql-117725-0.cloudclusters.net',
    //host            : process.env.HOST,
    user            : process.env.USER,
    password        : '35ROL4Ad',
    database        : process.env.DATABASE,
    charset         : process.env.CHARSET,
    port: 10050,  
    multipleStatements: true
});
//---------------------------------------

module.exports = pool;
