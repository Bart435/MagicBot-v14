const { check_transactions } = require('../lib/check_transactions')
const { find_discordID } = require('../lib/find_discordID')
const connection = require('../db/sql');

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    let timer = setInterval(function () {
      const sql = `SELECT steamid FROM mark.users WHERE has_donated = 1`
      connection.query(sql, function (err, results) {
        if (err) throw err;
        for (let i = 0; i < results.length; i++) {
            const steamid = results[i].steamid
            find_discordID(steamid, client)
        }
      });
      check_transactions()
    }, 600000);
  },
};
