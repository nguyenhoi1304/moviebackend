const express = require("express");

const MovieController = require("../controllers/movie");
// const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", MovieController.getAllMovie);

router.get("/trending", MovieController.getAllMovieTrending);
router.get("/trending/:pageId", MovieController.getAllMovieTrending);

router.get("/top-rate", MovieController.getAllMovieRate);
router.get("/top-rate/:pageId", MovieController.getAllMovieRate);

router.get("/discover", MovieController.getAllMovieDiscover);

router.get("/discover/:GenreId", MovieController.getAllMovieDiscover);
router.get("/discover/:GenreId/:pageId", MovieController.getAllMovieDiscover);

router.post("/video", MovieController.postTrailer);
router.get("/video", MovieController.postTrailer);

router.get("/search", MovieController.postSearch);
router.post("/search", MovieController.postSearch);
router.post("/search/:pageId", MovieController.postSearch);

module.exports = router;
