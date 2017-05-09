var express = require('express');
var router = express.Router();
var toc=require("../model/Toc")
const winston = require('winston');
router.get('/read', function(req, res, next) {
    toc.read(req.query.node).then(obj=>{
        res.json(obj);
    }).catch(reason=>{
        winston.error(reason);
        res.status(500).json(reason)
    })
});
router.all("/rebuildMpttIndex",function(req, res, next){
        toc.rebuildMpttIndex().then(obj=>{
            res.json({success:true});
        }).catch(reason=>{
            winston.error(reason);
            res.status(500).json(reason)
        })
})
module.exports = router;