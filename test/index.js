var lib = require('../')
var linter = require('geojsonhint')

var TIMEOUT = 20e3

describe('patterns', function(){

    describe('getData()', function(){

        this.timeout(TIMEOUT)

        it('should get the data', function(done){
            lib.patterns.getData()
                .then(function(data){
                    data.should.be.an.Array
                    return done(null)
                }, done)
        })

    })

    describe('getGeoJSON()', function(){

        this.timeout(TIMEOUT)

        it('should get the GeoJSON', function(done){
            lib.patterns.getGeoJSON()
                .then(function(data){
                    data.should.be.an.Array
                    data.forEach(function(pattern){
                        linter.hint(JSON.stringify(pattern.path)).forEach(function(err){
                            if (err) return done(new Error(err.message))
                        })
                        linter.hint(JSON.stringify(pattern.stops)).forEach(function(err){
                            if (err) return done(new Error(err.message))
                        })
                    })
                    return done(null)
                }, done)
        })

    })

})
