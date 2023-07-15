const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./app/models");
require("dotenv").config();
const session = require("express-session");
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
    cookie: { secure: true },
  })
);

require("./app/routes/auth.routes")(app);
require("./app/routes/event.routes")(app);
require("./app/routes/notice.routes")(app);
require("./app/routes/gallery.routes")(app);
require("./app/routes/books.routes")(app);
require("./app/routes/article.routes")(app);

db.mongoose
  .connect(`${process.env.DB_URL_DEVELOPEMENT}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB....");
    //  roleCedar();
  })
  .catch((err) => {
    console.log({ err }, "error");
    console.error("Connection error", err);
    process.exit();
  });

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
