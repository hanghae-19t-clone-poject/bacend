const express = require("express");
const router = express.Router();

const authRouter = require("./auth.routes");
// const postRouter = require("./post.routes");
const commentRouter = require("./comment.routes");
const likeRouter = require("./like.routes");

//  auth.routes
router.use("/auth", authRouter);

router.use("/posts", [commentRouter, likeRouter]);

module.exports = router;
