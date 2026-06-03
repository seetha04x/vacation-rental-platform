if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const usersRouter = require("./routes/user.js");

const dburl = process.env.ATLASDB_URL;
const secret = process.env.SECRET || "fallbacksecret";

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

mongoose.set("strictQuery", true);

async function main() {
  await mongoose.connect(dburl);
  console.log("connected");

  const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: { secret },
    touchAfter: 3600 * 24,
  });

  store.on("error", (err) => {
    console.log("Error in Mongo Session store", err);
  });

  const sessionOptions = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  };

  app.use(session(sessionOptions));
  app.use(flash());

  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy(user.authenticate()));
  passport.serializeUser(user.serializeUser());
  passport.deserializeUser(user.deserializeUser());

  app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
  });

  app.use("/listings", listingsRouter);
  app.use("/listings/:id/reviews", reviewsRouter);
  app.use("/", usersRouter);

  app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
  });

  app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    if (res.headersSent) return next(err);
    res.status(statusCode).render("error.ejs", { statusCode, message });
  });

  app.listen(3000, () => {
    console.log("listening to 3000");
  });
}

main().catch((err) => console.log("error", err));
