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
            var tasks = routes.map(function(route){
                return client.getAllDirectionsWhere({
                    route_id: route.id
                })
            })
            return Promise.all(tasks)
        })
        .then(function(routeDirections){
            return _routes = _.chain(_routes)
                .map(function(route, i){
                    return routeDirections[i].map(function(direction){
                        return _.extend(_.clone(route), {
                            direction: direction
                        })
                    })
                })
                .flatten()
                .value()
        })
        .then(function(routes){
            var tasks = routes.map(function(route){
                return client.getAllStopsWhere({
                    route_id: route.id,
                    direction: route.direction
                })
            })
            return Promise.all(tasks)
        })
        .then(function(routeStops){
            return _routes.map(function(route, i){
                return _.extend(route, {
                    stops: routeStops[i]
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
            properties: _.omit(route, 'stops'),
            features: (route.stops || []).map(function(stop){
                return {
                    type: 'Feature',
                    properties: _.omit(stop, 'latitude', 'longitude'),
                    geometry: {
                        type: 'Point',
                        coordinates: [
                            stop.longitude,
                            stop.latitude
                        ]
                    }
                }
            })
        }, null, '  ')
    })
}
