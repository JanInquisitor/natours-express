const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  let newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  newUser = {
    name: newUser.name,
    email: newUser.email,
  };

  const token = signToken(newUser.id);

  res.status(200).json({
    status: "success",
    token,
    newUser,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1) Check if email and password exist.
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 404));
  }
  //2) Check if user exist && password is correct.
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  //3) If everything is ok, send the token back to the client.
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});