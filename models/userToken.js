const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "userToken.json"
);

const usersToken = {
  all: function () {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  },
};

module.exports = class userToken {
  constructor(userId, token) {
    this.userId = userId;
    this.token = token;
  }
  static fetchAll() {
    return usersToken.all();
  }
};
