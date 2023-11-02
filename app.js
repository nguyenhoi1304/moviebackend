const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
//Use static folder
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

const movieRoutes = require("./routes/movie");
const errorController = require("./controllers/error");

app.use("/api/movies", movieRoutes);
app.use(errorController.get404);

app.use(
  session({ secret: "my secret", resave: false, saveUninitialized: false })
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
