var express = require('express');
var router = express.Router();
var solr = require('solr-client');
var client = solr.createClient({core:"volume"});

router.get('/get1stDocByJingId', function(req, res, next) {
   var jingId=req.query.jingId;
   
});
module.exports = router;