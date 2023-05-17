const PostService = require("../services/posts.service");
const postService = new PostService();
const CommentsService = require("../services/comments.service");

class PostController {
  commentsService = new CommentsService();

  createPost = async (req, res) => {
    try {
      const { user_id, nickname } = res.locals.user;
      const { title, content, price, location } = req.body;
      const { photo_url } = req;

      if (!title) {
        return res
          .status(412)
          .json({ message: "게시글 제목의 형식이 일치하지 않습니다." });
      }
      if (!content) {
        return res
          .status(412)
          .json({ message: "게시글 내용의 형식이 일치하지 않습니다." });
      }
      if (!price) {
        return res
          .status(412)
          .json({ message: "가격의 형식이 일치하지 않습니다." });
      }
      if (!location) {
        return res
          .status(412)
          .json({ message: "장소의 형식이 일치하지 않습니다." });
      }

      const postData = {
        user_id,
        nickname,
        title,
        content,
        photo_url,
        price,
        location,
        likes: 0,
        current_status: false,
      };
      await postService.createPost(postData);
      return res.status(201).json({ message: "게시글 작성에 성공하였습니다." });
    } catch (err) {
      console.error(err);
      res.status(400).send({ message: "게시글 작성에 실패하였습니다." });
    }
  };

  getPosts = async (req, res) => {
    try {
      const posts = await postService.getPosts();
      const result = await Promise.all(
        posts.map(async (a) => {
          const b = await this.commentsService.getComments(a.post_id);
          return (a.commentCount = b.length);
        })
      );

      if (posts.error) {
        throw new Error(posts.message);
      }

      res.json(posts);
    } catch (err) {
      console.error(err);
      res.status(400).send({ message: "게시글 조회에 실패하였습니다." });
    }
  };

  getBestPosts = async (req, res) => {
    try {
      const bestPosts = await postService.getBestPosts();
      res.json(bestPosts);
    } catch (err) {
      console.error(err);
      res.status(400).send({ message: "게시글 조회에 실패하였습니다." });
    }
  };

  getPostById = async (req, res) => {
    try {
      const { post_id } = req.params;
      const post = await postService.getPostById(post_id);
      const comments = await this.commentsService.getComments(post_id);
      res.json({ data: post, commentsCount: comments.length });
    } catch (err) {
      console.error(err);
      res.status(400).send({ message: "게시글 조회에 실패하였습니다." });
    }
  };

  updatePost = async (req, res) => {
    try {
      const { user_id } = res.locals.user;
      const { post_id } = req.params;
      const { title, content, price, location } = req.body;
      const { photo_url } = req;
      await postService.updatePost(
        user_id,
        post_id,
        title,
        content,
        price,
        location,
        photo_url
      );
      res.status(200).json({ message: "게시글을 수정하였습니다." });
    } catch (err) {
      console.error(err);
      res.status(400).send({ errorMessage: "게시글 수정에 실패하였습니다." });
    }
  };

  deletePost = async (req, res) => {
    try {
      const { user_id } = res.locals.user;
      const { post_id } = req.params;
      await postService.deletePost(user_id, post_id);
      res.status(200).json({ message: "게시글을 삭제하였습니다." });
    } catch (err) {
      console.error(err);
      res.status(400).send({ errorMessage: "게시글 삭제에 실패하였습니다." });
    }
  };
}

module.exports = PostController;
