const { Client } = require("discord.js");
const mongoose = require("mongoose");
const { Database, CrossDB, ArkShopPath } = require("../config.json");
const mysql = require('mysql');

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log('\x1b[34m%s\x1b[0m' ,'Made by Bart#8888');
    console.log('\x1b[34m%s\x1b[0m' ,'Github: https://github.com/Bart435');
    console.log('\x1b[32m%s\x1b[0m' ,'Connected to Discord');

    client.user.setPresence({ activities: [{ name: "https://magicark.co.uk/" }] });
    if (!Database) return;
    mongoose.connect(Database, {
      useNewUrlParser: true,
      UseUnifiedTopology: true
    }).then(() => {
      console.log('\x1b[32m%s\x1b[0m' ,'Connected to MongoDB');
    }).catch((err) => {
      console.log(err)
    });
  },
};
