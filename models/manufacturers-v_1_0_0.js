const mongoose = require('mongoose');
const { Schema } = mongoose;

const manufacturerSchema = new Schema({
  name: {
    type: String,
  },
  qualities: [{
    type: String
  }],
  manufacturer_id: {
    type: Number,
  },
  added_by: {
    type: Number,
  },
});

manufacturerSchema.plugin(global.db.autoIncrement, {
  model: 'manufacturers',
  field: 'manufacturer_id',
  startAt: 1
})

module.exports = mongoose.model('manufacturers', manufacturerSchema);