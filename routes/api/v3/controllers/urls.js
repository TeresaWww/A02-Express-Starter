import express from 'express';
import getURLPreview from '../utils/urlPreviews.js';

var router = express.Router();

router.get("/preview", async (req, res) => {
    const url = req.query.url;

    if(!url) {
        return res.status(400).send("Missing url");
    }

    try {
        const previewHtml = await getURLPreview(url);
        res.type("html");
        res.send(previewHtml);
    } catch (err) {
        console.error("preview error:", err);
        return res.status(500).json({ status: "error", error: String(err) });
    }
})

export default router;