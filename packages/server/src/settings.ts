/**
 * @desc To keep this most basic configs portable and kinda ... clean,
 *       it should not import other libs or local files.
 */

import './helpers/env'

// tslint:disable: max-line-length
const SERVER_PORT_DEV = 3001
const SERVER_PORT_PROD = 8081
const SERVER_CNAME = 'api'
const SERVER_HOST = 'dev.local'
const SERVER_PROTOCOL = 'http' // TODO: SSL and http/2
const JWT_SECRET_DEV = 'TBLq4!4.2m'
const MONGO_PORT_DEFAULT = 27017
const MONGO_DB_DEFAULT = 'test'
const BINKS_DIR = '/home/sy/Dropbox/bing/persistent'
const SINA_APP_KEY = 1524513978 // this doesn't have to be a secret


export default class S {
  public static ENV = process.env.SOMARL_ENV || 'dev'
  public static SERVER_PORT = process.env.SERVER_PORT || S.ENV === 'prod' ? SERVER_PORT_PROD : process.env.SERVER_PORT_DEV || SERVER_PORT_DEV
  public static SERVER_URI = `${SERVER_PROTOCOL}://${SERVER_CNAME}.${SERVER_HOST}`
  public static SERVER_URL = S.SERVER_URI

  public static MONGO_PORT = process.env.MONGO_PORT || MONGO_PORT_DEFAULT
  public static MONGO_DB = process.env.MONGO_DB || MONGO_DB_DEFAULT
  public static MONGO_HOST = process.env.MONGO_HOST || `localhost`
  public static MONGO_URI = `mongodb://${S.MONGO_HOST}:${S.MONGO_PORT}`
  public static MONGO_OPTIONS = {
    useNewUrlParser: true,
  }

  public static JWT_SECRET = process.env.JWT_SECRET || JWT_SECRET_DEV
  public static JWT_OPTIONS = {
    secret: S.JWT_SECRET,
  }

  public static ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://192.168.1.119:3000',
    'http://www.somarl.com',
    'https://www.somarl.com',
    'http://somarl.com',
    'https://somarl.com',
    'http://192.168.1.119:3001',
  ]

  public static DARKSKY_SECRETKEY = process.env.DARKSKY_SECRETKEY || ''
  public static BINKS_DIR = process.env.BINKS_DIR || BINKS_DIR

  public static SINA_APP_KEY = SINA_APP_KEY
}


export {
  S as SETTINGS
}
