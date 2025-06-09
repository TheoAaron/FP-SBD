const User = require("../models/mysql/user");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required." });

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// login controller
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }
  try {
    // find user
    const user = await User.findOne({ where: { email, password } });
    if (!user) return res.status(401).json({ message: "Invalid credentials." });
    // successful login
    return res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login };
