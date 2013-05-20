var Order = require("../repositories/order").Order,
    Artist = require("../repositories/artist").Artist,
    mongoose = require('mongoose'),
    logger = require("../logger"),
    _ = require('underscore'),
    uuid = require('node-uuid'),
    evtcmdbus = require('../evtcmdbus'),
    async = require("async");


module.exports = function (app) {
    app.get('/api/albums', function (req, res) {

        Artist.aggregate({$project: {
                'artistName': 1,
                'albums': 1

            }},
            {$unwind: "$albums"},
            {$limit: 50},
            function (err, artists) {
                if (!err)
                    res.send(artists);
                else {
                    console.log(err);
                    res.send(404);
                }

            });


    });

    app.get('/api/albums/new', function (req, res) {
        var curDate = new moment();
        curDate.subtract('days', 14);

        Artist.aggregate(
            {$match: {"albums.offerDate": {$gte: curDate.toDate() }}},
            {$project: {
                'artistName': 1,
                'albums': 1

            }},
            {$unwind: "$albums"},
            {$limit: 50},
            function (err, artists) {
                if (!err)
                    res.send(artists);
                else {
                    console.log(err);
                    res.send(404);
                }

            });


    });
    app.get('/api/albums/bygenre/:genre', function (req, res) {
        Artist.find({'albums.genre': req.params.genre})
            .limit(50)
            //.where('albums.genre').equals(req.params.genre)
            .select('albums')
            .exec(function (err, artists) {
                if (!err)
                    res.send(artists);
                else {
                    console.log(err);
                    res.send(404);
                }

            });

    });
    /*
     * update an existing album
     */
    app.post('/api/album/:id', function (req, res) {
        var albumUpdate = req.body;
        albumUpdate.sessionId = req.session.id
        //albumUpdate[req.body.name] = req.body.value;
        //newOffer.userId = req.user._id;
        //albumUpdate.id = req.params.id;
        // need to sent event via cqrs
        logger.debug("Album Update Info" + JSON.stringify(albumUpdate));
        var cmd = {
            id: uuid.v4(),
            command: 'updateAlbum',
            payload: albumUpdate

        }
        evtcmdbus.emitCommand(cmd);
        res.send(200);


    });
    app.get('/api/album/:id', function (req,res) {
        var albumId = mongoose.Types.ObjectId(req.params.id);
        console.log(albumId);
        Artist.aggregate(
            {$match: {'albums._id': albumId}},
            {$project: {
                'artistName': 1,
                'bio': 1,
                'albums': 1
            }},
            {$unwind: "$albums"},
            function (err, artists) {
                if (!err) {
                    //TODO: clunky to have to filter here
                    var match = _.where(artists, {'albums._id': req.params.id});
                    var artist = _.find(artists, function (element) {
                        return (element.albums._id == req.params.id)
                    });

                    //var pageData = {title: "Title", info: artist};
                    //if (req.user)
                    //    pageData.user = req.user;
                    //res.render("albumdetail", pageData);
                    res.json(artist);
                }
                else {
                    console.log(err);
                    res.send(404);
                }

            });

    });
    app.get('/album/:id',function(req,res){
       res.render('app');
    });
    /*app.get('/album/:id', function (req, res) {
        // grab the album
        var albumId = mongoose.Types.ObjectId(req.params.id);
        console.log(albumId);
        Artist.aggregate(
            {$match: {'albums._id': albumId}},
            {$project: {
                'artistName': 1,
                'bio': 1,
                'albums': 1
            }},
            {$unwind: "$albums"},
            function (err, artists) {
                if (!err) {
                    //TODO: clunky to have to filter here
                    var match = _.where(artists, {'albums._id': req.params.id});
                    var artist = _.find(artists, function (element) {
                        return (element.albums._id == req.params.id)
                    });

                    var pageData = {title: "Title", info: artist};
                    if (req.user)
                        pageData.user = req.user;
                    res.render("albumdetail", pageData);
                }
                else {
                    console.log(err);
                    res.send(404);
                }

            });


    });*/

    app.get('/album/edit/:id', function (req, res) {
        res.render("app");
    });
//    app.get('/album/edit/:id', function (req, res) {
//
//        var albumId = mongoose.Types.ObjectId(req.params.id);
//        console.log(albumId);
//        Artist.aggregate(
//            {$match: {'albums._id': albumId}},
//            {$project: {
//                'artistName': 1,
//                'bio': 1,
//                'albums': 1
//            }},
//            {$unwind: "$albums"},
//            function (err, artists) {
//                if (!err) {
//                    //TODO: clunky to have to filter here
//                    var match = _.where(artists, {'albums._id': req.params.id});
//                    var artist = _.find(artists, function (element) {
//                        return (element.albums._id == req.params.id)
//                    });
//
//                    var pageData = {title: "Title", info: artist};
//                    if (req.user)
//                        pageData.user = req.user;
//                    res.render("editalbum", pageData);
//                }
//                else {
//                    console.log(err);
//                    res.send(404);
//                }
//
//            });
//    });

}