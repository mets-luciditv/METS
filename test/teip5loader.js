var assert = require('assert');
var teip5loader = require('../lib/teip5loader')
var DOMParser = require('xmldom').DOMParser;
var fs = require('fs');
var should = require('should');
var xml_1=fs.readFileSync("test/T010001.xml",'utf8')
var xmldoc_1 = new DOMParser().parseFromString(xml_1,'text/xml');
var xml_2=fs.readFileSync("test/A000001.xml",'utf8')
var xmldoc_2 = new DOMParser().parseFromString(xml_2,'text/xml');
var XMLSerializer=require("xmldom").XMLSerializer;


describe('tei p5 loader', function() {
  before(function(){
  process.env= {
        "dbHost":'localhost',
        "dbPort":33060,
        "dbUser":'root',
        "dbPassword":'A6=t+XQ3ec'
    };
});
  describe('#getJingId()', function() {
    it('T010001', function() {
       teip5loader.getJingId(xmldoc_1).should.be.exactly("T010001");
    });
    it('A000001', function() {
      teip5loader.getJingId(xmldoc_2).should.be.exactly("A000001");
    });
  });
   describe('#getTitle()', function() {
    it('四家合註', function() {
      teip5loader.getTitle(xmldoc_1).should.be.exactly("四家合註")
    });
    it('現觀根本頌', function() {
      teip5loader.getTitle(xmldoc_2).should.be.exactly("現觀根本頌")
    });
  });

    describe('#getAuthors()', function() {
        it('5 authors', function() {
          teip5loader.getAuthors(xmldoc_1).should.be.deepEqual([ '宗喀巴大師', '語王堅穩尊者', '妙音笑大師', '札帝格西', '札帝格西' ]);
        });
        it('1 author', function() {
          teip5loader.getAuthors(xmldoc_2).should.be.deepEqual([ '慈尊' ]);
        });
    });

    describe('#getTocNode()', function() {
        it('#1', function() {
          var toc=teip5loader.getTocNode(xmldoc_1);
          toc.should.have.property("tagName","div");
          toc.getAttribute("type").should.be.exactly("toc")
        });
        it('#2', function() {
          var toc=teip5loader.getTocNode(xmldoc_2);
          toc.should.have.property("tagName","div");
          toc.getAttribute("type").should.be.exactly("toc")
        });
    });

    describe('#getTovNode()', function() {
        it('#1', function() {
          var tov=teip5loader.getTovNode(xmldoc_1);
          tov.should.have.property("tagName","div");
          tov.getAttribute("type").should.be.exactly("tov")
        });
        it('#2', function() {
          var tov=teip5loader.getTovNode(xmldoc_2);
          tov.should.have.property("tagName","div");
          tov.getAttribute("type").should.be.exactly("tov")
        });
    });

     describe('#getVolume()', function() {
        it('#1', function() {
            var volumes=teip5loader.getVolume(xmldoc_1);
            volumes.length.should.exactly(1)
        });
        it('#2', function() {
            var volumes=teip5loader.getVolume(xmldoc_2);
            volumes.length.should.exactly(2)
        });
    });


     describe('#xmldom serialize to xml string', function() {
        it('#1', function() {
            new XMLSerializer().serializeToString(xmldoc_1).should.be.exactly(xml_1);    
        });
        it('#2', function() {
            new XMLSerializer().serializeToString(xmldoc_2).should.be.exactly(xml_2);
        });
    });
         describe('#parseVolume', function() {
        it('#1 轉成文字後，空白的與換行的量有不同。文字部門一至',  function(done) {
          this.timeout(5000);
            var volumes= teip5loader.getVolume(xmldoc_1);
            teip5loader.parseVolume(volumes[0],"T010001").then(function(data){
              data.should.have.properties({volume_id:"V001",volume_title:"卷一"})
              assert.equal(data.text.replace(/\s/g,""),fs.readFileSync("test/T010001_Text.txt","utf8").replace(/\s/g,""));
              assert.equal(data.html.replace(/\s/g,""),fs.readFileSync("test/T010001_Html.txt","utf8").replace(/\s/g,""));
              done();
            })
            
       
        });
        it('#2',  function() {
            var volumes=teip5loader.getVolume(xmldoc_2);
            return teip5loader.parseVolume(volumes[0],"A000001").should.eventually.have.properties({volume_id:"V001",volume_title:"卷一"});
  
           
           // teip5loader.parseVolume(volumes[1]).should.have.properties({volume_id:"V002",volume_title:"卷二"})
            
        });
    });
    describe('#findLineIds', function() {
      it('#1',function(){
          var lineIds=teip5loader.findLineIds(xmldoc_1);
          lineIds.should.is.Array().with.lengthOf(112);
      });
      it('#1',function(){
        var volumes=teip5loader.getVolume(xmldoc_2);
        teip5loader.findLineIds(volumes[0]).should.is.Array().have.length(284)
         teip5loader.findLineIds(volumes[1]).should.is.Array().have.length(149)
      })
    });
        describe('#importXml', function() {
      it('#1',function(){
          return teip5loader.importXml(xml_1).catch(console.log).should.eventually.match({"responseHeader":{"status":0}});
      });
      it('#2',function(){
          return teip5loader.importXml(xml_2).catch(console.log).should.eventually.match({"responseHeader":{"status":0}});
      });
    });
});