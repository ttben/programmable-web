var mongoose     = require('mongoose');
var Schema = mongoose.Schema;

var MixSchema   = new Schema({
    authorID:String,
    originalTitle:String,
    originalArtist:String,
    date:[],
    tracks:[],
    comments:[],
    rating:Number
});

MixSchema.methods.addComment = function(commentDocument) {
    this.comments.push(commentDocument);
};

var Mix = mongoose.model('Mix', MixSchema);

module.exports =  Mix;