var lib = require('./')
var path = require('path')
var Promise = require('bluebird')
var util = require('util')

var fs = Promise.promisifyAll(require('fs'))

var PUBLIC_PATH = '/data/%s/'
var WRITE_PATH = path.resolve(__dirname, '../src/data/%s/')

all() // run

exports.all = all
exports.patterns = patterns
exports.stops = stops

function all() {
    return Promise.all([
            patterns(),
            stops()
        ])
        .then(function(){
            console.log('All complete!')
        })
}

function patterns() {
    var type = 'patterns'
    var publicPath = util.format(PUBLIC_PATH, type)
    var writePath = util.format(WRITE_PATH, type)
    var manifest = { routes: [] }
    return lib.patterns.getGeoJSON()
        .then(function(routes){
            var tasks = routes.map(function(route){
                var name = (JSON.parse(route).properties.id + '.json').toLowerCase()
                var file = path.join(writePath, name)
                manifest.routes.push(path.join(publicPath, name))
                console.log('Writing: ', file)
                return fs.writeFileAsync(file, route)
            })
            return Promise.all(tasks)
        })
        .then(function(){
            return fs.writeFileAsync(path.join(writePath, 'manifest.json'), JSON.stringify(manifest, null, '  '))
        })
        .then(function(){
            console.log(util.format('`%s` complete!', type))
        })
}

function stops() {
    var type = 'stops'
    var publicPath = util.format(PUBLIC_PATH, type)
    var writePath = util.format(WRITE_PATH, type)
    var manifest = { routes: [] }
    return lib.stops.getGeoJSON()
        .then(function(routes){
            var tasks = routes.map(function(route){
                var properties = JSON.parse(route).properties
                var name = util.format('%s-%s.json', properties.id, properties.direction).toLowerCase()
                var file = path.join(writePath, name)
                manifest.routes.push(path.join(publicPath, name))
                console.log('Writing: ', file)
                return fs.writeFileAsync(file, route)
            })
            return Promise.all(tasks)
        })
        .then(function(){
            return fs.writeFileAsync(path.join(writePath, 'manifest.json'), JSON.stringify(manifest, null, '  '))
        })
        .then(function(){
            console.log(util.format('`%s` complete!', type))
        })
}
