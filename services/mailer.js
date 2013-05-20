var nodemailer = require("nodemailer")

//-  Nodemailer setup
var transport = nodemailer.createTransport("SES", {
    AWSAccessKeyID: "1450KS5R8P41M28D6RG2",
    AWSSecretKey: "ZQUyADNL+ElIeOkvlzgFj7z84xt6fcRVUeDKSrGi"
});

exports.sendmail = function() {
    var mailOptions = {
            from: "info@soundscry.com",
            to: email,
            subject: "Welcome to SoundScry",
            text: "We will keep you up to date with the latest developments"


        }
        transport.sendMail(mailOptions);var mailOptions = {
                from: "info@soundscry.com",
                to: email,
                subject: "Welcome to SoundScry",
                text: "We will keep you up to date with the latest developments"


            }
            transport.sendMail(mailOptions);
}