async function loadMovies(endpoint, divId, noResultsMessage) {
    const resultDiv = document.getElementById(divId);
    const apiKey = TMDBapiKey;
    const separator = endpoint.includes("?") ? "&" : "?";
    const url = `https://api.themoviedb.org/3/${endpoint}${separator}api_key=${apiKey}`;

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

        resultDiv.innerHTML += `
        <div class="movie-item">
            <a class="movie-link" href="movieinfo.html?movieId=${object.id}">
                <img class="movie-poster" src="${posterSrc}" alt="${object.title}" loading="lazy">
            </a>
            <p class="movie-title">
                <a href="movieinfo.html?movieId=${object.id}">${object.title}</a>
            </p>
        </div>
        `;
    }

    if (['popularMovies', 'nowShowing', 'upcomingMovies', 'topRatedMovies'].includes(divId)) {
        setupInfiniteMovies(resultDiv);
    }
}

function setupInfiniteMovies(resultDiv) {
    if (!resultDiv || resultDiv.dataset.loopSetup === "true") return;

    const originalHTML = resultDiv.innerHTML;
    resultDiv.innerHTML += originalHTML;
    resultDiv.dataset.loopSetup = "true";
    resultDiv.dataset.paused = "false";

    const speed = 0.4;

    function step() {
        if (resultDiv.dataset.paused === "true") {
            requestAnimationFrame(step);
            return;
        }

        resultDiv.scrollLeft += speed;
        const halfWidth = resultDiv.scrollWidth / 2;
        if (resultDiv.scrollLeft >= halfWidth) {
            resultDiv.scrollLeft -= halfWidth;
        }

        requestAnimationFrame(step);
    }

    resultDiv.addEventListener("mouseenter", () => {
        resultDiv.dataset.paused = "true";
    });
    resultDiv.addEventListener("mouseleave", () => {
        resultDiv.dataset.paused = "false";
    });

    resultDiv.scrollLeft = 0;
    requestAnimationFrame(step);
}

async function loadTwoRandomTrailers() {
    const container1 = document.getElementById("randomTrailer1");
    const container2 = document.getElementById("randomTrailer2");

    container1.innerHTML = "<p>Loading...</p>";
    container2.innerHTML = "<p>Loading...</p>";

    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDBapiKey}`);
        if (!response.ok) {
            throw new Error("Failed to fetch now playing movies");
        }
        const data = await response.json();
        const movies = data.results;

        if (movies.length < 2) throw new Error("Not enough movies to select trailers from");

        const shuffledMovies = movies.sort(() => 0.5 - Math.random());
        const movie1 = shuffledMovies[0];
        const movie2 = shuffledMovies[1];

        await loadTrailerForContainer(movie1, container1);
        await loadTrailerForContainer(movie2, container2);
    } catch (error) {
        console.error("Error loading random trailers:", error);
        container1.innerHTML = "<p>Error loading trailer</p>";
        container2.innerHTML = "<p>Error loading trailer</p>";
    }
}

async function loadTrailerForContainer(movie, container) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${TMDBapiKey}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch videos for movie ID ${movie.id}`);
        }
        const data = await response.json();
        const trailer = data.results.find(video => video.type === "Trailer" && video.site === "YouTube");

        if (trailer) {
            container.innerHTML = `
                <h4>${movie.title}</h4>
                <iframe src="https://www.youtube.com/embed/${trailer.key}" allowfullscreen></iframe>
            `;
        } else {
            container.innerHTML = `<p>No trailer available for <a href="movieinfo.html?movieId=${movie.id}">${movie.title}</a></p>`;
        }
    } catch (error) {
        container.innerHTML = `<p>Error loading trailer for ${movie.title}</p>`;
    }
}

window.addEventListener("DOMContentLoaded", () => {
    loadMovies("movie/popular", "popularMovies", "No popular movies found");
    loadMovies("movie/now_playing", "nowShowing", "No movies currently playing found");
    loadMovies("movie/upcoming", "upcomingMovies", "No upcoming movies found");
    loadMovies("movie/top_rated", "topRatedMovies", "No top rated movies found");
    loadTwoRandomTrailers();
});

const genreSelect = document.getElementById("genreSelect");
genreSelect.addEventListener("change", () => {
    const selectedGenre = genreSelect.value;
    if (!selectedGenre) {
        document.getElementById("genreMovies").innerHTML = "";
        return;
    }

    loadMovies(
        `discover/movie?with_genres=${selectedGenre}`,
        "genreMovies",
        "No movies found for this genre"
    );
});