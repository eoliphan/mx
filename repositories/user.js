var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , conf = require("../config").conf
    ,  passportLocalMongoose = require('passport-local-mongoose')

    ;

// connect to db



//-- game stuff
var chipWagerSchema = new Schema({
    userId:Schema.Types.ObjectId,
    orderDate:Date,
    chipCount:Number,
    points:Number,
    itemId:Schema.Types.ObjectId
});

var userSchema = new Schema({
    firstName: String,
    lastName: String,
    password: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    ssn: String,
    annualIncome: String,
    isArtist:{type:Boolean, default: false},
    isArtistPending:{type:Boolean, default: false},
    isInvestor:{type:Boolean, default: false},
    isInvestorPending:{type:Boolean, default: false},
    primaryuse: String,
    bandName:String,
    bandContactPhone:String,
    phoneNumber:String,
    companyName:String,
    investorClass:String,
    ssn:String,
    einTaxID:String,
    friends:[Schema.Types.ObjectId],
    confirmationCode:String,
    isConfirmed:{type:Boolean, default:false}

});

userSchema.plugin(passportLocalMongoose,{usernameField:'email'});

userSchema.index({email:1},{unique:true});

var User = mongoose.model('User',userSchema);



exports.User = User;








