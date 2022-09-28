const mongoose = require('mongoose');
const { Schema } = mongoose;
// var Long = Schema.Types.Number;

const manufacturerSchema = new Schema({
  deal_id: {
    type: Number,
  },
  party_id: {
    type: Number,
  },
  mfg_id: {
    type: Number,
  },
  added_by: {
    type: Number,
  },
  meters: {
    type: Number,
    required: true
  },
  deal_date : { type: Date , required: true},
  updated_at : { type: Date, default: Date.now }
});

manufacturerSchema.plugin(global.db.autoIncrement, {
  model: 'deals',
  field: 'deal_id',
  startAt: 1
})

module.exports = mongoose.model('deals', manufacturerSchema);