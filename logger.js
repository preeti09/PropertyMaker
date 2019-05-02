var fs = require('fs');
var moment = require('moment');

var Logger = exports.Logger = {};
var date = moment().format('DD-MM-YYYY');

if (!fs.existsSync("./public/logs")){
    fs.mkdirSync("./public/logs");
}

Logger.info = function(msg) {
    var message = new Date().toISOString() + " : " + msg + "\r\n";
    fs.appendFile("./public/logs/info_log_"+date+".txt", message , function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
}; 

Logger.debug = function(msg) {
    var message = new Date().toISOString() + " : " + msg + "\r\n";
    fs.appendFile("./public/logs/debug_log_"+date+".txt", message , function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
};

Logger.error = function(msg) {
    console.log(msg,' ====================== msg');
    var message = new Date().toISOString() + " : " + msg + "\r\n";
    fs.appendFile("./public/logs/error_log_"+date+".txt", message, function (err) {
        if (err) throw err;
        console.log('Saved!'); 
    });
};