const mongoose = require('mongoose');
const { Schema } = mongoose;

const manufacturerSchema = new Schema({
  name: {
    type: String,
  },
  party_id: {
    type: Number,
  },
  added_by: {
    type: Number,
  },
});

manufacturerSchema.plugin(global.db.autoIncrement, {
  model: 'parties',
  field: 'party_id',
  startAt: 1
})

module.exports = mongoose.model('parties', manufacturerSchema);