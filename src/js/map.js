var _ = require('underscore')

var LAYER_ID = 'christophercliff.j3973813'

module.exports = Self

function Self(options) {
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
        //.on('viewreset', this.resetRoute.bind(this))
        .addLayer(L.mapbox.tileLayer(LAYER_ID))

    this.map = map
    this.transform = transform
    this.path = path
    this.container = container
}

_.extend(Self.prototype, {

    addRoute: function (data) {
        this.properties = data.path.properties
        this.route = data.path
        this.group = this.container.append('g').attr('class', 'leaflet-zoom-hide')
        this.feature = this.group.selectAll('path')
            .data([this.route])
            .enter()
            .append('path')

        this.map
            .addLayer(L.mapbox.featureLayer(this.route))
            .addLayer(L.mapbox.featureLayer(data.stops))
            .fitBounds(L.mapbox.featureLayer(this.route).getBounds())
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

        this.feature
            .attr('d', this.path)
            .attr('stroke-linecap', 'round')
            .style('stroke', this.properties.color)
            .style('stroke-width', '4px')

        this.feature.transition()
            .duration(5e3)
            .attrTween('stroke-dasharray', _.bind(function(){
                var path = this.feature.node()
                var length = path.getTotalLength()
                var start = ['0', length].join()
                var end = [length, length].join()
                var interpolate = d3.interpolateString(start, end)
                return _.bind(function(t){
                    var point = path.getPointAtLength(t*length)
                    var center = this.map.layerPointToLatLng(new L.Point(point.x, point.y))
                    this.map.panTo(center, 14)
                    return interpolate(t)
                }, this)
            }, this))
    }

})

_.extend(Self, {

    create: function (options) {
        return new Self(options)
    }

})
