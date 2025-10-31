import express from "express";
import fetch from "node-fetch";
import {parse} from "node-html-parser";

const router = express.Router();

router.get("/", (req, res) => {
    res.redirect("/");
  });

router.get("/urls/preview", async (req, res) =>{
    const inputUrl = req.query.url

    try {
        const response = await fetch(inputUrl);

        const content = await response.text();

        let html = parse(content);

        let ogUrl = html.querySelector('meta[property="og:url"]')?.getAttribute("content");
        let ogTitle = html.querySelector('meta[property="og:title"]')?.getAttribute("content");
        let ogImage = html.querySelector('meta[property="og:image"]')?.getAttribute("content");
        let ogDescription = html.querySelector('meta[property="og:description"]')?.getAttribute("content");
        let ogWidth = html.querySelector('meta[property="og:image:width"]')?.getAttribute("content") ;
        let ogHeight = html.querySelector('meta[property="og:image:height"]')?.getAttribute("content") ;

        if (!ogUrl) ogUrl = inputUrl;
        if (!ogTitle) {
          ogTitle = html.querySelector("title")?.text|| inputUrl;
        }

        let previewHTML = `
            <div style="max-width: 300px; border: solid 1px; padding: 3px; text-align: center;">
            <a href="${ogUrl}" style="text-decoration: none; color: black;">
                <p style="font-weight: bold; font-size: 1.5em; margin: 20px 0; word-wrap: break-word;"><strong>${ogTitle}</strong></p>
                ${
                ogImage
                    ? `<img src="${ogImage}" style="max-height: 200px; max-width: 270px;">`
                    : ""
                }
            </a>
            <div>
                ${ogWidth && ogHeight ? `<p style="margin: 10px 0;">${ogWidth} x ${ogHeight}</p>` : ""}
                ${ogDescription ? `<p style="margin: 10px 0;">${ogDescription}</p>` : ""}
            </div>
            </div>
        `
        
        res.type("html");
        res.send(previewHTML);

    } catch(error) {
        res.status(500).send("Error fetching or parsing URL");
    }

})

export default router;