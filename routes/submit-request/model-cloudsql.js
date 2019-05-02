'use strict';

const mysql = require('mysql');
const config = require('../../config');
const connection = require("../../db-connection");



function userDetail(table,user_id,cb){
    if(user_id){
        var query = 'SELECT * FROM "'+table+'" WHERE "ID"='+user_id+'';
        connection.query(query,(err, results)=>{
            if (err) {
                cb(err);
                return;
            }
            cb(null, results.rows);
        });
    } else{
        cb(null,[]);
    }
}

module.exports = {
    userDetail:userDetail
};