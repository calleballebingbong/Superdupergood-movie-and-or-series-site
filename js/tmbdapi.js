// DOM CACHE - PERFORMANCE BOOST
const txtSearch = document.getElementById("txtSearch");
const menuSearch = document.getElementById("menuSearch");
const menuSearchResults = document.getElementById("menuSearchResults");
const searchresults = document.getElementById("searchresults");
const searchFor = document.getElementById("searchFor");

const TMDB_SEARCH_BASE = 'https://api.themoviedb.org/3/search/movie';

//search functiom
async function search(searchString) {
    try {
        const apiKey = TMDBapiKey;
        const url = `${TMDB_SEARCH_BASE}?query=${encodeURIComponent(searchString)}&api_key=${apiKey}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Search API failed');
        
        const json = await response.json();
        return json;
    } catch (error) {
        console.error('Search failed:', error);
        return { results: [] };
    }
}

//render movie items
function renderMovieItem(object, container, isMenu = false) {
    const size = isMenu ? 'w92' : 'w500';
    const posterSrc = object.poster_path 
        ? `https://image.tmdb.org/t/p/${size}${object.poster_path}`
        : "placeholder.png";
    
    const itemClass = isMenu ? 'menu-result-item' : 'movie-item';
    const imgClass = isMenu ? 'Menu-movie-poster' : 'movie-poster';
    const titleClass = isMenu ? 'Menu-movie-title menu-title' : 'movie-title';
    
    container.innerHTML += `
        <div class="${itemClass}">
            <a href="movieinfo.html?movieId=${object.id}">
                <img class="${imgClass}" src="${posterSrc}" alt="${object.title}" loading="lazy">
            </a>
            <p class="${titleClass}">
                <a href="movieinfo.html?movieId=${object.id}">${object.title}</a>
            </p>
        </div>
    `;
}

//result page
async function renderResults(results, term) {
    if (searchFor) {
        searchFor.innerHTML = `<h1>Searching for: "${term}"</h1>`;
    }
    
    if (searchresults) {
        searchresults.innerHTML = "";
        const allObjects = results.results || [];
        
        if (allObjects.length === 0) {
            searchresults.innerHTML = "<p>No results found</p>";
            return;
        }
        
        allObjects.forEach(object => renderMovieItem(object, searchresults));
    }
}

//menu dropdown
async function renderMenuResults(results) {
    if (!menuSearchResults) return;
    
    menuSearchResults.innerHTML = "";
    const allObjects = results.results || [];
    
    if (allObjects.length === 0) {
        menuSearchResults.innerHTML = "<p>No results found</p>";
        return;
    }
    
    //top 5
    allObjects.slice(0, 5).forEach(object => {
        renderMovieItem(object, menuSearchResults, true);
    });
}

// hero search, enter key
if (txtSearch) {
    txtSearch.addEventListener('keydown', async (event) => {
        if (event.key === "Enter" && txtSearch.value.trim().length > 0) {
            event.preventDefault();
            const searchTerm = txtSearch.value.trim();
            
            // Navigate to results
            window.location.href = `resultpage.html?search=${encodeURIComponent(searchTerm)}`;
        }
    });
}

// menu search w live typing
if (menuSearch) {
    menuSearch.addEventListener('input', async () => {
        const searchTerm = menuSearch.value.trim();
        
        if (searchTerm.length > 0) {
            if (menuSearchResults) {
                menuSearchResults.style.visibility = "visible";
                menuSearchResults.style.display = "block";
            }
            const results = await search(searchTerm);
            renderMenuResults(results);
        } else if (menuSearchResults) {
            menuSearchResults.innerHTML = "";
            menuSearchResults.style.visibility = "hidden";
            menuSearchResults.style.display = "none";
        }
    });
}

//url search
const urlParams = new URLSearchParams(window.location.search);
const queryFromUrl = urlParams.get("search");

if (queryFromUrl) {
    performSearch(queryFromUrl);
}

async function performSearch(term) {
    const results = await search(term);
    renderResults(results, term);
}

//show more
function updateShowMoreButtonVisibility() {
    const showMoreButton = document.getElementById("showMoreButton");
    if (!showMoreButton) return;
    
    console.log("Show more button visibility updated");
}

function showMoreResults() {
    const showMoreButton = document.getElementById("showMoreButton");
    const searchResultsDiv = document.getElementById("searchresults");
    
    if (showMoreButton && searchResultsDiv) {
        searchResultsDiv.style.maxHeight = "none";
        searchResultsDiv.style.overflow = "visible";
        showMoreButton.style.display = "none";
    }
}