var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var request = require("request");

//=================authentication======================
router.get("/", function(req, res) {
    var movies = [];
    var rn = new Date();
    if (req.user) {
        //console.log("req.user is not null");
        User.findById(req.user._id, function(err, user){
            if (err) {
                console.log(err);
            } else {
                //console.log("found user and stuff");
                user.tasks.forEach(function(task){
                    movies.push(task);
                    //console.log(task);
                    //console.log(movies);
                });
                res.render("tasks/index", {movies: movies, rn: rn.toJSON()} );
            }
        });
    } else {
        res.redirect("search");
    }
});

router.get("/search", function(req, res){
    res.render("search");
});

router.get("/result", function(req, res){
    var query = req.query.search;
    var url = "http://www.omdbapi.com/?s=" + query + "&apikey=thewdb";
    request(url, function(err, response, body){
        if (!err && response.statusCode == 200) {
            var data = JSON.parse(body);
            res.render("result", {data: data});
        }
    });

});

router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    var newUser = User({
        username:   req.body.username,
        //password:   req.body.password,
        tasks:      []
    });

    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            console.log(err);
            return res.redirect("register");
        }
        
        passport.authenticate("local")(req, res, function(){
            res.redirect("/");
        });
    });
});

router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}), function(req, res) {});

module.exports = router;