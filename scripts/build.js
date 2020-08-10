process.env.NODE_ENV = 'production'
process.on('unhandledRejection', err => {
    throw err
})

const chalk = require('chalk')
const webpack = require('webpack')

const webpackConfig = require('../webpack.config')('production')
const { formatBytes } = require('./util')

webpack(webpackConfig, (error, status) => {
    if (error) {
        console.log(chalk.red(error.message))
    } else {
        console.log(chalk.green('Compiled successfully\n'))
        const result = status.toJson()
        console.log(result.outputPath)
        result.assets.forEach(item => {
            console.log(formatBytes(item.size) + chalk.cyan(item.name))
        })
        console.log()
    }
})
