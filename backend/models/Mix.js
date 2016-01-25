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

var Song = require('./Song');


var storeMix = function(mix, successFunction, failFunction, notFoundFunction) {


    mix.save(function (err, mixResult) {
        if (err) {
            failFunction(err);
            return;
        }

        //  Get the base song
        Song.findOne({'_id': mix.musicId}, function (err, song) {

            if (err) {
            	// console.log(err);
            	// failFunction(err);
                notFoundFunction();
                return;
            }
            console.log(song);
            if (song == null) {
            	// failFunction(err);
                notFoundFunction();
                return;
            }

            song.addMix(mixResult);

            song.save(function (err, songResult) {
                if (err) {
		            failFunction(err);
                } else {
	                successFunction(mixResult);
                }
            });

        });
    });

};

var getMixById = function(mixId, successFunction, failFunction) {
    
    Mix.findOne({_id: mixId}, {'__v': 0}).lean().exec(function (err, mix) {
        if (err) {
            failFunction(err);
        } else {
	        successFunction(mix || {});
        }
    });

};

var getMixesByUserId = function(userId, successFunction, failFunction) {
    
    Mix.find({authorId: userId}, {'__v': 0}).lean().exec(function (err, mixes) {
        if (err) {
            failFunction(err);
        } else {
	        successFunction(mixes || []);
        }
    });

};



Mix.storeMix = storeMix;
Mix.getMixById = getMixById;
Mix.getMixesByUserId = getMixesByUserId;


module.exports =  Mix;