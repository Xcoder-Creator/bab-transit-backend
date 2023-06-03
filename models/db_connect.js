const mysql = require('mysql'); // Import mysql module

// Create mysql connection pool
const pool  = mysql.createPool({
    connectionLimit : process.env.CONNECTION_LIMIT,
    host: 'mysql-129813-0.cloudclusters.net',
    //host            : process.env.HOST,
    user            : process.env.USER,
    password        : 't6n0Gz8n',
    database        : process.env.DATABASE,
    charset         : process.env.CHARSET,
    port: 19840,  
    multipleStatements: true
});
//---------------------------------------

module.exports = pool;
