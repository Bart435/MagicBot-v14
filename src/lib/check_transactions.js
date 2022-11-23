const connection = require('../db/sql');

function check_transactions() {
    const sql = `SELECT steamid FROM mark.users_transactions`
    connection.query(sql, function (err, results) {
        for (let i = 0; i < results.length; i++) {
            let sql = `UPDATE mark.users SET has_donated = 1 WHERE steamid = ${results[i].steamid}`
            connection.query(sql, function (err, results) {
                if (err) throw err;
                if (!results) return
            });
        }
    });
}
module.exports = { check_transactions }