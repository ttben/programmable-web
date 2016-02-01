var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MixSchema = new Schema({
    authorId:String,
    author:String,
    musicId:String,
    mixName:String,
    date: { type: Date, default: Date.now },
    tracks:[],
    comments:[],
    voters:[{
        voterId: String,
        rating: Number,
        date: { type: Date, default: Date.now }
    }],
    nbRating:Number,
    cumulRating:Number,
    rating:Number
});

MixSchema.methods.addComment = function(commentDocument) {
    this.comments.push(commentDocument);
};

MixSchema.methods.addRate = function(voterId, rating) {
    var byId = function (element, index, array) {

        if (element.voterId == voterId) {
            return true;
        }
        return false;
    }

    // test if already in list
    var index = this.voters.findIndex(byId);
    if (index !== -1) {
        // if already in list
        this.cumulRating -= this.voters[index].rating;
        this.voters[index].rating = rating;
        this.cumulRating -= -rating;
    } else {
        // if not
        this.voters.push({ voterId, rating });
        this.nbRating += 1;
        this.cumulRating -= -rating;
    }
    // calcul average rating
    if (this.nbRating === 0) {
        this.rating = 0;
    }
    else {
        this.rating = this.cumulRating / this.nbRating;
    }
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

var getMixById = function(mixId, successFunction, failFunction, notFoundFunction) {
    
    Mix.findOne({_id: mixId}, {'__v': 0}, function (err, mix) {
        if (err) {
            failFunction(err);
        } else {
            if (mix == null || mix == undefined) {
                notFoundFunction(mixId);
            }
            else {
                successFunction(mix || {});
            }
        }
    });

};

var getMixesByUserId = function(token, successFunction, failFunction) {



    Mix.find({authorId: token}, {'__v': 0}, function (err, mixes) {
        if (err) {
            failFunction(err);
        } else {
	        successFunction(mixes || []);
        }
    });

};

var rate = function(mixId, authorId, rating, successFunction, failFunction, notFoundFunction) {
    
    Mix.findOne({_id: mixId}, {'__v': 0}, function (err, mix) {
        if (err) {
            failFunction(err);
        } else {
            if (mix == null || mix == undefined) {
                notFoundFunction(mixId);
            }
            else {
                mix.addRate(authorId, rating);

                mix.save(function (err, mixResult) {
                    if (err) {
                        failFunction(err);
                        return;
                    }
    
                    successFunction(mixResult);
                });

            }
        }
    });

};



Mix.storeMix = storeMix;
Mix.getMixById = getMixById;
Mix.getMixesByUserId = getMixesByUserId;
Mix.rate = rate;


module.exports =  Mix;