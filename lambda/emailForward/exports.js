var LambdaForwarder = require("aws-lambda-ses-forwarder");

exports.handler = function(event, context, callback) {
    // See aws-lambda-ses-forwarder/index.js for all options.
    var overrides = {
        config: {
            fromEmail: "admin@andrewpaettie.com",
            emailBucket: "andrewpaettie.com-mail",
            emailKeyPrefix: "mail/",
            forwardMapping: {
                "@andrewpaettie.com": [
                    "paettiea@gmail.com"
                ]
            }
        }
    };
    LambdaForwarder.handler(event, context, callback, overrides);
};
