const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "movieList.json"
);

const Movies = {
  all: function () {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  },
};

module.exports = class movieListAll {
  constructor(
    adult,
    backdrop_path,
    id,
    name,
    original_language,
    original_name,
    overview,
    poster_path,
    media_type,
    genre_ids,
    popularity,
    first_air_date,
    vote_average,
    vote_count,
    origin_country
  ) {
    this.adult = adult;
    this.backdrop_path = backdrop_path;
    this.id = id;
    this.name = name;
    this.original_language = original_language;
    this.original_name = original_name;
    this.overview = overview;
    this.poster_path = poster_path;
    this.media_type = media_type;
    this.genre_ids = genre_ids;
    this.first_air_date = first_air_date;
    this.vote_average = vote_average;
    this.vote_count = vote_count;
    this.origin_country = origin_country;
    this.origin_country = popularity;
  }
  static fetchAll() {
    return Movies.all();
  }
};
