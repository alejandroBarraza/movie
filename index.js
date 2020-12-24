//fetch api with axios.
const fetchData = async (searchMovie) => {
  const resp = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "ec9bde75",
      s: searchMovie,
    },
  });
  return resp.data.Search;
};

//select the input
const input = document.querySelector(".container input ");

//function than display poster and title from a fetch movie.
const displayMovies = (movies) => {
  for (const movie of movies) {
    const div = document.createElement("div");
    div.innerHTML = `
    <h2>${movie.Title}</h2>
    <img src="${movie.Poster}">
    `;
    document.querySelector("#target").append(div);
  }
};

//fuction fetch a movie each time user type.
const onInput = async ({ target }) => {
  //async beacuse movies should wait for fectch the movie.
  const movies = await fetchData(target.value); //movies constains the arrays of list movies
  //console.log(movies);
  displayMovies(movies);
};

//events that each times textValue change makes a fetch with debounce at 500ms delate.
input.addEventListener("input", debounce(onInput, 500));
