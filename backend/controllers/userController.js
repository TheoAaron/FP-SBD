const User = require("../models/mysql/user");

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const newUser = await User.create({ name, email, password });
    res.status(201).json({ message: "User created", data: newUser });
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { createUser };
