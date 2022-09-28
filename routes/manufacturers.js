const express = require('express');

const app = express.Router();
const { getDetails, insertDetails, updateDetails, deleteDetails, getDetailsWithLimit } = require('../repositories/manufacturers');

// fetched all mfgs details added by user
app.get('/get/:user_id', async (req, res) => {
  try {
    const userId = req.params['user_id']
    const offset = Number(req.query['offset'])
    const limit = Number(req.query['limit'])
    const query = generateQueryForGetDetails(userId)
    const [response, mfgs] = await Promise.all([
      getDetails(query, getCommonProjection(), 'broker_master'),
      getDetailsWithLimit(query, getCommonProjection(), offset, limit,'broker_master')
    ])
    const resp = {}
    resp.count = response.length
    resp.data = mfgs
    console.log('fetched mfgs details : %j , %s', resp , resp)
    if (resp && resp.count > 0) {
    res.status(200).json(resp)
    } else {
      res.status(204).json()
    }
  } catch (error){
    res.status(500).json(error)
    console.log('error while getting mfgs details : %j , %s', error , error)
    throw error
  }
});

// add a mfg
app.put('/add', async (req, res) => {
  try {
    const reqBody = req.body
    const mfgs = await insertDetails([reqBody], getCommonProjection(),'broker_master')
    console.log('added details : %j , %s', mfgs , mfgs)
    res.status(200).json(mfgs);
  } catch (error) {
    res.status(500).json(error)
    console.log('error while inserting details: %j , %s', error , error)
    throw error
  }
});

// delete a mfg
app.delete('/remove/:user_id/:mfg_id', async (req, res) => {
  try {
    const query = generateQueryForDeleteDetails(req.params)
    const response = await deleteDetails(query, 'broker_master')
    console.log('deleted details: %j , %s', response , response)
    if (response.deletedCount > 0) {
      res.status(200).json('deleted Successfully')
    } else {
      res.status(400).json('No mfg found')
    }
  } catch (error) {
    res.status(500).json(error)
    console.log('error while deleting details: %j , %s', error , error)
  }
});

// update a mfg
app.post('/update', async (req, res) => {
  try {
    const query = generateQueryForUpdateDetails(req.body)
    const response = await updateDetails(query, generateUpdateJson(req.body), 'broker_master')
    console.log('updated details : %j , %s', response , response)
    res.status(200).json('updated Successfully')
  } catch (error) {
    res.status(500).json(error)
    console.log('error while updating details: %j , %s', error , error)
  }
});


function generateQueryForGetDetails (userId) {
  return getQuery('added_by', '$eq', Number(userId))
}

function generateQueryForUpdateDetails (reqBody) {
  const query = []
  query.push(getQuery('manufacturer_id', '$eq', Number(reqBody.mfg_id)))
  query.push(getQuery('added_by', '$eq', Number(reqBody.user_id)))
  return getQueryArrayForOperation('$and', query)
}

function generateQueryForDeleteDetails (reqBody) {
  const query = []
  query.push(getQuery('manufacturer_id', '$eq', Number(reqBody.mfg_id)))
  query.push(getQuery('added_by', '$eq', Number(reqBody.user_id)))
  return getQueryArrayForOperation('$and', query)
}

function generateUpdateJson(reqBody) {
  const json = {}
  json['qualities'] = reqBody.qualities
  json['name'] = reqBody.name
  return getUpdateJsonFormat(json)
}

const getUpdateJsonFormat = (updateJson) => {
  let json = {}
  json['$set'] = updateJson
  console.log(`updateJson: %j`,json)
  return json
}

const getQuery = (fieldName, operation, value) => {
  let query = {}
  query[fieldName] = {}
  query[fieldName][operation] = value
  console.log(`Query to be executed: %j`,query)
  return query
}

const getQueryArrayForOperation = (operation, query) => {
  let operatedQuery = {}
  operatedQuery[operation] = query
  console.log(`Query operation to be executed: %j`,operatedQuery)
  return operatedQuery
}

function getCommonProjection() {
  const json = {}
  json['_id'] = false
  json['__v'] = false
  return json
}


module.exports = app;

