//require modules
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const mainRoutes = require("./routes/mainNavigation");
const eventRoutes = require("./routes/eventRoutes");
const mongoose = require("mongoose");

//create app
const app = express();

//config app
let port = 3000;
let host = "localhost";
let url = "mongodb://127.0.0.1:27017/project3";
app.set("view engine", "ejs");

//middleware functions
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(methodOverride("_method"))

//connect to MongoDB
mongoose.connect(url)
  .then(() => {
    //start server
    app.listen(port, host, () => {
      console.log("Server is running on port", port);
      console.log("DB has successfully started");
    });
  })
  .catch(err => console.error(err))

//setup routes
app.use("/", mainRoutes);

app.use('/events', eventRoutes);

//none of the routes were executed
app.use((req, res, next) => {
  let err = new Error("The server cannot locate " + req.url)
  err.status = 404;
  next(err);
});

//this error handler handles server errors
app.use((err, req, res, next) => {
  console.log(err.stack)
  if (!err.status) {
    err.status = 500;
    err.message = "Internal Server Error";
  }

  res.status(err.status);
  res.render('Error', {error: err})
});
