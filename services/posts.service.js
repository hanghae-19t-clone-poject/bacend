const PostRepository = require("../repositories/posts.repository");
const { post } = require("../routes");
const postRepository = new PostRepository();

class PostService {



  async createPost(postData) {
    console.log("postData:", postData);
    return await postRepository.create(postData);
  };



  async getPosts() {
    try {
      const posts = await postRepository.getPosts();
      const results = await Promise.all(
        posts.map(async (item) => {
          const post = {
            post_id: item.post_id,
            user_id: item.user_id,
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

          return post;
        })
      );
      return results;
    } catch (error) {
      return { error: true, message: error.message };
    };
  };


  
  async getBestPosts() {
  try {
    const posts = await postRepository.getPosts();

    posts.sort((a, b) => b.likes - a.likes);
    const topTwentyPosts = posts.slice(0, 20);

    const bestPosts = await Promise.all(
      topTwentyPosts.map(async (item) => {
        const post = {
          post_id: item.post_id,
          user_id: item.user_id,
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

        return post;
      })
    );
    return bestPosts;
  } catch (error) {
    return { error: true, message: error.message };
  };
};



  getPostById = async (post_id) => {
    const post = await postRepository.findPostById(post_id);
    return post;
  };



  updatePost = async (user_id, post_id, title, content, price, location, photo_url) => {
    const post = await postRepository.findPostById(post_id);

    if (!title || !content || !price || !location) {
      throw new Error("입력 값이 유효하지 않습니다.");
    };

    if (user_id !== post.user_id) {
      throw new Error("게시글 수정 권한이 없습니다.");
    };

    await postRepository.updatePostById(post_id, title, content, price, location, photo_url);
  };



  deletePost = async (user_id, post_id) => {
    const post = await postRepository.findPostById(post_id);
  
    if (!post) {
      throw new Error("게시글이 존재하지 않습니다.");
    };
  
    if (user_id !== post.user_id) {
      throw new Error("게시글 삭제 권한이 없습니다.");
    };
  
    await postRepository.deletePostById(post_id);
  };
};

module.exports = PostService;
