var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    User = require("./models/user");

mongoose.connect("mongodb://localhost:27017/movie-tasklist", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/scripts"));

app.get("/", function(req, res) {
    var movies = [
        {
            title: "Heathers (1989)",
            due: new Date(2020, 2, 7),
            status: "plan to watch"
        },
        {
            title: "Hamilton (2015)",
            due: new Date(2017, 0, 30),
            status: "plan to watch"
        },
        {
            title: "Dear Evan Hansen (2017)",
            due: new Date(2019, 5, 26),
            status: "plan to watch"
        }
    ];
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