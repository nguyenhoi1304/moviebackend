const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "genreList.json"
);

const Genre = {
  all: function () {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  },
};

module.exports = class genreList {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
  static fetchAll() {
    return Genre.all();
  }
};
