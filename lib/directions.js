var _ = require('underscore')
var config = require('./config.json')
var path = require('path')
var pattern = require('../src/data/patterns/30-329-west.json')
var polyline = require('polyline')
var Promise = require('bluebird')
var qs = require('querystring').stringify
var util = require('util')
var Wreck = require('wreck')

var fs = Promise.promisifyAll(require('fs'))

var URL = 'https://maps.googleapis.com/maps/api/directions/json'
var WRITE_PATH = path.resolve(__dirname, '../src/data/patterns/30-329-west.json')
var REQUESTS_PER_PERIOD = 10
var PERIOD = 1e3

var groups = _.chain(pattern.stops.features)
    .map(function(n1, i, arr){
        var n2 = arr[i + 1]
        if (!n2) return null
        return [n1, n2]
    })
    .compact()
    .map(function(group){
        var origin = _.clone(group[0].geometry.coordinates).reverse()
        var destination = _.clone(group[1].geometry.coordinates).reverse()
        return [
            URL,
            qs({
                origin: origin.join(','),
                destination: destination.join(','),
                key: config.GOOGLE_KEY
            })
        ].join('?')
    })
    .groupBy(function(url, i){
        return Math.floor(i/REQUESTS_PER_PERIOD)
    })
    .toArray()
    .value()

Promise
    .reduce(groups, function(responses, group){
        console.log(util.format('getting batch %s...%s', responses.length, responses.length + group.length))
        return Promise.all(_.map(group, get))
            .delay(PERIOD)
            .then(function(r){
                return responses.concat(r)
            })
    }, [])
    .then(function(responses){
        var paths = _.chain(responses)
            .map(function(response){
                if (_.isString(response.error_message)) throw new Error(response.error_message)
                return _.first(response.routes).overview_polyline.points
            })
            .map(_.bind(polyline.decode, polyline))
            .value()
        pattern.path2 = {
            type: 'Feature',
            geometry: {
                type: 'MultiLineString',
                coordinates: paths
            }
        }
        return fs.writeFileAsync(WRITE_PATH, JSON.stringify(pattern, null, '  '))
    })
    .then(function(){
        console.log('Done!')
    })

function get(url) {
    return new Promise(function(resolve, reject){
        Wreck.get(url, function(err, res, body){
            if (err) return reject(err)
            return resolve(JSON.parse(body))
        })
    })
}
