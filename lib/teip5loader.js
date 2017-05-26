var program = require('commander');
var DOMParser = require('xmldom').DOMParser;
var XMLSerializer=require("xmldom").XMLSerializer;
var xslt = require('xslt4node');
var xpath = require('xpath');
var Promise = require('promise');
const uuidV4 = require('uuid/v4');
var readFile = Promise.denodeify(require('fs').readFile);
var Toc=require("../model/Toc")
var Tov=require("../model/Tov")
const path=require("path")
var solr = require('solr-client');
var client = solr.createClient({core:"volume"});
const util = require('util');
var select= xpath.useNamespaces({tei:"http://www.tei-c.org/ns/1.0",xml:"http://www.w3.org/XML/1998/namespace"});
 /*   
program
  .version('0.0.1')
  .usage('[options] <file ...>')
  .parse(process.argv);
  process.env={
            "dbHost":'localhost',
            "dbPort":33060,
            "dbUser":'root',
            "dbPassword":'A6=t+XQ3ec'
        };
Promise.all([
readFile(program.args[0],'utf8').then(importXml)
]);
*/
async function importXml(xml){
    var doc = new DOMParser().parseFromString(
    xml
    ,'text/xml');
    var jing_id=getJingId(doc);
    var title=getTitle(doc);
    var authors=getAuthors(doc);
    await processToc(doc)
    await processTov(doc)
    var volumes=getVolume(doc,jing_id);
    var inputs=[];
    for(i in volumes){
        var volume =await parseVolume( volumes[i],jing_id);
        
        volume.id=util.format("%s%s",jing_id,volume.volume_id);
        volume.text=[volume.text];
        volume.html=[volume.html];
        volume.xml=[volume.xml];
        volume.jing_id=jing_id;
        volume.jing_title=title;
        volume.author=authors;
        inputs.push(volume)


    }
    return new Promise((resolve,reject)=>{
        client.add(inputs,{commit:true},(err,obj)=>{
            if(err){
                reject(err);
            }
            else{
                resolve(obj);
            }
        });
    });
}
module.exports.importXml=importXml;
function findLineIds(xmldom){
    var nodes=select(".//tei:lb[@xml:id]",xmldom);
    return nodes.map(node=>node.getAttribute("xml:id"))
}
module.exports.findLineIds=findLineIds;
async function parseVolume(volumeNode,jing_id){
    var volume_id=volumeNode.getAttribute("xml:id")
    var volume_title=volumeNode.getAttribute("n")
    var xml=new XMLSerializer().serializeToString(volumeNode);
    var text= await xsltToText(xml);
    var html=await xsltToHtml(xml,jing_id);
    text=text.replace(/\n/g,"")
    html=html.replace(/\n/g,"")
    return {volume_id:volume_id,volume_title:volume_title,xml:xml,text:text,html:html,lineids:findLineIds(volumeNode)}
}
module.exports.parseVolume=parseVolume;
function xsltToText(xml){
    var config = {
            xsltPath:path.join(__dirname,"text.xslt") ,
            source: xml,
            result:String,
            props: {
                indent: 'yes'
            }
        };
    return new Promise((resovle,reject)=>{
        xslt.transform(config, function (err,data) {
        if (err) {
            reject(err);
        }
        else{
            resovle(data);
        }
    });
    });
}
function xsltToHtml(xml,jing_id){
    var config = {
            xsltPath:path.join(__dirname,"tei2html.xslt") ,
            source: xml,
            result:String,
            params: {
                jing_id: jing_id
            },
            props: {
                indent: 'yes'
            }
        };
    return new Promise((resovle,reject)=>{
        xslt.transform(config, function (err,data) {
        if (err) {
            reject(err);
        }
        else{
            resovle(data);
        }
    });
    });
}
function getVolume(xmldoc){
    var nodes=select('/tei:TEI/tei:text/tei:body/*',xmldoc);
    var results=[];
    var volumeNode=null;
    for(i in nodes){
        var node=nodes[i];
        if(node.tagName=="milestone"){
            if(volumeNode){
                results.push(volumeNode);
                volumeNode=null;
            }
            volumeNode=xmldoc.createElementNS("http://www.tei-c.org/ns/1.0","div");
            for(p=0;p< node.attributes.length;p++){
                volumeNode.setAttribute(node.attributes[p].name,node.attributes[p].value)
            }
        }
        else{
            if(volumeNode)
            {
                volumeNode.appendChild(node.cloneNode(true));
            }
            else{
                console.log(node)
            }
        }
    }
    if(volumeNode){
        results.push(volumeNode);
    }
    return results;
}
module.exports.getVolume=getVolume;
function getJingId(xmldoc){
    return select("/tei:TEI/@xml:id",xmldoc,true).nodeValue;
}
module.exports.getJingId=getJingId;
function getTitle(xmldoc){
    return select("/tei:TEI/tei:teiHeader/tei:fileDesc/tei:titleStmt/tei:title",xmldoc,true).firstChild.nodeValue;
}
module.exports.getTitle=getTitle;
function getAuthors(xmldoc){
    var authorNodes=select("/tei:TEI/tei:teiHeader/tei:fileDesc/tei:titleStmt/tei:author",xmldoc);
    var authors=[];
    for(i=0;i<authorNodes.length;i++){
        authors.push(select("tei:persName",authorNodes[i],true).firstChild.nodeValue);
    }
    return authors;
}
module.exports.getAuthors=getAuthors;
function getTocNode(xmldoc){
    var toc=select('/tei:TEI/tei:text/tei:front/tei:div[@type = "toc"]',xmldoc,true);
    return toc;
}
module.exports.getTocNode=getTocNode;
function getTovNode(xmldoc){
    var toc=select('/tei:TEI/tei:text/tei:front/tei:div[@type = "tov"]',xmldoc,true);
    return toc;
}
module.exports.getTovNode=getTovNode;

async function processToc(doc){
    var toc=getTocNode(doc);
    let jing_id=getJingId(doc);
    let title=getTitle(doc);
    await Toc.remove([jing_id]);
    var root={id:jing_id,text:title}  
    var buffer=[];  
    await AddTocNode(root, toc, "root", 0,buffer);
    return Toc.add(buffer);
}
module.exports.processToc=processToc;

async function processTov(doc){
    var tov=getTovNode(doc);
    let jing_id=getJingId(doc);
    let title=getTitle(doc);
    await Tov.remove([jing_id]);
    var root={id:jing_id,text:title}    
    var buffer=[];
    await AddTovNode(root, tov, "root", 0,buffer);
    return Tov.add(buffer);
}
module.exports.processTov=processTov;

async function AddTocNode(node,element,parentId,index,buffer){
    
    if(select("tei:head",element,true)){
       node.text=select("tei:head",element,true).firstChild.nodeValue;
    }
    if(select("tei:link/@target",element,true)){
       node.target=select("tei:link/@target",element,true).nodeValue;
    }
    buffer.push({id:node.id,text:node.text,target:node.target,parentId:parentId,index:index,leaf:select("tei:div",element).length==0?1:0});
    var i =0;
    var childs=select("tei:div",element)
    for(var childs_i=0;childs_i<childs.length;childs_i++){
        var item=childs[childs_i];
        var child={id:uuidV4()};
        await AddTocNode(child, item, node.id, i++,buffer);
    }
}
async function AddTovNode(node,element,parentId,index,buffer){
    if(select("tei:head",element,true)){
       node.text=select("tei:head",element,true).firstChild.nodeValue;
    }
    if(select("tei:link/@target",element,true)){
       node.target=select("tei:link/@target",element,true).nodeValue
    }
    buffer.push({id:node.id,text:node.text,target:node.target,parentId:parentId,index:index,leaf:select("tei:div",element).length==0?1:0});
    var i =0;
    var childs=select("tei:div",element)
    for(var childs_i=0;childs_i<childs.length;childs_i++){
        var item=childs[childs_i];
        var child={id:uuidV4()};
        await AddTovNode(child, item, node.id, i++,buffer);
    }
}

