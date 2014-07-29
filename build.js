var connect = require('connect')
var fingerprint = require('metalsmith-fingerprint')
var ignore = require('metalsmith-ignore')
var markdown = require('metalsmith-markdown')
var Metalsmith = require('metalsmith')
var optimize = require('webpack').optimize
var path = require('path')
var static = require('serve-static')
var templates = require('metalsmith-templates')
var watch = require('metalsmith-simplewatch')
var webpack = require('metalsmith-webpack')

var isDev = false

process.argv.forEach(function(val) {
    if (val === 'dev') isDev = true
})

var metalsmith = new Metalsmith(__dirname)
var webpackPlugins = []

if (!isDev) {
    // optimize for production build
    webpackPlugins = [
        new optimize.DedupePlugin(),
        new optimize.UglifyJsPlugin({
            comments: /^remove all comments$/,
            mangle: true
        })
    ]
}

metalsmith
    .use(webpack({
        context: path.resolve(__dirname, './src/js/'),
        devtool: 'source-map',
        entry: './index.js',
        module: {
            loaders: [
                { test: /\.json$/, loader: 'json-loader' }
            ]
        },
        output: {
            filename: 'index.js',
            library: 'app',
            libraryTarget: 'var',
            path: '/js'
        },
        plugins: webpackPlugins,
        target: 'node'
    }))
    .use(fingerprint({
        pattern: 'js/index.js'
    }))
    .use(markdown({
        gfm: true
    }))
    .use(templates({
        engine: 'handlebars',
        directory: './src/templates/',
        pattern: '**/*.html'
    }))
    .use(ignore([
        'templates/*'
    ]))

if (isDev) {
    metalsmith
        .use(watch())
}

metalsmith
    .build(function(err){
        if (err) throw err
    })

if (isDev) {
    connect()
        .use(static(path.resolve(__dirname, './build/')))
        .listen(8000, function(){
            console.log('running on port 8000')
        })
}
