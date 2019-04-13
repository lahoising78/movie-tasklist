var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var taskSchema = mongoose.Schema({
    movie:      String,
    movieID:    String,
    due:        Date,
    status:     String
});

module.exports = mongoose.model("Task", taskSchema);