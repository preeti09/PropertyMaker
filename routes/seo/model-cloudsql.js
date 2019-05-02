// var connection = require('../config');
const connection = require("../../db-connection");
var each = require('foreach');

function loginUser(data,cb) {
console.log('SELECT * FROM "AdminLogins" WHERE "UserID" = \'' + data.username + '\' AND "Password" = \''+ data.password + '\'');
    var sql = 'SELECT * FROM "AdminLogins" WHERE "UserID" = \'' + data.username + '\' AND "Password" = \''+ data.password + '\''; 
    connection.query(sql, (err, results) => {
        
        if (err) {
            var data = {
                status : 'danger',
                msg : 'Error Occured',
            }
            cb('err', data);
            return;
        } 
        
        if (results.rows.length > 0) {
            var data = {
                status : 'success',
                msg : 'Login Successfull ! Redirecting...',
            }    
            cb('success', data);                   
        }
        else {
            var data = {
                status : 'danger',
                msg : 'Incorrect Username OR Password !',
            }
            cb('err', data);
            return;
        }
    });
}

function getGridData(cb) {
    var sql = 'SELECT * FROM "av_seo"';
     
    connection.query(sql, (err, results) => {
            
        if (err) {
            var data = {
                status : 'danger',
                msg : 'Error Occured',
            }
            cb('err', data);
            return;
        } 
        if (results.rows.length > 0) {
            var data = {
                status : 'success',
                msg : results.rows,
            }    
            cb('success', data);                   
        }
        else {
            var data = {
                status : 'danger',
                msg : 'No Data Found',
            }
            cb('err', data);
            return;
        }
    });
}

function changeStatus(id,status,cb) {

    var sql = 'UPDATE "av_seo" SET "status" = \'' + status + '\' WHERE "ID" =' + id; 
    var query = connection.query(sql,(err, results) => {
        if (err) {
            var data = {
                status : 'danger',
                msg : 'Error Occured',
            }
            cb('err', data);
            return;
        } 
        if (results.rowCount > 0) {
            var data = {
                status : 'success',
                msg : 'Status changed Successfully!',
            }    
            cb('success', data); 
            return;                  
        }else {
            var data = {
                status : 'danger',
                msg : 'Server Error Occure. Please try again.',
            }
            cb('err', data);
            return;
        }
    });
}

function deleteRow(id,cb) {

    var sql = 'DELETE FROM "av_seo" WHERE "ID" =' + id; 
    var query = connection.query(sql,(err, results) => {
        
        if (err) {
            var data = {
                status : 'danger',
                msg : 'Error Occured',
            }
            cb('err', data);
            return;
        } 
        if (results.rowCount > 0) {
            var data = {
                status : 'success',
                msg : 'Data deleted successfully !',
            }    
            cb('success', data); 
            return;                  
        }else {
            var data = {
                status : 'danger',
                msg : 'Server Error Occure. Please try again.',
            }
            cb('err', data);
            return;
        }
    });
}

function saveData(data,cb) {
    var obj = jsonToString(data);
    var sql = 'INSERT INTO "av_seo" ('+obj.key+') values '+obj.values+'';
    connection.query(sql,(err, results) => {
        if (err) {
            var data = {
                status : 'danger',
                msg : 'Error Occured',
            }
            cb('err', data);
            return;
        } 
        if (results.rowCount > 0) {
            var data = {
                status : 'success',
                msg : 'Data saved successfully!',
            }    
            cb('success', data);  
            return;                 
         }else {
            var data = {
                status : 'danger',
                msg : 'Server Error Occure. Please try again.',
            }
            cb('err', data);
            return;
        } 
    });
}

function getDataByID(ID,cb) {
    var sql = 'SELECT * FROM "av_seo" WHERE "ID" = '+ ID;
    connection.query(sql,(err, results) => {
        if (err) {
            var data = {
                status : 'danger',
                msg : 'Error Occured',
            }
            cb('err', data);
            return;
        } 
        if (results.rowCount > 0) {
            var data = {
                status : 'success',
                msg : 'Get data successfully!',
            }    
            cb('success', results.rows[0]);  
            return;                 
         }else {
            var data = {
                status : 'danger',
                msg : 'Server Error Occure. Please try again.',
            }
            cb('err', data);
            return;
        }
    });
}

function updateData(data,id,cb) {
    var str = jsonToUpdateString(data[0]);
    var sql = 'UPDATE "av_seo" SET '+str+' WHERE "ID" =' + id; 
    var query = connection.query(sql,(err, results) => {
        
        if (err) {
            var data = {
                status : 'danger',
                msg : 'Error Occured',
            }
            cb('err', data);
            return;
        } 
         if (results.rowCount > 0) {
            var data = {
                status : 'success',
                msg : 'Data saved successfully!',
            }    
            cb('success', data); 
            return;                  
         } else {
            var data = {
                status : 'danger',
                msg : 'Server Error Occure. Please try again.',
            }
            cb('err', data);
            return;
        } 
    });
}

function checkUrl_Exists (url,cb) {
  var sql = 'SELECT * FROM "av_seo" WHERE "page_url"= \'' + url + '\'';
  var query = connection.query(sql,
    (err, results) => {
        if (err) {
            var data = {
                status : 'danger',
                msg : 'Error Occured',
            }
            cb('err', data);
            return;
        }
        if (results.rowCount > 0) {
            var data = {
                status : 'success',
                msg : results.rows[0],
            }    
            cb('success', data);                   
        }
        else {
            var data = {
                status : 'danger',
                msg : 'No row Available',
            }
            cb('err', data);
            return;
        }
    }
  );
}

function jsonToString(data){
    
    
    var keys = '';
    var values = '';
    each(data, function (value, key, object) {
        
        keys = '';
        var temp = '';
        values += '(';
        each(value, function (value1, key1, object1) {
            keys += '"'+ key1 +'",';
            if(value1 == null){
                temp += value1+',';
            } else {

                if(typeof(value1) == 'string'){
                  temp += '\''+value1.replace("'",'&quot;')+'\',';
                }else{
                  temp += '\''+value1+'\',';    
                }
                
            }
        });
        values += temp.slice(0,-1)+'),';
        
    });
    
    keys = keys.slice(0,-1);
    values = values.slice(0,-1);
    return {key:keys,values:values}; 
}

function jsonToUpdateString(data){
    var str = '';
    each(data, function (value, key, object) {
        
        if(value == null){
            str += '"'+ key +'"='+value+',';
        }else{
            str += '"'+ key +'"=\''+value+'\',';
        }
    });
    str = str.slice(0,-1);
    return str; 
}


module.exports = {
    loginUser,
    getGridData,
    saveData,
    checkUrl_Exists,
    updateData,
    changeStatus,
    deleteRow,
    getDataByID,
    
}