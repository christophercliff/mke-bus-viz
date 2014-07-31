var lib = require('../')
var linter = require('geojsonhint')

var TIMEOUT = 20e3

describe('lib', function(){

    describe('getData()', function(){

        this.timeout(TIMEOUT)

        it('should get the data', function(done){
            lib.getData()
                .then(function(data){
                    data.should.be.an.Array
                    return done(null)
                }, done)
        })

    })

    describe('getGeoJSON()', function(){

        this.timeout(TIMEOUT)

        it('should get the GeoJSON', function(done){
            lib.getGeoJSON()
                .then(function(data){
                    data.should.be.an.Array
                    data.forEach(function(json){
                        linter.hint(json).forEach(function(err){
                            if (err) return done(new Error(err.message))
                        })
                    })
                    return done(null)
                }, done)
        })

    })

})
