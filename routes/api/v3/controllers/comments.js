import express from 'express';

var router = express.Router();

router.get("/", async (req, res) => {
    try {
      const { postID } = req.query;
  
      if (!postID) {
        return res.status(400).json({
          status: "error",
          error: "postID query parameter is required",
        });
      }
  
      const Comment = req.models.Comment;

      const comments = await Comment.find({ post: postID }).lean();
      
      comments.forEach(c => {
        if (c.created_date) {
          c.created_date = new Date(c.created_date).toLocaleString();
        }
      });
  
      return res.json(comments);
    } catch (error) {
      console.error("GET comments error:", error);
      return res
        .status(500)
        .json({ status: "error", error: String(error) });
    }
  });
  
  
  router.post("/", async (req, res) => {
    try {
      const session = req.session;
  
      if (!session || !session.isAuthenticated) {
        return res.status(401).json({
          status: "error",
          error: "not logged in",
        });
      }
  
      const { newComment, postID } = req.body;
  
      if (!newComment || !postID) {
        return res.status(400).json({
          status: "error",
          error: "Comment and postID are required in request body",
        });
      }
  
      const Comment = req.models.Comment;
  
      const commentDoc = new Comment({
        username: session.account.username,
        comment: newComment,
        post: postID,
        created_date: new Date(),
      });
  
      await commentDoc.save();
  
      return res.json({ status: "success" });
    } catch (error) {
      console.error("POST comments error:", error);
      return res
        .status(500)
        .json({ status: "error", error: String(error) });
    }
  });

export default router;