import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// register
export const register = async (req, res) => {
  try {
    //hashing password
    const salt = bcrypt.genSaltSync(10);
    const hashedPwd = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPwd,
      photo: req.body.photo,
    });
    await newUser.save();

    res.status(200).json({ success: true, message: "Successfully created" });
  } catch (error) {
    res.status(500).json({ success: false, message: "creation failed" });
  }
};

// login
export const login = async (req, res) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isCorrectPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isCorrectPassword) {
      return res
        .status(401)
        .json({ success: false, message: "incorrect email or password" });
    }

    const { password, role, ...rest } = user._doc;

    // create jwt
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15d" }
    );

    console.log(token);

    res
      .cookie("accessToken", token, {
        httpOnly: true,
        expires: token.expiresIn,
        sameSite: "none",
      })
      .status(200)
      .json({
        success: true,
        message: "successfully logged in",
        data: { ...rest },
        token,
        role,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "failed to login" });
  }
};

// export const logout = async (req, res) => {
//   // Set token to none and expire after 5 seconds
//   res.cookie("accessToken", "none", {
//     expires: new Date(Date.now() + 5 * 1000),
//     httpOnly: true,
//   });
//   res
//     .status(200)
//     .json({ success: true, message: "User logged out successfully" });
// };
