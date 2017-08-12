var mysql = require('mysql');
// var connection = mysql.createConnection({multipleStatements:true});
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'oniddb.cws.oregonstate.edu',
    user            : 'leeerica-db',
    password        : 'S53u3gpAs4KKLKhG',
    database        : 'leeerica-db',
    // dateStrings     : true
});

module.exports.pool = pool;
// module.exports.connection = connection;
