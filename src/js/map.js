var _ = require('underscore')

var LAYER_ID = 'christophercliff.j3973813'

module.exports = Map

function Map(options) {
    var map = L.mapbox.map(options.el)
    var transform = d3.geo.transform({
        point: function (x, y) {
            var point = map.latLngToLayerPoint(new L.LatLng(y, x))
            this.stream.point(point.x, point.y)
        }
    })
    var path = d3.geo.path().projection(transform)
    var container = d3.select(map.getPanes().overlayPane).append('svg')

    map
        .on('viewreset', this.resetRoute.bind(this))
        .addLayer(L.mapbox.tileLayer(LAYER_ID))

    this.map = map
    this.transform = transform
    this.path = path
    this.container = container
}

_.extend(Map.prototype, {

    addRoute: function (data) {
        this.properties = data.properties
        this.route = _.first(data.features)
        this.group = this.container.append('g').attr('class', 'leaflet-zoom-hide')
        this.group2 = this.container.append('g').attr('class', 'leaflet-zoom-hide')
        this.feature = this.group.selectAll('path')
            .data([this.route])
            .enter()
            .append('path')
        this.feature2 = this.group2.selectAll('path')
            .data([this.route])
            .enter()
            .append('path')

        this.map.fitBounds(L.mapbox.featureLayer(this.route).getBounds())
    },

    resetRoute: function () {
        var bounds = this.path.bounds(this.route)
        var x1 = bounds[0][0]
        var y1 = bounds[0][1]
        var x2 = bounds[1][0]
        var y2 = bounds[1][1]

        this.container
            .attr('width', x2 - x1)
            .attr('height', y2 - y1)
            .style('left', x1 + 'px')
            .style('top', y1 + 'px')

        this.group
            .attr('transform', 'translate(' + -x1 + ', ' + -y1 + ')')

        this.group2
            .attr('transform', 'translate(' + -x1 + ', ' + -y1 + ')')

        this.feature
            .attr('d', this.path)
            .attr('stroke-linecap', 'round')
            .style('stroke', 'rgba(0, 0, 0, 0.50)')
            .style('stroke-width', '12px')

        this.feature2
            .attr('d', this.path)
            .attr('stroke-linecap', 'round')
            .style('stroke', this.properties.color)
            .style('stroke-width', '4px')
    }

})

_.extend(Map, {

    create: function (options) {
        return new Map(options)
    }

})
