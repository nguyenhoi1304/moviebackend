const MovieAll = require("../models/movieListAll");
const genreListAll = require("../models/genreList");
const trailerVideo = require("../models/videoList");

exports.getAllMovie = (req, res, next) => {
  const movieAll = MovieAll.fetchAll();
  const data = movieAll.splice(0, 100);
  res.status(200).json({
    data: data,
  });
};

//////////////////////////////////////
exports.getAllMovieTrending = (req, res, next) => {
  let data = MovieAll.fetchAll();

  // lấy ra tổng số phim
  const totalPage = Math.ceil(data.length / 20);

  const page_size = 20;
  // nhận page từ người dùng nếu có nhập
  let pageReqNumber = req.params.pageId;
  // lấy ra 1 mảng danh sách phim gồm tối đa 20 phần tử theo params người dùng nhập
  if (pageReqNumber) {
    data = data.slice(
      (pageReqNumber - 1) * page_size,
      pageReqNumber * page_size
    );
  }

  if (!pageReqNumber) {
    pageReqNumber = 1;
    data = data.slice(
      (pageReqNumber - 1) * page_size,
      pageReqNumber * page_size
    );
  }

  res.status(200).json({
    results: data,
    //nếu người dùng không nhập prams thì lấy 1
    page: pageReqNumber ?? 1,
    total_pages: totalPage,
    status: 200,
  });
};

//////////////////////////////////////
exports.getAllMovieRate = (req, res, next) => {
  let data = MovieAll.fetchAll();
  const page_size = 20;

  // lấy ra tổng số phim
  const totalPage = Math.ceil(data.length / 20);

  // nhận page từ người dùng nếu có nhập
  let pageReqNumber = req.params.pageId;

  //Lấy ra số vote của mỗi phim , // lọc phim theo số vote từ cao xuống thấp
  data = data.slice(0);
  data.sort(function (a, b) {
    return b.vote_average - a.vote_average;
  });

  if (pageReqNumber) {
    // lấy ra 1 mảng danh sách phim gồm tối đa 20 phần tử
    data = data.slice(
      (pageReqNumber - 1) * page_size,
      pageReqNumber * page_size
    );
  }

  if (!pageReqNumber) {
    pageReqNumber = 1;
    data = data.slice(
      (pageReqNumber - 1) * page_size,
      pageReqNumber * page_size
    );
  }

  res.status(200).json({
    results: data,
    //nếu người dùng không nhập prams thì lấy 1
    page: pageReqNumber ?? 1,
    total_pages: totalPage,
    status: 200,
  });
};

//////////////////////////////////////
exports.getAllMovieDiscover = (req, res, next) => {
  const dataGenre = genreListAll.fetchAll();
  const dataMovie = MovieAll.fetchAll();

  const page_size = 20;

  //genreName : tên thể loại
  const genreIdReq = req.params.GenreId;

  // nhận page từ người dùng nếu có nhập
  let pageReqNumber = req.params.pageId;

  //lọc và Lấy ra datamovie mà có id người dùng nhập
  let data = dataMovie.filter((item) => item.genre_ids.includes(+genreIdReq));

  // lấy ra tổng số phim
  const totalPage = Math.ceil(data.length / 20);

  if (pageReqNumber) {
    //lấy ra datamovie gồm 20 phần tử
    data = data.slice(
      (pageReqNumber - 1) * page_size,
      pageReqNumber * page_size
    );
  }

  if (!pageReqNumber) {
    pageReqNumber = 1;
    data = data.slice(
      (pageReqNumber - 1) * page_size,
      pageReqNumber * page_size
    );
  }

  // lấy ra phần tử mà id người dùng nhập ===> thể loại phim
  const nameGenre = dataGenre.filter((item) => item.id === +genreIdReq);

  //Nếu người dùng không có param thì trả về lỗi này. Bạn sẽ trả về message là "Not found gerne parram"
  if (!genreIdReq) {
    res.status(400).json({
      message: "Not found gerne parram",
    });
    return;
  }

  //Nếu người dùng truyền vào một gerne id không có trong danh sách (bạn sẽ cần tìm trong file gerneList.json) thì sẽ trả về mã lỗi này. Bạn sẽ trả về message là "Not found that gerne id".
  if (!data) {
    res.status(400).json({
      message: "Not found that gerne id",
    });
    return;
  }

  res.status(200).json({
    results: data,
    //nếu người dùng không nhập prams thì lấy 1
    page: pageReqNumber ?? 1,

    total_pages: totalPage,

    genre_name: nameGenre[0].name,
  });
};

//////////////////////////////////////
exports.postTrailer = (req, res, next) => {
  const movies = trailerVideo.fetchAll();
  //Nhận idFilm từ client
  const trailerId = req.body.filmId;
  //Tìm ra các video theo trailerId
  const moviesID = movies.filter((item) => item.id === +trailerId);
  //trả về kết quả là 1 videos thỏa mãn điều kiện đầu tiên
  const result = moviesID.map((item) =>
    item.videos.find((item) =>
      item.official === true &&
      item.site === "YouTube" &&
      item.type === "Trailer"
        ? item.type === "Trailer"
        : item.type === "Teaser"
    )
  );

  //Nếu người dùng không có param thì trả về lỗi này. Bạn sẽ trả về message là "Not found gerne parram"
  if (!trailerId) {
    res.status(400).json({
      message: "Not found film_id parram",
    });
    return;
  }

  //Nếu hệ thống không tim được video phù hợp với phim đó, bạn sẽ trả về mã lỗi này. message sẽ là "Not found video".
  if (!moviesID) {
    res.status(404).json({
      message: "Not found video",
    });
    return;
  }

  res.status(200).json({
    results: result,
  });
};

//////////////////////////////////////
exports.postSearch = (req, res, next) => {
  const dataGenre = genreListAll.fetchAll();
  const dataMovie = MovieAll.fetchAll();
  let message;
  const searchKeyWord = req.body.keyword;
  const genre = req.body.genre;
  const mediaType = req.body.mediaType;
  const language = req.body.language;
  const yearMovie = req.body.yearMovie;
  // nhận page từ người dùng nếu có nhập
  let pageReqNumber = req.params.pageId;

  let data;
  let totalPage;

  const page_size = 20;

  //Nếu người dùng không có param thì trả về lỗi này. Bạn sẽ trả về message là  "Not found keyword parram".
  if (!searchKeyWord) {
    res.status(400).json({
      message: "Not found keyword parram",
    });
    return;
  } else {
    const dataKeyWord = dataMovie.filter((item) =>
      item.overview.includes(searchKeyWord)
    );

    let resultGenre;
    let dataMediaType;
    let dataLanguage;

    if (genre) {
      ////////// Tìm kiếm theo Genre /////////
      // lấy ra phần tử mà người dùng nhập ===> thể loại phim
      const GenreData = dataGenre.filter((item) => item.name === genre);
      //Lấy ra id
      const IdGenreData = GenreData[0].id;
      //so sánh id với danh sách movie để lấy ra phim phù hợp
      resultGenre = dataKeyWord.filter(
        (item) =>
          // có 4 id trong danh sách genre_ids => so sánh với id mà phim người dùng nhập từ tên thể loại
          item.genre_ids[0] === IdGenreData ||
          item.genre_ids[1] === IdGenreData ||
          item.genre_ids[2] === IdGenreData ||
          item.genre_ids[3] === IdGenreData
      );

      // console.log("ressult1", resultGenre[0], "ressult2", dataKeyWord[0]);
      //gán lại data
      data = resultGenre;
      ////////// Tìm kiếm theo media_type và genre/////////
      if (genre && mediaType) {
        dataMediaType = resultGenre.filter(
          (item) => item.media_type === mediaType
        );
        data = dataMediaType;
      }
      ////////// Tìm kiếm theo language và media_type và genre/////////
      if (genre && mediaType && language) {
        dataLanguage = dataMediaType.filter(
          (item) => item.original_language === language
        );
        data = dataLanguage;
      }
      ////////// Tìm kiếm theo language và media_type và genre và yearMovie/////////
      if (genre && mediaType && language && yearMovie) {
        data = dataLanguage.filter((item) => item.release_date === yearMovie);
        console.log(data);
      }
    } else {
      data = dataKeyWord;
    }

    // lấy ra tổng số phim
    totalPage = Math.ceil(data.length / 20);

    if (pageReqNumber) {
      //lấy ra datamovie gồm 20 phần tử
      data = data.slice(
        (pageReqNumber - 1) * page_size,
        pageReqNumber * page_size
      );
    }

    if (!pageReqNumber) {
      pageReqNumber = 1;
      data = data.slice(
        (pageReqNumber - 1) * page_size,
        pageReqNumber * page_size
      );
    }
    res.status(200).json({
      results: data,
      message: message,
      page: pageReqNumber ?? 1,
      total_pages: totalPage,
    });
  }
};
