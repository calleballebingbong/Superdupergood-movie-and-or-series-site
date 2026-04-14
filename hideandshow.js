function hidesearch() {
    if (document.addEventListener("click", function(event) {
        var searchResults = document.getElementById("menuSearchResults");{
                if (!searchResults.contains(event.target)) {
                    searchResults.style.visibility = "hidden";
                }
        }
    }));
}

function showsearch() {
    if (searchterm.length > 0) {
    document.getElementById("menuSearchResults").style.visibility = "visible";
    }
}