require('d3/d3.js')

var manifest = require('../data/routes/manifest.json')
var Map = require('./map')
var template = require('../templates/map.hbs')

var ROUTE_URL = manifest.routes[10]
var MAP_HTML = template()
var ACCESS_TOKEN = 'pk.eyJ1IjoiY2hyaXN0b3BoZXJjbGlmZiIsImEiOiJqYzBuVG1jIn0.JMJhmtPBlRKnSn1m1aod0Q'

L.mapbox.accessToken = ACCESS_TOKEN

exports.map = initMap

function initMap() {
    var map
    document.body.innerHTML = MAP_HTML
    map = Map.create({
        el: 'map'
    })
    d3.json(ROUTE_URL, map.addRoute.bind(map))
}
