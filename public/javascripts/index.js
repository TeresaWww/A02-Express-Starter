async function previewUrl(){
    let url = document.getElementById("urlInput").value;
    try{
        const fetchURL = "/api/v1/urls/preview?url=" + url;
        let response = await fetch(fetchURL);
        let resultText = await response.text();

        displayPreviews(resultText);
    }catch (error) {
        displayPreviews("Errors: There is no preview available");
    }
}

function displayPreviews(previewHTML){
    document.getElementById("url_previews").innerHTML = previewHTML;
}

