const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");

const validateLoginInput = require('../../validation/login');

const User = require("../../models/Users");

// Route    POST api/users
// desc     akses register pengguna
router.post(
  "/",
  [
    check("name", "nama wajib diisi gays")
      .not()
      .isEmpty(),
    check("email", "masukan email yang bener gays").isEmail(),
    check("password", "password diisi minimal 6 karakter").isLength({ min: 6 })
  ],
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { name, email, password } = req.body;

    try {
      //email sudah di pkek
      let user = await User.findOne({ email });
      if (user) {
        res.status(400).json({
          errors: [{ msg: "email sudah di pakek oon, ganti yang lain yee..." }]
        });
      }

      //gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });

      user = new User({
        name,
        email,
        avatar,
        password
      });

      //enkripsi password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      //enkripsi json
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwtsecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.massage);
      res.status(500).send("server error gays");
    }
  }
);

router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    errors.success = "gagal";
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      errors.email = 'User not found';
      errors.success = "gagal"
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = { user: {
          id: user.id
        } }; // Create JWT Payload

        // Sign Token
        jwt.sign(
          payload,
          config.get("jwtsecret"),
          { expiresIn: 360000 },
          (err, token) => {
            res.json({
              success: true,
              token: token
            });
          }
        );
      } else {
        errors.password = 'Password incorrect';
        errors.success = "gagal";
        return res.status(400).json(errors);
      }
    });
  });
});

module.exports = router;
