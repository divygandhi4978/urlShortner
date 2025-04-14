const mongoose = require("mongoose");

const url = mongoose.Schema({
  longUrl: { type: String, require },
  shortUrl: { type: String },
  dateExpiry: { type: Date },
  registerDate: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Url", url);
