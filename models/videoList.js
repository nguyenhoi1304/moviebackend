const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "videoList.json"
);

const videosList = {
  all: function () {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  },
};

module.exports = class videoList {
  constructor(id, videos) {
    this.userId = id;
    this.token = videos;
  }
  static fetchAll() {
    return videosList.all();
  }
};
