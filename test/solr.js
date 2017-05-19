var assert = require('assert');
var should = require('should');
var solr = require('../routes/solr')
describe('tei p5 loader', function() {
    describe("#parseSearchString()",function(){
        it("#1 &&",function(){
            solr.parseSearchString("པའི་ཚུལ་ &&     རྗེ་བཙུན་").should.be.equal('"པའི་ཚུལ་" && "རྗེ་བཙུན་"')
            solr.parseSearchString("པའི་ཚུལ་  &&  རྗེ་བཙུན་").should.be.equal('"པའི་ཚུལ་" && "རྗེ་བཙུན་"')
            solr.parseSearchString("པའི་ཚུལ་  &&and  རྗེ་བཙུན་").should.be.equal('"པའི་ཚུལ་" "&&and" "རྗེ་བཙུན་"')
            solr.parseSearchString('པའི་ཚུལ་  "&&"  རྗེ་བཙུན་').should.be.equal('"པའི་ཚུལ་" "&&" "རྗེ་བཙུན་"')
        });
        it("#2 AND",function(){
            solr.parseSearchString("པའི་ཚུལ་ AND རྗེ་བཙུན་").should.be.equal('"པའི་ཚུལ་" AND "རྗེ་བཙུན་"')
            solr.parseSearchString("པའི་ཚུལ་ and རྗེ་བཙུན་").should.be.equal('"པའི་ཚུལ་" AND "རྗེ་བཙུན་"')
            solr.parseSearchString('པའི་ཚུལ་  "and"  རྗེ་བཙུན་').should.be.equal('"པའི་ཚུལ་" "and" "རྗེ་བཙུན་"')
        });
        it("#3 OR",function(){
            solr.parseSearchString("པའི་ཚུལ་ OR རྗེ་བཙུན་").should.be.equal('"པའི་ཚུལ་" OR "རྗེ་བཙུན་"')
            solr.parseSearchString("པའི་ཚུལ་ or རྗེ་བཙུན་").should.be.equal('"པའི་ཚུལ་" OR "རྗེ་བཙུན་"')
        });
        it("#4 ||",function(){
            solr.parseSearchString("པའི་ཚུལ་ || རྗེ་བཙུན་ || སྐབས་དང་པོ").should.be.equal('"པའི་ཚུལ་" || "རྗེ་བཙུན་" || "སྐབས་དང་པོ"')
            solr.parseSearchString("པའི་ཚུལ་ || རྗེ་བཙུན་").should.be.equal('"པའི་ཚུལ་" || "རྗེ་བཙུན་"')
        });
        it("#5 +",function(){
            solr.parseSearchString("པའི་ཚུལ་ +རྗེ་བཙུན").should.be.equal('"པའི་ཚུལ་" +"རྗེ་བཙུན"');
        })
        it("#6 not",function(){
            solr.parseSearchString("པའི་ཚུལ་ not རྗེ་བཙུན").should.be.equal('"པའི་ཚུལ་" NOT "རྗེ་བཙུན"');
        })
        it("#7 !",function(){
            solr.parseSearchString("པའི་ཚུལ་ !རྗེ་བཙུན").should.be.equal('"པའི་ཚུལ་" !"རྗེ་བཙུན"');

        })
        it("#8 -",function(){
            solr.parseSearchString("པའི་ཚུལ་ -རྗེ་བཙུན").should.be.equal('"པའི་ཚུལ་" -"རྗེ་བཙུན"');
            solr.parseSearchString("པའི་ཚུལ་ -སྐབས་དང་པོ").should.be.equal('"པའི་ཚུལ་" -"སྐབས་དང་པོ"');
            
        })
    });
});