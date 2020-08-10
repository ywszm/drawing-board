process.env.NODE_ENV = 'development'
process.on('unhandledRejection', err => {
    throw err
})

const webpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')

const webpackConfig = require('../webpack.config')('development')
const envConfig = require('../config/env.config')('development')
const serverConfig = require('../config/devServer.config')

const compiler = webpack(webpackConfig)
const server = new webpackDevServer(compiler, serverConfig)
server.listen(envConfig.port, envConfig.host, () => {
    // the server is listening
})
