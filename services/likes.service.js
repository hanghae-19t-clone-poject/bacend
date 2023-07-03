const { Likes, Comments } = require("../models/index");
const LikesRepository = require("../repositories/likes.repository");
const CommentsRepository = require("../repositories/comments.repository");
const { sequelize } = require("../models");
const { Transaction } = require("sequelize");

class LikesService {
  likesRepository = new LikesRepository(Likes);
  commentsRepository = new CommentsRepository(Comments);

  getPostLiked = async (user_id, post_id) => {
    const getPostLikedData = await this.likesRepository.getPostLiked(
      user_id,
      post_id
    );
    return getPostLikedData;
  };

  getCommentLiked = async (user_id, comment_id) => {
    const getCommentLikedData = await this.likesRepository.getCommentLiked(
      user_id,
      comment_id
    );
    return getCommentLikedData;
  };

  postLikeToggle = async (user_id, post_id, likeExist) => {
    const t = await sequelize.transaction({
      isolateLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    try {
      if (likeExist) {
        await this.likesRepository.postDeleteLike(user_id, post_id, {
          transaction: t,
        });

        await this.likesRepository.postDecreaseLikes(post_id);
        await t.commit();

        return { message: "댓글 좋아요 취소 완료" };
      } else {
        await this.likesRepository.createPostLike(user_id, post_id, {
          transaction: t,
        });

        await this.likesRepository.postIncreaseLikes(post_id);
        await t.commit();

        return { message: "댓글 좋아요 완료" };
      }
    } catch (err) {
      await t.rollback();
      return { errorMessage: "좋아요 기능이 실패하였습니다." };
    }
  };

  commentLikeToggle = async (user_id, comment_id, likeExist) => {
    const t = await sequelize.transaction({
      isolateLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });

    try {
      if (likeExist) {
        await this.likesRepository.commentDeleteLike(user_id, comment_id, {
          transaction: t,
        });

        await this.likesRepository.commentDecreaseLikes(comment_id);
        await t.commit();

        return { message: "월드컵 취소 좋아요 완료" }; //ㅋㅋㅋㅋ
      } else {
        await this.likesRepository.createCommentLike(
          user_id,
          post_id,
          comment_id,
          {
            transaction: t,
          }
        );

        await this.likesRepository.commentIncreaseLikes(comment_id);
        await t.commit();

        return { message: "월드컵 좋아요 완료" };
      }
    } catch (err) {
      await t.rollback();
      return { errorMessage: "좋아요 기능이 실패하였습니다." };
    }
  };
}
module.exports = LikesService;
