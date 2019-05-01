var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    //passportLocalMongoose = require("passport-local-mongoose"),
    request = require("request"),
    User = require("./models/user"),
    Task = require("./models/task");

var indexRoutes = require("./routes/index"),
    movieRoutes = require("./routes/movies"),
    taskRoutes = require("./routes/tasks");

mongoose.connect("mongodb://localhost:27017/movie-tasklist", {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/scripts"));
app.use(require("express-session")({
    secret: "this is a secret... i like hamilton",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
 });

//=========================routes=============================
app.use("/", indexRoutes);
app.use("/movies", movieRoutes);
app.use("/movies/:id/tasks", taskRoutes);

//======================listen==========================
app.listen(3000, function(){
    console.log("server is live");
});