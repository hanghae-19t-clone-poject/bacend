// const express = require("express");
// const router = express.Router();
// const authMiddleware = require("../middlewares/auth-middleware");
// const PostController = require("../controllers/posts.controller");
// const postController = new PostController();
// const uploadImage = require("../modules/s3.js");

// router.post(
//   "/posts",
//   authMiddleware,
//   uploadImage.single("photo"),
//   async (req, res) => {
//     postController.createPost(req, res);
//   }
// );

// router.get("/posts", async (req, res) => {
//   postController.getPosts(req, res);
// });

// router.get("/bestposts", async (req, res) => {
//   try {
//     const posts = await Posts.find();
//     const results = await Promise.all(
//       posts.map(async (item) => {
//         const post = {
//           postId: item.postId,
//           userId: item.userId,
//           nickname: item.nickname,
//           title: item.title,
//           content: item.content,
//           likes: item.likes,
//           views: item.views,
//           price: item.price,
//           createdAt: item.createdAt,
//           updatedAt: item.updatedAt,
//           photo_url: item.photo_url,
//           current_status: item.current_status,
//         };
//         const likeCount = await Likes.countDocuments({ postId: item.postId });
//         post.likeCount = likeCount;
//         return post;
//       })
//     );

//     if (results.length === 0) {
//       return res
//         .status(412)
//         .json({ message: "아직 게시물이 존재하지 않습니다." });
//     }

//     let bestPosts;
//     if (results.length < 20) {
//       bestPosts = results;
//     } else {
//       const sortedPosts = results.sort((a, b) => b.likeCount - a.likeCount);
//       bestPosts = sortedPosts.slice(0, 20);
//     }

//     res.json(bestPosts);
//   } catch (err) {
//     console.error(err);
//     res.status(400).send({ message: "게시글 조회에 실패하였습니다." });
//   }
// });

// router.get("/posts/:postId", async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const post = await Posts.findOneAndUpdate(
//       { _id: postId },
//       { $inc: { views: 1 } },
//       { new: true }
//     );

//     const result = {
//       postId: post.postId,
//       userId: post.userId,
//       nickname: post.nickname,
//       title: post.title,
//       content: post.content,
//       likes: post.likes,
//       views: post.views,
//       price: post.price,
//       createdAt: post.createdAt,
//       updatedAt: post.updatedAt,
//       photo_url: post.photo_url,
//       location: post.location,
//       current_status: post.current_status,
//     };

//     const likeCount = await Likes.countDocuments({ postId: postId });
//     result.likeCount = likeCount;

//     res.json({ data: result });
//   } catch (err) {
//     console.error(err);
//     res.status(400).send({ message: "게시글 조회에 실패하였습니다." });
//   }
// });

// router.put(
//   "/posts/:postId",
//   authMiddleware,
//   uploadImage.single("photo"),
//   async (req, res) => {
//     try {
//       const { userId } = res.locals.user;
//       const { postId } = req.params;
//       const { title, content, price, location } = req.body;
//       const { photo_url } = req;

//       const [post] = await Posts.find({ _id: postId });

//       if (!title) {
//         return res
//           .status(412)
//           .json({ message: "게시글 제목의 형식이 일치하지 않습니다." });
//       }
//       if (!content) {
//         return res
//           .status(412)
//           .json({ message: "게시글 내용의 형식이 일치하지 않습니다." });
//       }
//       if (!price) {
//         return res
//           .status(412)
//           .json({ message: "가격의 형식이 일치하지 않습니다." });
//       }
//       if (!location) {
//         return res
//           .status(412)
//           .json({ message: "장소의 형식이 일치하지 않습니다." });
//       }
//       if (userId === post.userId) {
//         const date = new Date();
//         await Posts.updateOne(
//           { _id: postId },
//           {
//             $set: {
//               title: title,
//               content: content,
//               updatedAt: date,
//               photo_url: photo_url,
//               price: price,
//               location: location,
//             },
//           }
//         );
//         return res.status(200).json({ message: "게시글을 수정하였습니다." });
//       } else {
//         return res
//           .status(403)
//           .json({ errorMessage: "게시글 수정의 권한이 존재하지 않습니다." });
//       }
//     } catch (err) {
//       console.error(err);
//       res.status(400).send({ errorMessage: "게시글 수정에 실패하였습니다." });
//     }
//   }
// );

// router.delete("/posts/:postId", authMiddleware, async (req, res) => {
//   try {
//     const { userId } = res.locals.user;
//     const { postId } = req.params;

//     const post = await Posts.findOne({ _id: postId });

//     if (!post) {
//       return res.status(412).json({ message: "게시글이 존재하지 않습니다." });
//     }

//     if (userId === post.userId) {
//       await Posts.deleteOne({ _id: postId });
//       return res.status(200).json({ message: "게시글을 삭제하였습니다." });
//     } else {
//       return res
//         .status(403)
//         .json({ errorMessage: "게시글의 삭제 권한이 존재하지 않습니다." });
//     }
//   } catch (err) {
//     console.error(err);
//     return res
//       .status(400)
//       .send({ errorMessage: "게시글 삭제에 실패하였습니다." });
//   }
// });

// module.exports = router;
