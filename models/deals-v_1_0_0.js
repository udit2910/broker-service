const mongoose = require("mongoose");
const { Schema } = mongoose;
const Double = require("@mongoosejs/double");

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
    required: true,
  },
  rate: {
    type: Double,
    required: true,
  },
  total: {
    type: Double,
    required: true,
  },
  quality: {
    type: String,
  },
  deal_date: { type: Date, required: true },
  updated_at: { type: Date, default: Date.now },
});

manufacturerSchema.plugin(global.db.autoIncrement, {
  model: "deals",
  field: "deal_id",
  startAt: 1,
});

module.exports = mongoose.model("deals", manufacturerSchema);
