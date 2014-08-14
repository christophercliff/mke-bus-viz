var _ = require('underscore')
var manifest = require('../data/routes/manifest.json')
var template = require('../templates/map.hbs')

var ROUTE_URL = manifest.routes[10]
//var ROUTE_URL = '/data/us-states.json'
var TEMPLATE = template()
var LAYER_ID = 'christophercliff.j3973813'
var ACCESS_TOKEN = 'pk.eyJ1IjoiY2hyaXN0b3BoZXJjbGlmZiIsImEiOiJqYzBuVG1jIn0.JMJhmtPBlRKnSn1m1aod0Q'

L.mapbox.accessToken = ACCESS_TOKEN

exports.start = start

function start() {
    document.body.innerHTML = TEMPLATE
    d3.json(ROUTE_URL, ready)
}

function ready(data) {
    var route = _.first(data.features)
    var featureLayer = L.mapbox.featureLayer(route)
    var map = L.mapbox.map('map')
    var container = d3.select(map.getPanes().overlayPane).append('svg')
    var group = container.append('g').attr('class', 'leaflet-zoom-hide')
    var group2 = container.append('g').attr('class', 'leaflet-zoom-hide')
    var transform = d3.geo.transform({
        point: function (x, y) {
            var point = map.latLngToLayerPoint(new L.LatLng(y, x))
            this.stream.point(point.x, point.y)
        }
    })
    var path = d3.geo.path().projection(transform)
    var feature = group.selectAll('path')
        .data([route])
        .enter()
        .append('path')
    var feature2 = group2.selectAll('path')
        .data([route])
        .enter()
        .append('path')

    map
        .on('viewreset', reset)
        .addLayer(L.mapbox.tileLayer(LAYER_ID))
        .fitBounds(featureLayer.getBounds())

    reset()

    function reset() {
        var bounds = path.bounds(data)
        var x1 = bounds[0][0]
        var y1 = bounds[0][1]
        var x2 = bounds[1][0]
        var y2 = bounds[1][1]

        container
            .attr('width', x2 - x1)
            .attr('height', y2 - y1)
            .style('left', x1 + 'px')
            .style('top', y1 + 'px')

        group
            .attr('transform', 'translate(' + -x1 + ', ' + -y1 + ')')
        group2
            .attr('transform', 'translate(' + -x1 + ', ' + -y1 + ')')

        feature
            .attr('d', path)
            .attr('stroke-linecap', 'round')
            .style('stroke', data.properties.color)

        feature2
            .attr('d', path)
            .attr('stroke-linecap', 'round')
            .style('stroke', 'white')
            .style('stroke-width', '3px')
    }
}
