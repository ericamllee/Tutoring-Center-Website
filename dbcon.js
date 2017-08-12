var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_leeerica',
    password        : 'CtTAL7jXHCDe',
    database        : 'cs340_leeerica',
    // dateStrings     : true
});

module.exports.pool = pool;
