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
var teip5xml =require("../lib/teip5loader")
const winston = require('winston');
router.post('/upload', upload.single('teip5xml'), function (req, res, next) {
  winston.info(req.file);
  if(req.file.mimetype != "text/xml" && req.file.mimetype != "application/xml"){
       res.json({success:false,msg:"請上傳XML檔案。"});
        fs.unlink(req.file.path,err=>{
            if(err){
                winston.error(err);
            }
        });
  }
  else{
        fs.readFile(req.file.path,'utf8',(err,xml)=>{
                teip5xml.importXml(xml).then(function(result){
                    res.json({success:true,file:req.file.originalname});
                    fs.unlink(req.file.path,err=>{
                        if(err){
                            winston.error(err);
                        }
                    });
                },function(err){
                    res.json({success:false,msg:err});
                    fs.unlink(req.file.path,err=>{
                        if(err){
                            winston.error(err);
                        }
                    });
                })
        })
  }
  

  
});


let patt_id = /^[A-Z]{1}\d{6}V\d{3}$/i;
let patt_path=/^([A-Z]{1}\d{6})(P\d{4}L\d{2})$/i;
let patt_jingId=/^([A-Z]{1}\d{6})$/i;

module.exports = router;