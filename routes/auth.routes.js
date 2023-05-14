const express = require("express");

const router = express.Router();

const UserController = require("../controllers/users.controller");
const userController = new UserController();

// 회원가입 API
router.post("/signup", userController.signup);

// 로그인 API
router.post("/login", userController.login);

// 로그아웃 API
router.delete("/logout", userController.logout);

module.exports = router;
