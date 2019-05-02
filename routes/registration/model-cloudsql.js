'use strict';
const connection = require("../../db-connection");
const commonFunction = require("../../sql-common-function");

function checkRegistration(data, cb) {

    var query = connection.query('SELECT "Name","Email" FROM "Users" where "Email" = \'' + data[0].Email + '\'', (err, results) => {
        
        if (err) {
            var err_msg = "Network Error Occured";
            cb('err', err_msg);
            return;
        }else if (results.rows.length > 0) {
            var err_msg = "Email already exists. Please login";
            cb('exist', err_msg);
            return;
        } else {
            create(data, cb);
        }
    });
}

function create(data, cb) {
  
    var obj = commonFunction.jsonToString(data);
    var query = connection.query('INSERT INTO "Users" ('+obj.key+') values '+obj.values+'', (err, res) => {
        if (err) {
            var err_msg = "Network Error Occured";
            cb('err', err_msg);
            return;
        }else{
            //        var err_msg = "Thanks for creating an account. To activate your account, please check your email address. Don't forget to check your SPAM folder.";
            var sql = 'SELECT * FROM "Users" WHERE "Email" = \'' + data[0].Email + '\' AND "Password" = \''+ data[0].Password + '\'';
            var query = connection.query(sql, (err, results) => {
                if (err) {
                    var err_msg = "Error Occured";
                    cb('err', err_msg);
                    return;
                }else{
                    var err_msg = "Thanks for creating an account. Please login.";
                    cb('success', results.rows);
                } 
            });
        }
    });
   
}

function Login(email, username, cb){
    var sql = 'SELECT * FROM "Users" WHERE "Email" = \''+email+'\'';
    
    var query = connection.query(sql, (err, results) => {
        if (err) {
            cb(err);
            return;
        }
        cb(null, results.rows);
    });
    
}
function updateUser(data,id, cb){
    //console.log(data,'-----',id)
    var str = commonFunction.jsonToUpdateString(data);
   //console.log('string**********',str);
    var query = connection.query('UPDATE "Users" SET '+str+'  where "ID"=($1) ',[id], (err, res) => {
      //  console.log('UPDATE "Users" SET '+str+'  where "ID"=($1) ');
        if (err) {
            var err_msg = "Network Error Occured";
            cb('err', err_msg);
            return;
        }
        //console.log('res',res);
        cb('success', err_msg);
    });
}

module.exports = {
    checkRegistration:checkRegistration,
    create:create,
    Login:Login,
    updateUser:updateUser
};