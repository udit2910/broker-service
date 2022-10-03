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
    // let response = await collection.find(
    //   query, projection
    // ).skip(offset).limit(limit)

    if (offset && limit) {
      let response = await collection.aggregate([
        getMatchForOperation(query),
        getProject(projection),
        getLookup('manufacturers', 'mfg_id', 'manufacturer_id', 'mfg'),
        setProject('mfg', "$mfg.name"),     
        getLookup('parties', 'party_id', 'party_id', 'party'),
        setProject('party', "$party.name"),
        { "$skip": offset },
        { "$limit": limit },
      ])
  
      return response
    } else {
      let response = await collection.aggregate([
        getMatchForOperation(query),
        getProject(projection),
        getLookup('manufacturers', 'mfg_id', 'manufacturer_id', 'mfg'),
        setProject('mfg', "$mfg.name"),     
        getLookup('parties', 'party_id', 'party_id', 'party'),
        setProject('party', "$party.name"),
      ])
  
      return response
    }


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

const getMatchForOperation = (query) => {
  let operatedQuery = {}
  operatedQuery['$match'] = query
  console.log(`Query operation to be executed: %j`,operatedQuery)
  return operatedQuery
}

const getProject = (projection) => {
  let project = {}
  project['$project'] = projection
  console.log(`project Query operation to be executed: %j`,project)
  return project
}

const getLookup = (from, localField, foreignField, as) => {
  let json = {}
  json['$lookup'] = {}
  json['$lookup']['from'] = from
  json['$lookup']['localField'] = localField
  json['$lookup']['foreignField'] = foreignField
  json['$lookup']['as']= as

  console.log(`lookup Query operation to be executed: %j`,json)
  return json
}

const setProject = (as, projectField) => {
  let project = {}
  project['$set'] = {}
  project['$set'][as] = { $arrayElemAt: [projectField, 0] }
  console.log(`setProject Query operation to be executed: %j`,project)
  return project
}

module.exports = {
  getDetails,
  insertDetails,
  updateDetails,
  deleteDetails,
  getDetailsWithLimit
}
