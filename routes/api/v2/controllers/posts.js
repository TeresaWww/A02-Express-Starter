import express from 'express';
import getURLPreview from '../utils/urlPreviews.js';

var router = express.Router();

router.post("/", async (req, res) => {
    console.log(req.body)

    try {
        const newPost = new req.models.Post({
            url: req.body.url,
            description: req.body.description,
            username: req.body.username,
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
    if (!req.models || !req.models.Post) {
      return res.status(500).json({ status: "error", error: "Post model missing (req.models not attached)" });
    }

    const Post = req.models.Post;

    const posts = await Post.find({});

    const postData = await Promise.all(
      posts.map(async (post) => {
        try {
          const html = await getURLPreview(post.url);
          return { description: post.description ?? "", htmlPreview: html , username: post.username ?? "Anonymous"};
        } catch (err) {
          return { description: post.description ?? "", htmlPreview: `Preview error: ${String(err.message || err)}` };
        }
      })
    );

    return res.json(postData);
  } catch (error) {
    console.error("GET /api/v2/posts error:", error);
    return res.status(500).json({ status: "error", error: String(error) });
  }
});

export default router;
