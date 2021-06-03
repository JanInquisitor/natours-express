const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name."],
    unique: true,
  },
  ratingsAverage: {
    type: Number,
    required: [true, "A tour must have a duration"],
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
    default: 10,
  },
  maxGroupSize: {
    type: Number,
    required: [true, "A tour must have a maximum griup size"],
  },
  difficulty: {
    type: String,
    required: [true, "A tour must have a price"],
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price."],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true
  },
  difficulty: {
    type: String,
    default: "Medium",
  },
});

const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
