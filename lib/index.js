var _ = require('lodash-node')
var client = require('mke-bus').create()
var polyline = require('polyline')
//var path = require('path')
//var Promise = require('bluebird')

//var fs = Promise.promisifyAll(require('fs'))

exports.getPatternPolyline = getPatternPolyline

function getPatternPolyline() {
    return client.getAllRoutes()
        .then(function(routes){
            return client.getAllPatternsWhere({
                route_id: _.findWhere(routes, { id: '30' }).id
            })
        })
        .then(function(patterns){
            return client.getPatternCalled(_.first(patterns).id)
        })
        .then(function(pattern){
            var points = _.map(pattern.points, function(point){
                return [point.latitude, point.longitude]
            })
            return polyline.encode(points)
        })
}
