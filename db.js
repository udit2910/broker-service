'use strict'

const _ = require('lodash')
const mongoose = require('mongoose')
const { autoIncrement } = require('mongoose-plugin-autoinc')
mongoose.Promise = global.Promise
const config = require('config')

// Object holding all your connection strings
const connections = {}

/**
 * Return a middleware that generates Request ID and
 * sets in a header.
 *
 * @return {function} Express middleware.
 */
module.exports = (opts) => {
  this.opts = _.cloneDeep(opts)
  this.opts.host = this.opts.host || 'localhost:27017'
  this.opts.host = this.opts.host.toString()

  const connect = async (dbName) => {
    if (!this.opts) {
      this.opts = config.database
    }
    // If db name is not provided, connect to default db
    dbName = dbName || this.opts.default_db_name
    console.log('connect() dbName=%s', dbName)
    
    if (connections[dbName]) {
      console.log('connect() connection exists');
      // database connection already exist. Return connection object
      return connections[dbName]
    }

    // Get new connection
    connections[dbName] = await createNewConnection(this.opts, dbName)

    connections[dbName].once('open', function callback () {
        console.log('connect() MongoDB connected successfully')
    })
    return connections[dbName]
  }

  return { connect, autoIncrement }
}

async function createNewConnection (opts, dbName) {
  // opts.host = "localhost:27017"
  // let url = `mongodb://${opts.host}/${dbName}`
  let url = `${opts.host}/${dbName}`
  if (opts.replica_set) {
    url = url + `?replicaSet=${opts.replica_set}`
  }
  console.log('connect() url=%s', url);

  // Get mongo options
  const mongoOptions = await getMongoOptions(opts)
  console.log('connect() creating a connection to %s', dbName)

  // Create & return new connection
  return mongoose.createConnection(url, mongoOptions)
}

async function getMongoOptions (opts) {
  const mongoOptions = opts.mongo_options
    mongoOptions.authSource = opts.auth_source

  return mongoOptions
}
