
async function previewUrl(){
    let url = document.getElementById("urlInput").value;
    
    let preview = "TODO: Fetch the url preview from your API"
    
    displayPreviews(preview)
}

function displayPreviews(previewHTML){
    document.getElementById("url_previews").innerHTML = previewHTML;
}
