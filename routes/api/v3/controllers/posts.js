import express from 'express';
import getURLPreview from '../utils/urlPreviews.js';

var router = express.Router();

router.post("/", async (req, res) => {
    try {
      const session = req.session;
      if (!session || !session.isAuthenticated) {
        return res.status(401).json({ status: 'error', error: 'not logged in' })
      }
        const newPost = new req.models.Post({
            url: req.body.url,
            description: req.body.description,
            username: req.session.account.username,
            created_date: new Date()
        })

        await newPost.save();

        return res.json({ status: "success" });
    } catch (err) {
        console.log("Error saving post: ", err)
        res.status(500).json({"status": "error", "error": err})
    }
})


router.get("/", async (req, res) => {
  try {
    const { username } = req.query;
    const filter = username ? { username } : {};

    if (!req.models || !req.models.Post) {
      return res.status(500).json({ status: "error", error: "Post model missing (req.models not attached)" });
    }

    const Post = req.models.Post;

    const posts = await Post.find(filter, { description: 1, url: 1, username: 1, likes: 1, created_date: 1 }).sort({ created_date: -1 });

    const postData = await Promise.all(
      posts.map(async (post) => {
        try {
          const html = await getURLPreview(post.url);
          return { 
            id: post._id,
            url: post.url,
            description: post.description ?? "", 
            htmlPreview: html , 
            username: post.username ?? "Anonymous",
            likes: post.likes ?? [],
            created_date: post.created_date.toLocaleString()
          };
        } catch (err) {
          return { description: post.description ?? "", htmlPreview: `Preview error: ${String(err.message || err)}` };
        }
      })
    );

    return res.json(postData);
  } catch (error) {
    console.error("GET /api/v3/posts error:", error);
    return res.status(500).json({ status: "error", error: String(error) });
  }
});


router.post("/like", async (req, res) => {
  try {
    const session = req.session;
    if (!session || !session.isAuthenticated) {
      return res.status(401).json({ status: "error", error: "not logged in" });
    }

    const username = session.account.username;
    const { postID } = req.body;

    const Post = req.models.Post;
    const post = await Post.findById(postID);

    if (!post) {
      return res.status(404).json({ status: "error", error: "post not found" });
    }

    if (!Array.isArray(post.likes)) {
      post.likes = [];
    }

    if (!post.likes.includes(username)) {
      post.likes.push(username);
      await post.save();
      console.log(`User ${username} liked post ${postID}`);
    }

    console.log(post.likes);
    return res.json({ status: "success" , likes: post.likes});
  } catch (error) {
    console.error("Error liking post: ", error);
    return res.status(500).json({ status: "error", error });
  }
});



router.post("/unlike", async (req, res) => {
  try {
    const session = req.session;
    if (!session || !session.isAuthenticated) {
      return res.status(401).json({ status: "error", error: "not logged in" });
    }

    const username = session.account.username;
    const { postID } = req.body;

    const Post = req.models.Post;
    const post = await Post.findById(postID);

    if (!post) {
      return res.status(404).json({ status: "error", error: "post not found" });
    }

    if (Array.isArray(post.likes) && post.likes.includes(username)) {
      post.likes = post.likes.filter((u) => u !== username);
      await post.save();
    }

    return res.json({ status: "success" });
  } catch (error) {
    console.error("Error unliking post: ", error);
    return res.status(500).json({ status: "error", error });
  }
});

export default router;
