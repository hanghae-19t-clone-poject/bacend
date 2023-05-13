const { Likes } = require("../models/index");
const LikesRepository = require("../repositories/likes.repository");
class LikesService {
  likesRepository = new LikesRepository(Likes);
}
module.exports = LikesService;
