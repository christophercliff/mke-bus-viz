var lib = require('./')
var path = require('path')
var Promise = require('bluebird')

var fs = Promise.promisifyAll(require('fs'))

var PATH = path.resolve(__dirname, '../src/data/routes/')

;(function write() {
    return lib.getGeoJSON()
        .then(function(routes){
            var tasks = routes.map(function(route){
                var file = path.join(PATH, JSON.parse(route).properties.id + '.json')
                console.log('Writing: ', file)
                return fs.writeFileAsync(file, route)
            })
            return Promise.all(tasks)
        })
        .then(function(){
            console.log('Done.')
        })
})()
