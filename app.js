var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");
    User = require("./models/user");

mongoose.connect("mongodb://localhost:27017/movie-tasklist", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
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

app.get("/", function(req, res) {
    var movies = [];
    res.render("tasks/index", {movies, movies});
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    var newUser = User({
        username: req.body.username,
        password: req.body.password
    });

    User.create(newUser, function(err, user){
        if (err) {
            console.log(err);
            return res.redirect("/register");
        }
        
        res.redirect("/");
    });
});

app.listen(3000, function(){
    console.log("server is live");
});