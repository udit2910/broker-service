'use strict'


require("../models/users-v_1_0_0")


const userDetails = async (query, projection, tenant) => {
  try {
    const db = await global.db.connect(tenant)
    const collection = db.model('users')
    let response = await collection.find(
      query, projection
    )
    return response
  } catch (error) {
    console.log(`Error in fetching user details: %s , %j`, error, error)
    throw error
  }
}

module.exports = {
    userDetails
  }