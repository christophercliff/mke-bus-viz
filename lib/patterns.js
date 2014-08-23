var _ = require('underscore')
var client = require('mke-bus').create()
var Promise = require('bluebird')

exports.getData = getData
exports.getGeoJSON = getGeoJSON

function getData() {
    var _routes
    return client.getAllRoutes()
        .then(function(routes){
            _routes = routes
            var tasks = _.map(routes, function(route){
                return client.getAllPatternsWhere({
                    route_id: route.id
                })
            })
            return Promise.all(tasks)
        })
        .then(function(routePatterns){
            return _.chain(_routes)
                .map(function(route, i){
                    return _.map(routePatterns[i], function(pattern){
                        return _.extend({}, route, {
                            pattern_id: pattern.id,
                            direction: pattern.direction,
                            path: pattern.points,
                            stops: getStops(pattern.points)
                        })
                    })
                })
                .flatten()
                .value()
        })
}

function getGeoJSON() {
    return getData()
        .then(toGeoJSON)
}

function toGeoJSON(patterns) {
    return _.map(patterns, function(pattern){
        return {
            path: {
                type: 'Feature',
                properties: _.omit.apply(_, [
                    pattern,
                    'path',
                    'stops'
                ]),
                geometry: {
                    type: 'LineString',
                    coordinates: _.map(pattern.path, function(point){
                        return [
                            point.longitude,
                            point.latitude
                        ]
                    })
                }
            },
            stops: {
                type: 'FeatureCollection',
                features: _.map(pattern.stops, function(stop){
                    return {
                        type: 'Feature',
                        properties: _.omit.apply(_, [
                            stop,
                            'latitude',
                            'longitude'
                        ]),
                        geometry: {
                            type: 'Point',
                            coordinates: [
                                stop.longitude,
                                stop.latitude
                            ]
                        }
                    }
                })
            }
        }
    })
}

function getStops(points) {
    return _.chain(points)
        .filter(function(point){ return point.type === 'S' })
        .map(function(point){
            return _.extend(_.omit.apply(_, [
                point,
                'distance',
                'stop_id',
                'stop_name',
                'type'
            ]), {
                id: point.stop_id,
                name: point.stop_name
            })
        })
        .value()
}
