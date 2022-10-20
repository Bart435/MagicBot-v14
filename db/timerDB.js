const mysql = require('mysql');
const { timerDB } = require('../config.json');
var pool = mysql.createPool(timerDB);

module.exports = {
    query: function () {
        var sql_args = [];
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        var callback = args[args.length - 1];
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                return callback(err);
            }
            if (args.length > 2) {
                sql_args = args[1];
            }
            connection.query(args[0], sql_args, function (err, results) {
                connection.release();
                if (err) {
                    console.log(err);
                    return callback(err);
                }
                callback(null, results);
            });
        });
    }
};