var _ = require('lodash-node')
var client = require('mke-bus').create()
var Promise = require('bluebird')

exports.getData = getData
exports.getGeoJSON = getGeoJSON

function getData() {
    var _routes
    return client.getAllRoutes()
        .then(function(routes){
            _routes = routes
            var tasks = routes.map(function(route){
                return client.getAllPatternsWhere({
                    route_id: route.id
                })
            })
            return Promise.all(tasks)
        })
        .then(function(routePatterns){
            return _routes.map(function(route, i){
                return _.extend(route, {
                    patterns: routePatterns[i]
                })
            })
        })
}

function getGeoJSON() {
    return getData()
        .then(toGeoJSON)
}

function toGeoJSON(routes) {
    return routes.map(function(route){
        return JSON.stringify({
            type: 'FeatureCollection',
            properties: _.omit(route, 'patterns'),
            features: (route.patterns || []).map(function(pattern){
                return {
                    type: 'Feature',
                    properties: _.omit(pattern, 'points'),
                    geometry: {
                        type: 'LineString',
                        coordinates: pattern.points.map(function(point){
                            return [
                                point.longitude,
                                point.latitude
                            ]
                        })
                    }
                }
            })
        }, null, '  ')
    })
}
