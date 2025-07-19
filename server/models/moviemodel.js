const mongoose = require('mongoose');

// Movie schema with TMDB-style field names
const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    logo:{type:String},
    tagline:{type:String},

    overview:{type:String},

    poster_path: {
        type: String,
        required: true,
    },
    backdrop_path: {
        type: String,
        required: true,
    },
    cast: [
        {
            name: {
                type: String,
                required: true,
            },
            profile_path: {
                type: String,
                required: true,
            }
        }
    ],
    release_date: {
        type: Date,
        required: true,
    },
    vote_average: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    vote_count: {
        type: Number,
        required: true,
    },
    locations:[{type:String}],
    genres:[{type:String}],
    runtime:{type:Number,required:true},
    language:{type:String,required:true},
},{timestamps: true,versionKey: false});

const MOVIES = mongoose.model('movie', movieSchema)

module.exports = MOVIES
