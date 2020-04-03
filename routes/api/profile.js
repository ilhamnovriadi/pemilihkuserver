const express = require("express");
const router = express.Router();
const auth = require('../../middleware/auth')

// Route    GET api/profile/me
// desc     akses api profile
router.get("/", (req, res) => res.send("profile api"));

module.exports = router;
