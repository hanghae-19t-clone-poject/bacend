const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const page_middle = require("../middlewares/pagination-middleware");
const MypageController = require("../controllers/mypage.controller");
const mypageController = new MypageController();
//index router => api/auth/profile
router.get(
  "/liked",
  //  authMiddleware,
  page_middle,
  mypageController.liked_products
);
router.get("/", mypageController.products);
router.put("/", mypageController.updated_info);

// module.exports = router;
