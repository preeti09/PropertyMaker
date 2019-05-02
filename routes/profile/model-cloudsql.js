'use strict';
const connection = require("../../db-connection");
const commonFunction = require("../../sql-common-function");

function userDetail(table,user_id,cb){
    if(user_id){
      var query = 'SELECT * FROM "'+table+'" WHERE "ID"='+user_id+'';
      connection.query(query,(err, results)=>{
        if (err) {
            cb(err);
            return;
        }
        cb(null, results.rows[0]);
    });
    } else{
          cb(null,[]);
    }
}
module.exports = {
    userDetail:userDetail
};