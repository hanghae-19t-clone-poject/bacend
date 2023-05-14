const mypageRepository = require("../repositories/mypage.repository");
const { UserInfos, Likes, Posts } = require("../models");
class MypageService {
  mypageRepository = new mypageRepository(UserInfos, Likes, Posts);

  liked_products = async (user_id, pagination) => {
    console.log(pagination);
    const likedProducts = await this.mypageRepository.liked_products(
      user_id,
      pagination
    );
    return likedProducts;
  };

  products = async (user_id, page, limit) => {
    const products = await this.mypageRepository.products(user_id, page, limit);
    const sold_products = await this.mypageRepository.sold_products(
      user_id,
      page,
      limit
    );

    return { products, sold_products };
  };

  updated_info = async (
    email,
    location,
    profile_image,
    introduction,
    user_id
  ) => {
    await this.mypageRepository.updated_info(
      email,
      location,
      profile_image,
      introduction,
      user_id
    );
  };
}
module.exports = MypageService;
