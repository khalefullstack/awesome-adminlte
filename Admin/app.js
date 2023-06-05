var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
// var logger = require('morgan');
const flash = require("express-flash-notification");
const session = require("express-session");
// const { USERNAME, PASSWORD, DB_NAME, HOST_NAME } = require("./config/database");

var expressLayouts = require("express-ejs-layouts");

const { connect } = require("./config/database");
const systemConfig = require("./config/system");

var app = express();

connect();

app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(
  flash(app, {
    viewName: "notify",
  })
);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "backend");

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.locals.systemConfig = systemConfig;
app.use(`/`, require("./routes"));
app.use(`/${systemConfig.prefixAdmin}`, require("./routes/backend"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("page/error", { pageTitle: "File not Found" });
});

module.exports = app;
