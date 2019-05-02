'use strict';

const mysql = require('mysql');
const config = require('../../config');


const options = (config.get('HOST') !== '') ? { user:
config.get('MYSQL_USER'),password: config.get('MYSQL_PASSWORD'),database:
config.get('DATABASE'),host: config.get('HOST')} : { user:
config.get('MYSQL_USER'),password: config.get('MYSQL_PASSWORD'),database:
config.get('DATABASE') }
const connection = mysql.createConnection(options);

function addNewsletter(obj,cb){
   var query = connection.query('SELECT COUNT(*) as count FROM newsletter WHERE email="'+obj.email+'"',(err,results) =>{
        if(err){
            cb(err,'Something went wrong, please try again.');
            return;
        }          
        if(results[0].count > 0){
            cb(null,'Your email is already subscribed.');
        }else{
            var query = connection.query('INSERT INTO newsletter SET ? ', obj ,(err,res) =>{
                if(err){
                    cb(err,'Something went wrong, please try again.');
                    return;
                }
                cb(null,'Your email added.');
            });
            
        }
    });
    
}

module.exports = {
    addNewsletter:addNewsletter
};