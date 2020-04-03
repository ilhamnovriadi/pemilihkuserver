const express = require("express");
const router = express.Router();

// Route    GET api/posts
// desc     akses api posts
router.get("/", (req, res) => res.send("posts api"));

module.exports = router;
