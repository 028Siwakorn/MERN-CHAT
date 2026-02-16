const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
require("dotenv").config();
const secret = process.env.SECRET_KEY;
const node_mode = process.env.node_mode;
const cloudinary = require("../configs/cloudinary");
exports.register = async (req, res) => {
  const { fullname, email, password } = req.body;
  if (!fullname || !email || !password) {
    return res.status(400).send({
      message: "Please Provide All Required!",
    });
  }
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.status(400).send({
      message: "This Email is already existed!",
    });
  }

  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = await UserModel.create({
      fullname,
      email,
      password: hashedPassword,
    });
    //Auto login after registration
    jwt.sign(
      { email, id: user._id },
      secret,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) {
          return res
            .status(500)
            .send({ message: "Internal Server Error: Authentication failed!" });
        }
        res.cookie("jwt", token, {
          maxAge: 24 * 60 * 60 * 1000, //MS
          httpOnly: true, //XSS Attacks
          sameSite: "strict", //CSRF attacks
          secure: node_mode !== "development",
        });
        res.status(201).send({
          message: "User registered and logged in successfully!",
          id: user._id,
          email,
        });
      },
    );
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while registering a new user!",
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({
      message: "Please Provide Email and Password!",
    });
  }
  try {
    const userDoc = await UserModel.findOne({ email });
    if (!userDoc) {
      return res.status(404).send({ message: "User not found!" });
    }
    const isPasswordMatched = bcrypt.compareSync(password, userDoc.password);
    if (!isPasswordMatched) {
      return res.status(401).send({ message: "Invalid Credentails" });
    }
    //Login Successfully
    jwt.sign(
      { email, id: userDoc._id },
      secret,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) {
          return res
            .status(500)
            .send({ message: "Internal Server Error: Authentication failed!" });
        }
        res.cookie("jwt", token, {
          maxAge: 24 * 60 * 60 * 1000, //MS
          httpOnly: true,
          sameSite: "strict", //CSRF attacks
          secure: node_mode !== "development",
        });
        //token generation
        res.send({
          message: "User logged in Successfully!",
          id: userDoc._id,
          email,
        });
      },
    );
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some errors occurred while logging in user!",
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.send({ message: "Logged Out successfully!" });
  } catch (error) {
    res.send(500).json({ message: "Internal Server Error While Logging Out" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fullname, profilePicture } = req.body;
    const UserId = req.user._id;
    if (req.body?.fullname && req.body?.profilePicture) {
      //upload picture to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(profilePicture);
      if (!uploadResponse) {
        return res
          .status(500)
          .json({ message: "Error while uploading profile picture" });
      }
      const updatedUser = await UserModel.findByIdAndUpdate(
        UserId,
        {
          fullname: req.body?.fullname,
          profilePicture: uploadResponse.secure_url,
        },
        { new: true },
      );
      if (!updatedUser) {
        return res
          .status(500)
          .json({ message: "Error While Update User Profile" });
      }
      return res
        .status(200)
        .json({ message: "User Profile Updated Successfully!" });
    } else if (profilePicture) {
      const uploadResponse = await cloudinary.uploader.upload(profilePicture);
      if (!uploadResponse) {
        return res
          .status(500)
          .json({ message: "Error while uploading profile picture" });
      }
      const updatedUser = await UserModel.findByIdAndUpdate(
        UserId,
        {
          profilePicture: uploadResponse.secure_url,
        },
        { new: true },
      );
      if (!updatedUser) {
        return res
          .status(500)
          .json({ message: "Error While Update User Profile" });
      }
      return res
        .status(200)
        .json({ message: "User Profile Updated Successfully!" });
    } else if (fullname) {
      const updatedUser = await UserModel.findByIdAndUpdate(
        UserId,
        {
          fullname: fullname,
        },
        { new: true },
      );
      if (!updatedUser) {
        return res
          .status(500)
          .json({ message: "Error While Update User Profile" });
      }
      return res
        .status(200)
        .json({ message: "User Profile Updated Successfully!" });
    } else {
      return res.status(200).json({ message: "Nothing is updated" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error While Updating User Profile" });
  }
};

exports.checkAuth = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id)
      .select("-password")
      .lean();
    res.status(200).json({
      ...user,
      memberSince: user.createdAt,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error While Checking Authentication" });
  }
};

/**
 * Get user profile by ID (for viewing other users)
 * GET /api/v1/user/profile/:userId
 */
exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId)
      .select("fullname email profilePicture createdAt status")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      ...user,
      memberSince: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error fetching profile",
    });
  }
};

/**
 * Search users by name or email
 * GET /api/v1/user/search?q=john
 */
exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.status(400).json({ message: "Search query must be at least 2 characters" });
    }

    const currentUserId = req.user._id;
    const regex = new RegExp(q, "i");

    const users = await UserModel.find({
      _id: { $ne: currentUserId },
      $or: [
        { fullname: { $regex: regex } },
        { email: { $regex: regex } },
      ],
    })
      .select("fullname email profilePicture")
      .limit(20)
      .lean();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error searching users",
    });
  }
};

/**
 * Update theme (Settings page)
 * PUT /api/v1/user/theme
 * Body: { theme: string }
 */
exports.updateTheme = async (req, res) => {
  try {
    const { theme } = req.body;
    if (!theme) {
      return res.status(400).json({ message: "Theme is required" });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      { theme },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "Theme updated",
      theme: updatedUser.theme,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error updating theme",
    });
  }
};
