const express = require('express');

const app = express.Router();

const { userDetails } = require('../repositories/users')

app.post('/login', async (req, res) => {
    try {
      const user = await userDetails(generateQueryForDeleteDetails(req.body), getCommonProjection(),'brokerage_master')
      console.log('fetched user details: %j , %s', user , user)
      if (user && user.length > 0) {
        res.status(200).json(user)
        } else {
          res.status(400).json('userName/password do not match')
        }
    } catch (error) {
      res.status(500).json(error)
      console.log('error while fetching user details: %j , %s', error , error)
      throw error
    }
  });

  function generateQueryForDeleteDetails (reqBody) {
    const query = []
    query.push(getQuery('password', '$eq', reqBody.password))
    query.push(getQuery('user_name', '$eq', reqBody.user_name))
    return getQueryArrayForOperation('$and', query)
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
  