let apiKey = TMDBapiKey;
async function fetchMovieDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get("movieId");

    if (!movieId) {
        console.error("No movieId provided in the URL");
        document.getElementById("movieInfo").innerHTML = "<p>No movie chosen. <a href='homepage.html'>Go back to home</a></p>";
        return;
    }

    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`);
        if (!response.ok) {
            throw new Error("Could not fetch movie details");
        }
        const movie = await response.json();
        displayMovieDetails(movie);
    } catch (error) {
        console.error("Error fetching movie details:", error);
        document.getElementById("details").innerHTML = "<p>Error loading movie details. <a href='homepage.html'>Go back to home</a></p>";
    }
}

function displayMovieDetails(movie) {
    document.title = `Details: ${movie.title}`;
    document.getElementById("details").innerHTML = `
        <img class="info-poster" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} poster">
        <div class="info-text-container">
            <h1>${movie.title}</h1>
            <p class="info-txt"><strong>Overview:</strong> ${movie.overview}</p>
            <p><strong>Rating:</strong> ${movie.vote_average} / 10</p>
            <p><strong>Genres:</strong> ${movie.genres.map(genre => genre.name).join(", ")}</p>
            <p><strong>Release Date:</strong> ${movie.release_date}</p>
        </div>
            `;
}
    
window.addEventListener('load', fetchMovieDetails);