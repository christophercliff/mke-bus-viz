require('d3/d3.js')

var manifest = require('../data/patterns/manifest.json')
var Map = require('./map')
var Promise = require('bluebird')
var template = require('../templates/map.hbs')

var PATTERN_URL = manifest['329']
var MAP_HTML = template()
var ACCESS_TOKEN = 'pk.eyJ1IjoiY2hyaXN0b3BoZXJjbGlmZiIsImEiOiJqYzBuVG1jIn0.JMJhmtPBlRKnSn1m1aod0Q'
var LOAD_TIMEOUT = 10e3

L.mapbox.accessToken = ACCESS_TOKEN

exports.map = initMap

function initMap() {
    var map
    document.body.innerHTML = MAP_HTML
    map = Map.create({
        el: 'map'
    })
    load(PATTERN_URL).then(map.addRoute.bind(map))
}

function load(src) {
    return new Promise(function(resolve, reject){
        setTimeout(reject, LOAD_TIMEOUT)
        d3.json(src, resolve)
    })
}
