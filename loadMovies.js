async function loadMovies(endpoint, divId, noResultsMessage) {
    const resultDiv = document.getElementById(divId);
    const apiKey = TMDBapiKey;
    const url = `https://api.themoviedb.org/3/${endpoint}?api_key=${apiKey}`;

    const response = await fetch(url);
    const json = await response.json();

    const allObjects = json.results || [];
    resultDiv.innerHTML = "";

    if (allObjects.length === 0){
        resultDiv.innerHTML = `<p>${noResultsMessage}</p>`;
        return;
    }

    for (let index = 0; index < allObjects.length; index++) {
        const object = allObjects[index];
        const posterSrc = object.poster_path
        ? `https://image.tmdb.org/t/p/w500${object.poster_path}`
        : "placeholder.png";

        resultDiv.innerHTML += `¨
        <div class="movie-item">
            <a style="width: 350px;cursor: default;"href="movieinfo.html?movieId=${object.id}">
            <img class="movie-poster" src="${posterSrc}" alt="${object.title}" loading="lazy"></img>
            </a>
            <p class="movie-title">
            <a href="movieinfo.html?movieId=${object.id}">${object.title}</a>
            </p>
        </div>
        `;
    }
}

window.addEventListener("DOMContentLoaded", () => {
    loadMovies("movie/popular", "popularMovies", "No popular movies found");
    loadMovies("movie/now_playing", "nowShowing", "No movies currently playing found");
});