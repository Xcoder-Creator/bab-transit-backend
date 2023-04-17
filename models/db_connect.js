const mysql = require('mysql'); // Import mysql module

// Create mysql connection pool
const pool  = mysql.createPool({
    connectionLimit : process.env.CONNECTION_LIMIT,
    host: 'mysql-121756-0.cloudclusters.net',
    //host            : process.env.HOST,
    user            : process.env.USER,
    password        : 'fy4uragp',
    database        : process.env.DATABASE,
    charset         : process.env.CHARSET,
    port: 10018,  
    multipleStatements: true
});
//---------------------------------------

module.exports = pool;
