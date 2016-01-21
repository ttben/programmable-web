var mongoose     = require('mongoose');
var Schema = mongoose.Schema;

var MixSchema   = new Schema({
    authorId:String,
    author:String,
    musicId:String,
    mixName:String,
    date: { type: Date, default: Date.now },
    tracks:[],
    comments:[],
    rating:Number
});

MixSchema.methods.addComment = function(commentDocument) {
    this.comments.push(commentDocument);
};

var Mix = mongoose.model('Mix', MixSchema);

module.exports =  Mix;