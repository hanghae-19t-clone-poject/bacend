const LikesService = require("../services/likes.service");

class LikesController {
  likesService = new LikesService();
}

module.exports = LikesController;
