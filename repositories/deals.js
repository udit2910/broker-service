'use strict'

require('../models/deals-v_1_0_0')

const getDetails = async (query, projection, tenant) => {
  try {
    const db = await global.db.connect(tenant)
    const collection = db.model('deals')
    let response = await collection.find(
      query, projection
    )
    return response
  } catch (error) {
    console.log(`Error in giving response: %s , %j`, error, error)
    throw error
  }
}

const getDetailsWithLimit = async (query, projection, offset, limit, tenant) => {
  try {
    const db = await global.db.connect(tenant)
    const collection = db.model('deals')
    let response = await collection.find(
      query, projection
    ).skip(offset).limit(limit)
    return response
  } catch (error) {
    console.log(`Error in giving response: %s , %j`, error, error)
    throw error
  }
}

const insertDetails = async (reqbody, projection, tenant) => {
  try {
    const db = await global.db.connect(tenant)
    const collection = db.model('deals')
    let response = await collection.insertMany(
      reqbody, projection
    )
    return response
  } catch (error) {
    console.log(`Error in giving response: %s , %j`, error, error)
    throw error
  }
}

const updateDetails = async (query, updateJson, tenant) => {
  try {
    const db = await global.db.connect(tenant)
    const collection = db.model('deals')
    let response = await collection.updateMany(
      query, updateJson, getUpdatedJsonInResponse(true)
    )
    return response
  } catch (error) {
    console.log(`Error in updating details: %s , %j`, error, error)
    throw error
  }
}

const deleteDetails = async (query, tenant) => {
  try {
    const db = await global.db.connect(tenant)
    const collection = db.model('deals')
    let response = await collection.deleteMany(
      query
    )
    return response
  } catch (error) {
    console.log(`Error in updating details: %s , %j`, error, error)
    throw error
  }
}


const getUpdatedJsonInResponse = (value) => {
  let json = {}
  json['new'] = value
  return json
}


module.exports = {
  getDetails,
  insertDetails,
  updateDetails,
  deleteDetails,
  getDetailsWithLimit
}
