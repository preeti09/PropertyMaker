'use strict';
const connection = require("../../db-connection");
const commonFunction = require("../../sql-common-function");

function getUserDetails(table,id,cb) {
 
    var sql = 'SELECT * FROM "'+table+'" WHERE "ID" = '+id;
    var query = connection.query(sql, (err, results) => {
        if (err) {
                    var err_msg = "Error Occured";
                    cb('err', err_msg);
                    return;
                }else {
                    cb('success', results.rows[0]);
                } 
            });
}

module.exports = {
    getUserDetails:getUserDetails,
};