const MypageService = require("../services/mypage.service");

const { update_info_schema } = require("./joi");
class MyPage {
  mypageService = new MypageService();

  liked_products = async (req, res) => {
    // const { user_id } = res.locals.user;
    const user_id = 1;
    try {
      const liked_products = await this.mypageService.liked_products(
        user_id,
        req.pagination
      );

      return res.status(200).json({ liked_products });
    } catch (e) {
      //throw new Error(`412/${error}`);
    }
  };

  products = async (req, res) => {
    const { user_id } = res.locals.user;
    const { page, limit } = req.query;
    try {
      const { products, sold_products } = await this.mypageService.products(
        user_id,
        page,
        limit
      );
      return res.status(200).json({ products, sold_products });
    } catch (e) {}
  };
  updated_info = async (req, res, next) => {
    //const { user_id } = res.locals.users;
    const user_id = "hawook";
    try {
      const { email, location, profile_image, introduction } =
        await update_info_schema.validateAsync(req.body);

      await this.mypageService.updated_info(
        email,
        location,
        profile_image,
        introduction,
        user_id
      );
      return res.status(200).end();
    } catch (e) {
      return res.json({ message: e.message });
    }
  };

  ///이메일 인증
}
module.exports = MyPage;
