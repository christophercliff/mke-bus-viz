var client = require('mke-bus').create()
var forEach = require('lodash-node/modern/collections/foreach')

client.getAllRoutes()
    .error(function(err){ throw err })
    .then(function(routes){
        forEach(routes, function(route){
            var el = document.createElement('pre')
            el.innerHTML = JSON.stringify(route)
            document.body.appendChild(el)
        })
    })
