var lib = require('./')
var path = require('path')
var Promise = require('bluebird')

var fs = Promise.promisifyAll(require('fs'))

var PUBLIC_PATH = '/data/routes/'
var PATH = path.resolve(__dirname, '../src/data/routes/')

;(function write() {
    var manifest = { routes: [] }
    return lib.getGeoJSON()
        .then(function(routes){
            var tasks = routes.map(function(route){
                var name = JSON.parse(route).properties.id + '.json'
                var file = path.join(PATH, name)
                manifest.routes.push(path.join(PUBLIC_PATH, name))
                console.log('Writing: ', file)
                return fs.writeFileAsync(file, route)
            })
            return Promise.all(tasks)
        })
        .then(function(){
            return fs.writeFileAsync(path.join(PATH, 'manifest.json'), JSON.stringify(manifest, null, '  '))
        })
        .then(function(){
            console.log('Done.')
        })
})()
