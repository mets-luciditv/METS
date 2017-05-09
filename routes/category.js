var express = require('express');
var router = express.Router();
var category=require("../model/Category")
const winston = require('winston');
router.get('/read', function(req, res, next) {
    category.read(req.query.node).then(obj=>{
        res.json(obj);
    }).catch(reason=>{
        winston.error(reason);
        res.status(500).json(reason)
    })
});
router.get('/getTree', function(req, res, next) {
    category.getTree(req.query.id).then(obj=>{
        res.json(obj);
    }).catch(reason=>{
        winston.error(reason);
        res.status(500).json(reason)
    })
});
router.post('/add', function(req, res, next) {
    var nodes=[];
    if(req.body instanceof Array){
        nodes=req.body;
    }
    else{
        nodes=[req.body];
    }
    category.add(nodes).then(obj=>{
        res.json({success:true});
    }).catch(reason=>{
        winston.error(reason);
        res.status(500).json(reason)
    })
});
router.post("/remove",function(req, res, next){
    var ids=[];
    if(req.body instanceof Array){
        ids=req.body.map(node=>node.id);
    }
    else{
        ids=[req.body.id];
    }
    category.remove(ids).then(obj=>{
        res.json({success:true});
    }).catch(reason=>{
        winston.error(reason);
        res.status(500).json(reason)
    })
})
router.post("/update",function(req, res, next){
    if(req.body instanceof Array){
        category.update(req.body).then(obj=>{
            res.json({success:true});
        }).catch(reason=>{
            winston.error(reason);
            res.status(500).json(reason)
        })
    }
    else{
        category.update([req.body]).then(obj=>{
            res.json({success:true});
        }).catch(reason=>{
            winston.error(reason);
            res.status(500).json(reason)
        })
    }

})
router.all("/rebuildMpttIndex",function(req, res, next){
        category.rebuildMpttIndex().then(obj=>{
            res.json({success:true});
        }).catch(reason=>{
            winston.error(reason);
            res.status(500).json(reason)
        })
})
module.exports = router;