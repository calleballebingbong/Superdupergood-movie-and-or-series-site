async function setRandomHeroBackground() {
    try {
    const apiKey = TMDBapiKey;
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;

    const response = await fetch(url);
    const data = await response.json();

    const movies = data.results || [];
    if (movies.length === 0) return;

    const randomMovie = movies[Math.floor(Math.random() * movies.length)];

    const heroElems = document.querySelectorAll(".hero-bg");
    if (heroElems.length === 0) return;

    const usedIndexes = new Set();
    heroElems.forEach((hero) => {
        let randomIndex;
        if (usedIndexes.size >= movies.length) {
            randomIndex = Math.floor(Math.random() * movies.length);
        } else {
            do {
                randomIndex = Math.floor(Math.random() * movies.length);
            } while (usedIndexes.has(randomIndex));
            usedIndexes.add(randomIndex);
        }

        const randomMovie = movies[randomIndex];
        const imagePath = randomMovie.backdrop_path || randomMovie.poster_path;
        if (!imagePath) return;

        hero.style.backgroundImage = `
        linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
        url("https://image.tmdb.org/t/p/w1280${imagePath}")
        `;
    });
    } catch (error) {
    console.error("Failed to load hero background:", error);
    }
}

document.addEventListener("DOMContentLoaded", setRandomHeroBackground);