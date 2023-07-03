const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const ChatController = require("../controllers/chat.controller");
const chatController = new ChatController();

router.get("/", chatController.chat);
// router.get("/:post_id", authMiddleware, chatController.chat);

module.exports = router;
