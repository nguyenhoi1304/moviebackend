const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "mediaTypeList.json"
);

const mediaTypesList = {
  all: function () {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  },
};

module.exports = class mediaTypeList {
  constructor(all, movie, tv, person) {
    this.all = all;
    this.movie = movie;
    this.tv = tv;
    this.person = person;
  }
  static fetchAll() {
    return mediaTypesList.all();
  }
};
