  let searchText = document.getElementById("txtSearch");
  if (searchText) {
  searchText.onkeydown = async function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      let searchTerm = searchText.value; // Hämtar det sökta
      console.log("Searching for:", searchTerm);

      // aronpa function och API och vänta
      let results = await search(searchTerm);

      renderResults(results);
      searchText.value = ""
      window.location.replace("resultpage.html?search=" + encodeURIComponent(searchTerm)); // Skicka sökterm till resultatsidan
    }
  }
};

async function performSearch(term) {
  let results = await search(term);
  renderResults(results);
}

const urlParams = new URLSearchParams(window.location.search);
const queryFromUrl = urlParams.get("search");

if (queryFromUrl) {
    performSearch(queryFromUrl);
  }


// Handle top search bar - searches as you type
async function handleTopSearch() {
  let menuSearch = document.getElementById("menuSearch");
  let searchTerm = menuSearch.value.trim();
  
  if (searchTerm.length > 0) {  // length check to avoid unnecessary API calls if needed
    let results = await search(searchTerm);
    renderResults(results);
  } else if (searchTerm.length === 0) {
    // Clear results when search is empty
    document.getElementById("searchMenuResults").innerHTML = "";
  }
}


async function menuSearchbar() {
  let menuSearch = document.getElementById("menuSearch");
  let searchTerm = menuSearch.value.trim();
  if (searchTerm.length > 0) {
    document.getElementById("menuSearchResults").style.visibility = "visible";
    let results = await search(searchTerm);
    renderMenuResults(results);
  } else if (searchTerm.length === 0) {
    document.getElementById("searchresults").innerHTML = "";
    document.getElementById("menuSearchResults").style.visibility = "hidden";

  }
}

// Return JSon.
async function search(searchString) {

  //URL för API anrop
  let apiKey = "57ef83c271a0b7aa58d9570361e9141a";
  var url = `https://api.themoviedb.org/3/search/movie?query=${searchString}&api_key=${apiKey}`;
  console.log("Calling URL: ", url);

  //Anropa function med fetch
  let response = await fetch(url);

  // Resultaten till JSON
  let json = await response.json();
  return json;
}


function renderResults(results) {
  let resultDiv = document.getElementById("searchresults");
  console.log("results: ", results);
  let allObjects = results.results;
  console.log(allObjects);
  resultDiv.innerHTML = ""; // återställ sökresultat


  if (allObjects.length === 0) {
    console.log("No results found");
    resultDiv.innerHTML = "<p>No results found</p>";
    return;
  }

  for (let index = 0; index < allObjects.length; index++) {
    const object = allObjects[index];
    console.log("looping through objects", object);
    //Objects results:
    if (allObjects[index].poster_path) {
      resultDiv.innerHTML += `<img class="movie-poster" src="https://image.tmdb.org/t/p/w500${allObjects[index].poster_path}" width="10%"></img>`;
    } else {
      resultDiv.innerHTML += `<p>No image available</p>`;
    }
    resultDiv.innerHTML += `<p class="movie-title">${allObjects[index].original_title}</p>`;
  }
}

function renderMenuResults(results) {
  let resultDiv = document.getElementById("searchresults");
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
      <img class="Menu-movie-poster" src="https://image.tmdb.org/t/p/w500${object.poster_path}" width="25%"></img>
      <p class="Menu-movie-title">${object.original_title}</p>
      </div>
      `;
    } else {
      resultDiv.innerHTML += `
      <div class="menu-result-item">
      <img class="Menu-movie-poster" src="placeholder.png" width="25%"></img>
      <p class="Menu-movie-title">${object.original_title}</p>
      </div>
      `;
    }
  }
}