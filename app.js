var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    //passportLocalMongoose = require("passport-local-mongoose"),
    request = require("request"),
    indexRoutes = require("./routes/index"),
    User = require("./models/user");

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

app.post("/tasks", function(req, res){
    res.send("id of movie: " + req.body.task.id);
    //console.log("id of movie: "+req.params.id);
});

app.use("/", indexRoutes);

//======================listen==========================
app.listen(3000, function(){
    console.log("server is live");
});