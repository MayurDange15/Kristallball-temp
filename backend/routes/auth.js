const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// @route   POST /api/auth/login
// @desc    Login user & return token
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid Username" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid Password" });

    // Create JWT
    const token = jwt.sign(
      { id: user._id, role: user.role, base: user.base },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      accessToken: token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        base: user.base,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
