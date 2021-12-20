const express = require('express')
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const router = express.Router()
const bcrypt = require('bcryptjs');
const fetchuser = require('../middleware/fetchuser');
const jwt = require('jsonwebtoken');


const JWT_SECRET = 'FJDSLKAJFKLJASD'
// ROUTE 1: To create user
router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 4 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
  console.log("creating...")
  let success = false

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }
  // Check whether the user with this email exists already
  try {
    let user = await User.findOne({ email: req.body.email })
    if (user) {
      return res.status(400).json({ success, error: "Sorry this email already exist" })
    }
    const salt = bcrypt.genSaltSync(10);
    const SecPass = bcrypt.hashSync(req.body.password, salt);

    //  Create a new user
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: SecPass,
    })
    const data = {
      user: {
        id: user.id
      }
    }

    const authtoken = jwt.sign(data, JWT_SECRET);
    console.log({ authtoken })

    success = true
    res.json({ success, authtoken })

  } catch (error) {
    console.log(error.message)
    res.status(500).send("Some Error occures")
  }
})

// ROUTE 2: To login 
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
  let success = false

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }

  const { email, password } = req.body
  try {
    let user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ success, error: "Please try to login with correct login/password" })
    }

    const passwordCompare = await bcrypt.compare(password, user.password)
    if (!passwordCompare) {
      return res.status(400).json({ success, error: "Please try to login with correct login/password" })
    }

    const data = {
      user: {
        id: user.id
      }
    }

    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true
    res.json({ success, authtoken })
  } catch (error) {
    console.log(error.message)
    res.status(500).send("Internal Server Error")
  }
})

// ROUTE 3: Get logged In
router.post('/getuser', fetchuser, async (req, res) => {
  try {
    userId = req.user.id
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.log(error.message)
    res.status(500).send("Internal Server Error")
  }

})

module.exports = router