var express = require('express');
var Promise = require('promise');
const util = require('util');
var router = express.Router();
var solr = require('solr-client');
var client = solr.createClient({core:"volume"});
var solr_CategoryByPart = solr.createClient({core:"CategoryByPart"});

router.get('/search', function(req, res, next) {
    var searchtext=req.query.q;
    var query = client.createQuery()
				  .q("\""+searchtext+"\"")
                  .set("hl.method=fastVector")
                  .set("hl.phraseLimit=100000")
                  .set("hl.tag.pre="+encodeURIComponent('<em data-hl-group="$seq">'))
				  .hl({on:true,fl:"text",snippets:100000,usePhraseHighlighter:true})
                  .fl(["id", "jing_id", "jing_title", "volume_id","volume_title", "author"])
                  .sort({'volume_id':'asc'})
    if(req.query.jing_ids instanceof Array){
        query.set( "fq=jing_id:"+encodeURIComponent("("+req.query.jing_ids.join(" OR ")+")"));
    }
    else if (typeof req.query.jing_ids != 'undefined'){
        query.matchFilter("jing_id",req.query.jing_ids)
    }
    client.search(query,function(err,obj){
    if(err){
        res.json(err);
    }else{
        for(i in obj.response.docs){
            obj.response.docs[i].hit_count=obj.highlighting[obj.response.docs[i].id]["text"].length;
        }
        delete obj.highlighting;
        res.json(obj);
    }
    });
    
});

let patt_id = /^[A-Z]{1}\d{6}V\d{3}$/i;
let patt_path=/^([A-Z]{1}\d{6})(P\d{4}L\d{2})$/i;
let patt_jingId=/^([A-Z]{1}\d{6})$/i;
router.post('/GetDocByPath',function(req, res, next) {
    var id=req.body.id;
    var query = client.createQuery() 
                  .fl(["id", "jing_id", "jing_title", "volume_id","volume_title", "author","html"])
    if(patt_id.test(id))
    {
        query=query.matchFilter("id",id).q("*:*");
    }
    
    if(patt_path.test(id))
    {
        var matches=patt_path.exec(id);
        query=query.matchFilter("jing_id",matches[1]).q(matches[2]).df("lineids");
    }
    if(patt_jingId.test(id)){
        var matches=patt_jingId.exec(id);
        query=query.matchFilter("jing_id",matches[1]).rows(1).sort({'volume_id':'asc'}).q("*:*")
    }
    client.search(query,function(err,obj){
    if(err){
        res.json(err);
    }else{
        res.json(obj);
    }
    });
});
router.post('/GetHighlightDoc', function(req, res, next) {
    var id=req.body.id;
    var q=req.body.q;
    var query = client.createQuery()
				  .q("\""+q+"\"")
                  .set("hl.method=fastVector")
                  .set("hl.phraseLimit=100000")
                  .set("f.html.hl.fragListBuilder=single")
                  .set("f.text.hl.fragListBuilder=weighted")
                  .set("hl.tag.pre="+encodeURIComponent('<em class="highlight" data-hl-group="$seq">'))
				  .hl({on:true,fl:["html","text"],snippets:100000,usePhraseHighlighter:true})
                  .fl(["id", "jing_id", "jing_title", "volume_id","volume_title", "author"])
    query=query.matchFilter("id",id);
    client.search(query,function(err,obj){
    if(err){
        res.json(err);
    }else{
        for(i in obj.response.docs){
            obj.response.docs[i].html=obj.highlighting[obj.response.docs[i].id]["html"][0];
            obj.response.docs[i].hit_fragments=obj.highlighting[obj.response.docs[i].id]["text"].map(function(currentValue, index, arr){
                return {GroupId:index+1,Fragment:currentValue};
            });
        }
        delete obj.highlighting;
        res.json(obj);
    }
    });
    
});
module.exports = router;