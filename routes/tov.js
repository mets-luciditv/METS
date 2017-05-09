var express = require('express');
var router = express.Router();
var tov=require("../model/Tov")
const winston = require('winston');
router.get('/read', function(req, res, next) {
    tov.read(req.query.node).then(obj=>{
        res.json(obj);
    }).catch(reason=>{
        winston.error(reason);
        res.status(500).json(reason)
    })
});
router.all("/rebuildMpttIndex",function(req, res, next){
        tov.rebuildMpttIndex().then(obj=>{
            res.json({success:true});
        }).catch(reason=>{
            winston.error(reason);
            res.status(500).json(reason)
        })
})
module.exports = router;