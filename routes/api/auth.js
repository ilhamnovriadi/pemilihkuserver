const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const User = require("../../models/Users");

// Route    GET api/auth
// desc     akses api auth
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.massage);
    res.status(500).send("server error");
  }
});

module.exports = router;
