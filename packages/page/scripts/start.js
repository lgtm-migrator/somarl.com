'use strict'

process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

process.on('unhandledRejection', err => {
  throw err
})

// Ensure environment variables are read.
require('../config/env')

const fs = require('fs')
const chalk = require('chalk')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const clearConsole = require('react-dev-utils/clearConsole')
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles')
const {
  choosePort,
  createCompiler,
  prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils')
const paths = require('../config/paths')
const config = require('../config/webpack.config.dev')
const createDevServerConfig = require('../config/webpackDevServer.config')

const useYarn = fs.existsSync(paths.yarnLockFile)
const isInteractive = process.stdout.isTTY

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000
const HOST = process.env.HOST || '0.0.0.0'
const PUBLIC_HOST = process.env.PUBLIC_HOST || false

if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) process.exit(1)


choosePort(HOST, DEFAULT_PORT)
  .then(port => {
    if (port === null) return

    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
    const appName = require(paths.appPackageJson).name
    const urls = prepareUrls(protocol, HOST, port)
    if (PUBLIC_HOST) {
      urls.lanUrlForTerminal = `${protocol}://${PUBLIC_HOST}`
    }

    const compiler = createCompiler({webpack, config, appName, urls, useYarn})

    const serverConfig = createDevServerConfig()
    const devServer = new WebpackDevServer(compiler, serverConfig)

    devServer.listen(port, HOST, err => {
      if (err) return console.log(err)
      if (isInteractive) clearConsole()

      console.log(chalk.cyan('Starting the development server...\n'))
    })

    ; ['SIGINT', 'SIGTERM'].forEach(sig => process.on(sig, () => {
      devServer.close()
      process.exit()
    }))
  })
  .catch(err => {
    if (err && err.message) console.error(err.message)
    process.exit(1)
  })
