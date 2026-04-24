  let searchText = document.getElementById("txtSearch");
  if (searchText) {
  searchText.onkeydown = async function (event) {
    if (event.key === "Enter" && searchText.value.trim().length > 0) {
      event.preventDefault();
      let searchTerm = searchText.value; // Hämtar det sökta
      console.log("Searching for:", searchTerm);

      // aronpa function och API och vänta
      let results = await search(searchTerm);

      //renderResults(results);
      searchText.value = ""
      window.location.replace("resultpage.html?search=" + encodeURIComponent(searchTerm)); // Skicka sökterm till resultatsidan
    }
  }
};

async function performSearch(term) {
  let results = await search(term);
  renderResults(results, term);
}

const urlParams = new URLSearchParams(window.location.search);
const queryFromUrl = urlParams.get("search");

if (queryFromUrl) {
    performSearch(queryFromUrl);
  }


async function menuSearchbar() {
  console.log(TMDBapiKey);
  let menuSearch = document.getElementById("menuSearch");
  let searchTerm = menuSearch.value.trim();
  let menuDiv = document.getElementById("menuSearchResults");

  if (searchTerm.length > 0) {
    menuDiv.style.visibility = "visible";
    menuDiv.style.display = "block";
    let results = await search(searchTerm);
    renderMenuResults(results);
  } else{
    menuDiv.innerHTML = "";
    menuDiv.style.visibility = "hidden";
    menuDiv.style.display = "none";
  }
}

// Return JSon.
async function search(searchString) {

  //URL för API anrop
  let apiKey = TMDBapiKey;
  var url = `https://api.themoviedb.org/3/search/movie?query=${searchString}&api_key=${apiKey}`;
  console.log("Calling URL: ", url);

  //Anropa function med fetch
  let response = await fetch(url);

  // Resultaten till JSON
  let json = await response.json();
  return json;
}



function renderResults(results, term) {
  let resultDiv = document.getElementById("searchresults");
  let searchForDiv = document.getElementById("searchFor");
  console.log("results: ", results);
  let allObjects = results.results || [];
  console.log(allObjects);
  resultDiv.innerHTML = ""; // återställ sökresultat
  searchForDiv.innerHTML = "" //återställ header

  searchForDiv.innerHTML +=`
  <h1>Searching for: "${term}"</h1>
  `

  if (allObjects.length === 0) {
    console.log("No results found");
    resultDiv.innerHTML = "<p>No results found</p>";
    return;
  }

  for (let index = 0; index < allObjects.length; index++) {
    const object = allObjects[index];
    console.log("looping through objects", object);
    const posterSrc = object.poster_path 
      ? `https://image.tmdb.org/t/p/w500${object.poster_path}`
      : "placeholder.png";
    
    resultDiv.innerHTML += `
      <div class="movie-item">
        <a style="width: 350px;cursor: default;"href="movieinfo.html?movieId=${object.id}">
        <img class="movie-poster" src="${posterSrc}" alt="${object.title}" loading="lazy"></img>
        </a>
        <p class="movie-title"><a href="movieinfo.html?movieId=${object.id}">${object.title}</a></p>
      </div>
    `;
  }
}

updateShowMoreButtonVisibility(); //fix / optimise

function showMoreResults() {
  const showMoreButton = document.getElementById("showMoreButton");
  const searchResultsDiv = document.getElementById("searchresults");
  const buttonStyle = window.getComputedStyle(showMoreButton).display;

  if (buttonStyle !== "none") {
    searchResultsDiv.style.maxHeight = "none";
    searchResultsDiv.style.overflow = "visible";
    showMoreButton.style.display = "none";
  }
}


function renderMenuResults(results) {
  let resultDiv = document.getElementById("menuSearchResults");
  console.log("results: ", results);
  let allObjects = results.results;
  console.log(allObjects);
  resultDiv.innerHTML = "";


  if (allObjects.length === 0) {
    console.log("No results found");
    resultDiv.innerHTML = "<p>No results found</p>";
    return;
  }

  for (let index = 0; index < allObjects.length; index++) {
    const object = allObjects[index];
    console.log("looping through objects", object);
    //Objects results:
    if (object.poster_path) {
      resultDiv.innerHTML += `
      <div class="menu-result-item">
      <a href="movieinfo.html?movieId=${object.id}">
      <img class="Menu-movie-poster" src="https://image.tmdb.org/t/p/w500${object.poster_path}" loading="lazy"></img>
      </a>
      <p class="Menu-movie-title"><a class="menu-title" href="movieinfo.html?movieId=${object.id}">${object.title}</a></p>
      </div>
      `;
    } else {
      resultDiv.innerHTML += `
      <div class="menu-result-item">
      <a href="movieinfo.html?movieId=${object.id}">
      <img class="Menu-movie-poster" src="placeholder.png" width="25%" loading="lazy"></img>
      </a>
      <p class="Menu-movie-title"><a class="menu-title" href="movieinfo.html?movieId=${object.id}">${object.title}</a></p>
      </div>
      `;
    }
  }
}