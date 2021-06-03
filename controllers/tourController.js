const Tour = require("./../models/tourModel");

// Fetchs all the requested documents in the database.
// Required data: none.
// Method: GET.
module.exports = getAllTours = async (req, res) => {
  try {
    let tours = await Tour.find();

    res.status(200).json({
      status: "success",
      length: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(204).json({
      status: "fail",
      message: "Nothing was found.",
      err: err,
    });
  }
};

// Fetchs the specified tours in the database.
// Required data: none.
// Method: GET.
const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Nothing was found",
    });
  }
};

// Create a new tour.
// Method: POST.
const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "Success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: "Invalid sent data!",
    });
  }
};

// Update the requested tour.
// Required data: user id.
// Method: PATCH.
const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "Success",
      message: "Tour Deleted!",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Couldn't delete the requested tour.",
    });
  }
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
};

// const tours = JSON.parse(
// 	fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );
