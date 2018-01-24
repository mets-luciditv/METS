var express = require('express');
var Promise = require('promise');
const util = require('util');
var router = express.Router();
var solr = require('solr-client');
var client = solr.createClient({core:"volume"});
var solr_CategoryByPart = solr.createClient({core:"CategoryByPart"});
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var path=require('path')
var fs=require('fs')
const winston = require('winston');




module.exports = router;