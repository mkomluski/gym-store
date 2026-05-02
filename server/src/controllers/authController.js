const { User } = require("../models");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, address } = req.body;

    const existingUser = await User.findOne({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
    });

    return res.status(201).json({
      message: "User successfully created!",
      token: generateToken(user),
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundUser = await User.findOne({
      where: {
        email,
      },
    });

    if (!foundUser) {
      return res
        .status(401)
        .json({ message: "Invalid credentials, user not found!" });
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid credentials, user not found!" });
    }

    return res.status(200).json({
      message: "Successfully logged in!",
      token: generateToken(foundUser),
      user: {
        id: foundUser.id,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        email: foundUser.email,
        phone: foundUser.phone,
        address: foundUser.address,
        role: foundUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login };
