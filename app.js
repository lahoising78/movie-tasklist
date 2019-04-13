var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    //passportLocalMongoose = require("passport-local-mongoose"),
    request = require("request"),
    indexRoutes = require("./routes/index"),
    User = require("./models/user"),
    Task = require("./models/task");

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
app.get("/", function(req, res) {
    var movies = [];
    res.render("tasks/index", {movies, movies});
});

app.get("/search", function(req, res){
    res.render("search");
});

app.get("/result", function(req, res){
    var query = req.query.search;
    var url = "http://www.omdbapi.com/?s=" + query + "&apikey=thewdb";
    request(url, function(err, response, body){
        if (!err && response.statusCode == 200) {
            var data = JSON.parse(body);
            res.render("result", {data: data});
        }
    });

});

app.get("/movies/:id", function(req, res){
    var query = req.params.id;
    var url = "http://www.omdbapi.com/?i=" + query + "&apikey=thewdb";
    request(url, function(err, response, body){
        if (!err && response.statusCode == 200) {
            var data = JSON.parse(body);
            res.render("movies/show", {movie: data});
        }
    });
});

app.get("/movies/:id/tasks/new", function(req, res) {
    var query = req.params.id;
    var url = "http://www.omdbapi.com/?i=" + query + "&apikey=thewdb";
    request(url, function(err, response, body){
        if (!err && response.statusCode == 200) {
            var data = JSON.parse(body);
            res.render("tasks/new", {movie: data});
        }
    });
});

app.post("/movies/:id/tasks", function(req, res){
    var query = req.params.id;
    var url = "http://www.omdbapi.com/?i=" + query + "&apikey=thewdb";
    request(url, function(err, response, body){
        if (!err && response.statusCode == 200) {
            var data = JSON.parse(body);
            var newTask = {
                movie:      data.Title,
                movieID:    req.params.id,
                due:        req.body.due
            };

            req.user.tasks.push(newTask);
            req.user.save();
        }
    });
    res.redirect("/");
});

app.use("/", indexRoutes);

//======================listen==========================
app.listen(3000, function(){
    console.log("server is live");
});