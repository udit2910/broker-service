const express = require('express');

const app = express.Router();
const { getDetails, insertDetails, updateDetails, deleteDetails, getDetailsWithLimit } = require('../repositories/deals');

// fetched all deals details added by user
app.get('/get/:user_id', async (req, res) => {
  try {
    const userId = req.params['user_id']
    const offset = Number(req.query['offset'])
    const limit = Number(req.query['limit'])
    const startDate = req.query['startDate']
    const endDate = req.query['endDate']
    const party_id = req.query['party_id']
    const mfg_id = req.query['mfg_id']

    const query = generateQueryForGetDetails(userId, startDate, endDate, party_id, mfg_id)
    const [response, deals] = await Promise.all([
      getDetails(query, getCommonProjection(), 'broker_master'),
      getDetailsWithLimit(query, getCommonProjection(), offset, limit,'broker_master')
    ])
    const resp = {}
    resp.count = response.length
    resp.data = deals
    console.log('fetched deals details : %j , %s', resp , resp)
    if (resp && resp.count > 0) {
    res.status(200).json(resp)
    } else {
      res.status(204).json()
    }
  } catch (error){
    res.status(500).json(error)
    console.log('error while getting deals details : %j , %s', error , error)
    throw error
  }
});

// add a deal
app.put('/add', async (req, res) => {
  try {
    const reqBody = req.body
    const deals = await insertDetails([reqBody], getCommonProjection(),'broker_master')
    console.log('added details : %j , %s', deals , deals)
    res.status(200).json(deals);
  } catch (error) {
    res.status(500).json(error)
    console.log('error while inserting details: %j , %s', error , error)
    throw error
  }
});

// delete a deal
app.delete('/remove/:user_id/:deal_id', async (req, res) => {
  try {
    const query = generateQueryForDeleteDetails(req.params)
    const response = await deleteDetails(query, 'broker_master')
    console.log('deleted details: %j , %s', response , response)
    if (response.deletedCount > 0) {
      res.status(200).json('deleted Successfully')
    } else {
      res.status(400).json('No deal found')
    }
  } catch (error) {
    res.status(500).json(error)
    console.log('error while deleting details: %j , %s', error , error)
  }
});

// update a deal
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


function generateQueryForGetDetails (userId, startDate, endDate, party_id, mfg_id) {
  const query = []

  let startRange = startDate ? startDate : getDefaultDateRange(true)
  let endRange = endDate ? endDate : getDefaultDateRange(false)

  startRange = new Date(startRange)
  endRange = new Date(endRange)
  endRange.setHours(23, 59, 59);

  query.push(getQuery('deal_date', '$gte',startRange))
  query.push(getQuery('deal_date', '$lt',endRange))
  query.push(getQuery('added_by', '$eq', Number(userId)))

  if (party_id) {
    query.push(getQuery('party_id', '$eq', Number(party_id)))
  }
  if (mfg_id) {
    query.push(getQuery('mfg_id', '$eq', Number(mfg_id)))
  }
  return getQueryArrayForOperation('$and', query)
}



function generateQueryForUpdateDetails (reqBody) {
  const query = []
  query.push(getQuery('deal_id', '$eq', Number(reqBody.deal_id)))
  query.push(getQuery('added_by', '$eq', Number(reqBody.user_id)))
  return getQueryArrayForOperation('$and', query)
}

function generateQueryForDeleteDetails (reqBody) {
  const query = []
  query.push(getQuery('deal_id', '$eq', Number(reqBody.deal_id)))
  query.push(getQuery('added_by', '$eq', Number(reqBody.user_id)))
  return getQueryArrayForOperation('$and', query)
}

function generateUpdateJson(reqBody) {
  const json = {}
  json['party_id'] = reqBody.party_id
  json['mfg_id'] = reqBody.mfg_id
  json['deal_date'] = reqBody.deal_date
  json['meters'] = reqBody.meters
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

function getDefaultDateRange(isStart) {
  const date = new Date();
  let day = date.getDate();
  let month = isStart ? date.getMonth() : date.getMonth() + 1;
  let year = date.getFullYear();
    
  return `${year}-${month}-${day}`;

}


module.exports = app;

