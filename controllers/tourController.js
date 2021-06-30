const AppError = require("../utils/appError");
const Tour = require("./../models/tourModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

// Fetchs all the requested documents in the database.
// Required data: none.
// Method: GET.
exports.getAllTours = factory.getAll(Tour);

// Fetchs the specified tours in the database.
// Required data: none.
// Method: GET.
exports.getTour = factory.getOne(Tour, { path: "reviews" });

// Create a new tour.
// Method: POST.
exports.createTour = factory.createOne(Tour);

// Update the requested tour.
// Required data: user id.
// Method: PATCH.
exports.updateTour = factory.updateOne(Tour);

// Delete the requested tour.
// Required data: Tour's id.
// Method: DELETE.
exports.deleteTour = factory.deleteOne(Tour);

// Send back Tour Stats
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toLower: "$difficulty" }, // Here you can group the documents by specifying a field
        numRatings: { $sum: "$ratingsQuantity" },
        numOfTours: { $sum: 1 },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "price" },
        minPrice: { $min: "price" },
        maxPrice: { $max: "price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStats: { $num: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { $month: "$_id" },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: 1 },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});

exports.getToursWithin = (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng ] = latlng.splits(",");

  if(!lat || lng ) {
    next(new AppError("", 404));
  }
};
