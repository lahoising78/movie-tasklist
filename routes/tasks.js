var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
request = require("request");

router.get("/movies/:id/tasks/new", function(req, res) {
    var query = req.params.id;
    var url = "http://www.omdbapi.com/?i=" + query + "&apikey=thewdb";
    request(url, function(err, response, body){
        if (!err && response.statusCode == 200) {
            var data = JSON.parse(body);
            res.render("tasks/new", {movie: data});
        }
    });
});

router.post("/movies/:id/tasks", function(req, res){
    var query = req.params.id;
    var url = "http://www.omdbapi.com/?i=" + query + "&apikey=thewdb";
    request(url, function(err, response, body){
        if (!err && response.statusCode == 200) {
            var data = JSON.parse(body);
            var newTask = {
                movie:      data.Title,
                movieID:    req.params.id,
                due:        req.body.due,
                status:     req.body.status
            };

            req.user.tasks.push(newTask);
            req.user.save();
            res.redirect("/");
        } else {
            console.log(err);
        }
    });
    
});

module.exports = router;