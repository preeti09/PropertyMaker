var express = require('express');
var router = express.Router();

var getModel = require(`./model-${require('../../config').get('DATA_BACKEND')}`);

router.post('/', function (req, res, next) {
    getModel.addNewsletter(req.body,(err, msg)=>{
        if(err){
            return;
        }
        var url = '/';
        if(req.session.redirect){
            url = req.session.redirect;   
        }
        req.flash('success', 'Requirement added successfully.', url);
    });
});

module.exports = router;
