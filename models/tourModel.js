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
    required: [true, "A tour must have a maximum griup size."],
  },
  difficulty: {
    type: String,
    required: [true, "A tour must have a price."],
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price."],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, "A tour must have a description."],
  },
  difficulty: {
    type: String,
    default: "Medium",
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, "A tour must have a cover image. "],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});

const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
