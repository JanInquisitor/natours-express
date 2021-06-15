const AppError = require("../utils/appError");
const Tour = require("./../models/tourModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

// Fetchs all the requested documents in the database.
// Required data: none.
// Method: GET.
exports.getAllTours = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate(0);
  const tours = await features.query;

  res.status(200).json({
    status: "success",
    length: tours.length,
    data: {
      tours,
    },
  });
});

// Fetchs the specified tours in the database.
// Required data: none.
// Method: GET.
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError("No tour found with that id", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

// Create a new tour.
// Method: POST.
exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: "Success",
    data: {
      tour: newTour,
    },
  });
});

// Update the requested tour.
// Required data: user id.
// Method: PATCH.
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError("No tour found with that id", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

// Delete the requested tour.
// Required data: Tour's id.
// Method: DELETE.
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError("No tour found with that id", 404));
  }

  res.status(204).json({
    status: "Success",
    message: "Tour Deleted!",
  });
});

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
