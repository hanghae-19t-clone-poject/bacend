const PostRepository = require("../repositories/posts.repository");
const postRepository = new PostRepository();

class PostService {
  async createPost(postData) {
    console.log("postData:", postData);
    return await postRepository.create(postData);
  }

  async getPosts() {
    try {
      const posts = await postRepository.getPosts();
      const results = await Promise.all(
        posts.map(async (item) => {
          const post = {
            postId: item.postId,
            userId: item.userId,
            nickname: item.nickname,
            title: item.title,
            content: item.content,
            likes: item.likes,
            views: item.views,
            price: item.price,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            photo_url: item.photo_url,
            current_status: item.current_status,
          };
          const likeCount = await postRepository.getLikeCount(item.postId);
          post.likeCount = likeCount;
          return post;
        })
      );
      return results;
    } catch (error) {
      return { error: true, message: error.message };
    }
  }
}

module.exports = PostService;
