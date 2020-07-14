const UserController = require("../controllers/userauth");
const express = require("express");
const router = express.Router();

router.post("/signup",UserController.CreateUser );
router.post("/login", UserController.UserLogin );

module.exports = router;
