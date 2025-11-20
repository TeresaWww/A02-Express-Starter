import express from 'express';
var router = express.Router();


router.get("/", async (req, res) => {
    try {
        const username = req.query.username;

    if (!username) {
        return res.json({ grade: "" });
    }

    //   if (!username) {
    //     return res.status(401).json({ status: "error", error: "not logged in" });
    //   }
  
      const UserInfo = req.models.User;
      const info = await UserInfo.findOne({ username });
  
      return res.json(info || {});
    } catch (err) {
      console.error("GET userInfo error:", err);
      res.status(500).json({ status: "error", error: String(err) });
    }
  });
  
router.post("/", async (req, res) => {
    try {
      const username = req.session.account.username;
      if (!username) {
        return res.status(401).json({ status: "error", error: "not logged in" });
      }
  
      const UserInfo = req.models.User;

      const update = { grade: req.body.grade };

      const saved = await UserInfo.findOneAndUpdate(
        { username },
        update,
        { new: true, upsert: true }
      );

      console.log("saved doc:", saved);

      return res.json({ status: "success", userInfo: saved });

    } catch (err) {
      console.log("POST userInfo error:", err);
      res.status(500).json({ status: "error", error: String(err) });
    }
  });
  
  export default router;