import fetch from 'node-fetch';
import {parse} from 'node-html-parser';

const escapeHTML = str => String(str).replace(/[&<>'"]/g, 
  tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag]));

async function getURLPreview(url){
    const response = await fetch(url);

    const content = await response.text();

    let html = parse(content);

    let ogUrl = html.querySelector('meta[property="og:url"]')?.getAttribute("content");
    let ogTitle = html.querySelector('meta[property="og:title"]')?.getAttribute("content");
    let ogImage = html.querySelector('meta[property="og:image"]')?.getAttribute("content");
    let ogDescription = html.querySelector('meta[property="og:description"]')?.getAttribute("content");
    let ogWidth = html.querySelector('meta[property="og:image:width"]')?.getAttribute("content") ;
    let ogHeight = html.querySelector('meta[property="og:image:height"]')?.getAttribute("content") ;

    if (!ogUrl) ogUrl = url;
    if (!ogTitle) {
      ogTitle = html.querySelector("title")?.text|| url;
    }

    const safeTitle = escapeHTML(ogTitle);
    const safeDescription  = ogDescription ? escapeHTML(ogDescription) : '';
    const safeUrl   = escapeHTML(ogUrl);
    const safeDim   = (ogWidth && ogHeight) ? `${escapeHTML(ogWidth)} x ${escapeHTML(ogHeight)}` : '';
  
    const previewHTML = `
      <div style="max-width:300px;border:1px solid #ccc;padding:8px;text-align:center">
        <a href="${safeUrl}" style="text-decoration:none;color:black" target="_blank" rel="noopener noreferrer">
          <p style="font-weight:bold;font-size:1.1em;margin:12px 0;word-wrap:break-word">
            <strong>${safeTitle}</strong>
          </p>
          ${ogImage ? `<img src="${ogImage}" style="max-height:200px;max-width:270px" alt="">` : ""}
        </a>
        <div>
          ${safeDim ? `<p style="margin:10px 0">${safeDim}</p>` : ""}
          ${safeDescription ? `<p style="margin:10px 0">${safeDescription}</p>` : ""}
        </div>
      </div>
    `;
    return previewHTML;
}

export default getURLPreview;