const { Op } = require("sequelize");

class MypageRepository {
  constructor(UserInfos, Likes, Posts) {
    this.UserInfos = UserInfos;
    this.Likes = Likes;
    this.Posts = Posts;
  }

  liked_products = async (user_id, pagination) => {
    const liked_products = await this.Likes.findAll({
      limit: pagination.limit, //보여줄것들!!!
      offset: pagination.offset,
      include: [
        {
          model: this.Posts,
          attributes: [
            "title",
            "content",
            "price",
            "photo_url",
            "location",
            "current_status",
          ],
        },
      ],
      where: { user_id: user_id },
      attributes: [],
      order: [[this.Posts, "createdAt"]],
    });
    return liked_products;
  };
  //판매중
  products = async (user_id, page, limit) => {
    const product_list = await this.Posts.findAll({
      attributes: [
        "title",
        "content",
        "price",
        "photo_url",
        "location",
        "current_status",
      ],
      where: {
        [Op.and]: [{ current_status: false }, { user_id: user_id }],
      },
    });

    return product_list;
  };
  //거래완료
  sold_products = async (user_id, page, limit) => {
    const sold_products = await this.Posts.findAll({
      attributes: [
        "title",
        "content",
        "price",
        "photo_url",
        "location",
        "current_status",
      ],
      where: {
        [Op.and]: [{ current_status: true }, { user_id: user_id }],
      },
    });

    return sold_products;
  };

  updated_info = async (
    email,
    location,
    profile_image,
    introduction,
    user_id
  ) => {
    await this.UserInfos.updateOne(
      {
        email,
        location,
        profile_image,
        introduction,
      },
      {
        where: { user_id: user_id },
      }
    );
  };
}
module.exports = MypageRepository;
