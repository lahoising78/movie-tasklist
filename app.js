var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    User = require("./models/user");

mongoose.connect("mongodb://localhost:27017/movie-tasklist", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.render("tasks/index");
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