var mongoose     = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema   = new Schema({
	mix_id: String,
	authorName: String,
    text: String,
	date : { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema);