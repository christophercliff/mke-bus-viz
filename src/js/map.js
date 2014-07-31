var _ = require('underscore')
var template = require('../templates/map.hbs')
var routes = require('../data/routes/manifest.json').routes

var LAYER_ID = 'christophercliff.j3973813'
L.mapbox.accessToken = 'pk.eyJ1IjoiY2hyaXN0b3BoZXJjbGlmZiIsImEiOiJqYzBuVG1jIn0.JMJhmtPBlRKnSn1m1aod0Q'

exports.start = start

function start() {
    var tileLayer = L.mapbox.tileLayer(LAYER_ID)
    var featureLayer = L.mapbox.featureLayer(routes[_.random(0, routes.length)])
    var lmap
    document.body.innerHTML = template()
    lmap = L.mapbox.map('map')
    lmap.addLayer(tileLayer)
    featureLayer.on('ready', function(){
        lmap.addLayer(featureLayer)
            .fitBounds(featureLayer.getBounds())
    })
}
