var mongoose     = require('mongoose');
var Schema = mongoose.Schema;

var SongSchema   = new Schema({
    url:String,
    title:String,
    artist:String,
    tracks:[],
    mixes:[]
});

SongSchema.methods.addMix = function(mixDocument) {
  this.mixes.push(mixDocument);
};

module.exports = mongoose.model('Song', SongSchema);