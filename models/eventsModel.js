const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  category: {
    type: String,
    required: [true, "category is required"],
    enum: ["Academic", "Creative", "Career", "Other", "Athletics"]
  },
  host: {
    type: String,
    required: [true, "host is required"],
  },
  startDate: {
    type: Date,
    required: [true, "startDate is required"]
  },
  endDate: {
    type: Date,
    required: [true, "endDate is required"]
  },
  details: {
    type: String,
    required: [true, "details is required"],
    minLength: [10, "the content should have at least 10 characters"]
  },
  image: {
    type: String,
    required: [true, "image is required"]
  },
  location: {
    type: String,
    required: [true, "location is required"]
  }
});

module.exports = mongoose.model("Event", eventSchema)