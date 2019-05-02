'use strict';
var in_array = require('in_array');
const connection = require("../../db-connection");

function loginUser(username, password, cb) {

    var sql = 'SELECT * FROM "Users" WHERE "Email" = \'' + username + '\' AND "Password" = \''+ password + '\'';
    
    var query = connection.query(sql, (err, results) => {
        if (err) {
            var err_msg = "Error Occured";
            cb('err', err_msg);
            return;
        } 
        // console.log('results.rows', results.rows);
        if (results.rows.length > 0) {    
            results.rows.msg = "Login Successfull !";
            cb('success', results.rows);                   
        }
        else {
            var err_msg = "Incorrect Username OR Password !";
            cb('err', err_msg);
            return;
        }
    });
}
function checkEmail_Exists (email,cb) {
  connection.query(
    'SELECT "Email" FROM "Users" where "Email"=\''+ email +'\'',
    (err, results) => {
      
      if (err) {
        cb(err);
        return;
      }
      
      cb(null, results.rows);
    }
  );
}
function update_num (email, data, cb) {
    
  connection.query(
    'UPDATE "Users" SET "token"=$1 WHERE "Email" = $2', [data.Token, email], (err,res) => {
        console.log(err,res);
      if (err) {
        cb(err);
        return;
      }
      cb(null,'Done');
    });
}

function update_password (email,token,data, cb) {
    console.log('UPDATE "Users" SET "Password" = \''+data.password+'\' WHERE "Email" = \''+email+'\' AND "token" = \''+token+'\'');
  var query = connection.query(
    'UPDATE "Users" SET "Password" = \''+data.password+'\' WHERE "Email" = \''+email+'\' AND "token" = \''+token+'\'', (err,res) => {
            if (err) {
              cb(err);
              return;
            }
        
        connection.query('UPDATE "Users" SET "token"= NULL WHERE "Email" = \''+email+'\'',  (err) => {
              if (err) {
                cb(err);
                return;
            }
              
              cb(null,'Done');   
          });  
                  
    });
}

function getPopularPost(cb){

    var query = connection.query('SELECT * FROM "Properties" order by "ID" DESC limit 3 ',(err, results)=>{
        if (err) {
            cb(err);
            return;
        }
        cb(null, results.rows);
    });
}
function apiCheckEmailAvailability(email,cb){
    var query = 'SELECT * FROM "Users" WHERE "Email" = \''+email+'\''
    var query = connection.query(query,(err, results)=>{
        if (err) {
            cb(err);
            return;
        }
        cb(null, results.rows);
    });
}

module.exports = {
    loginUser: loginUser,
    checkEmail_Exists:checkEmail_Exists,
    update_num:update_num,
    update_password:update_password,
    getPopularPost:getPopularPost,
    apiCheckEmailAvailability:apiCheckEmailAvailability
};
