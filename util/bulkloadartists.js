var Artist = require('../repositories/artist').Artist
    , fs = require('fs')
    , _ = require('underscore');

var rawdata = fs.readFileSync('./data/artists.json','utf-8');

var jsonData = JSON.parse(rawdata);

console.log(jsonData);

_.each(jsonData.result,function(element,index,list){
    // push in each artist
    var artist = new Artist(element);
    artist.save();

    //console.log(element);
});


