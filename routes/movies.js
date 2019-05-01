var express = require("express");
var router = express.Router();
var request = require("request");
var bodyParser = require("body-parser");

router.get("/:id", function(req, res){
    var query = req.params.id;
    var url = "http://www.omdbapi.com/?i=" + query + "&apikey=thewdb";
    request(url, function(err, response, body){
        if (!err && response.statusCode == 200) {
            var data = JSON.parse(body);
            res.render("movies/show", {movie: data});
        }
    });
});

module.exports = router;