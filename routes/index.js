
module.exports = function(app){

    require("./artist")(app);
    require("./offer")(app);
    require("./order")(app);
    require("./wager")(app);
    require("./album")(app);
    app.get("/faq",function(req,res){
       res.render('faq',{title:"FAQ"});
    });
    return {
        partials: function(req,res){
                var name = req.params.name;
                res.render('partials/' + name);
            }
    };

}
