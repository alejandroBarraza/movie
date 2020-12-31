// const displayMoviError = (error) => {
//   const div = document.createElement("div");
//   return (div.innerHTML = `
//   <p>${error}</p>
//   `);
// };

//fetch api with axios.
const fetchData = async (searchMovie) => {
  const resp = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "ec9bde75",
      s: searchMovie,
    },
  });
  //return a empty array until make the dropdown seatchbar.(FIX AFTER)
  if (resp.data.Error) {
    return [];
  }
  return resp.data.Search;
};
//select the root elemt for append results
const root = document.querySelector(".autocomplete");
root.innerHTML = `
  <label><b> Search for an Anime </label>
  <input class="input"/>
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results">  
      </div>
    </div>         
  </div>

`;
//select the input
const input = document.querySelector(".container input ");
//select the dropdown div for show the dropmenu or not.
const dropdown = document.querySelector(".dropdown");
//select the reulst for display the content.
const results = document.querySelector(".results");
//select the dropdown menu
const menu = document.querySelector(".dropdown-menu");

//function than display poster and title from a fetch movie.
const displayMovies = (movies) => {
  //before display more movies.clean the dropdown content.
  //for the first time will me empty so doenst matters.
  results.innerHTML = "";

  for (const movie of movies) {
    const anchor = document.createElement("a"); //anchor bc bulma doc is an anchor for dropmenu.
    anchor.classList.add("dropdown-item"); //css class for dropdown in bulmca documentation.
    //check for broken images comming from API.
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    anchor.innerHTML = `
      <img src="${imgSrc}">
      <h2>${movie.Title}</h2>
    `;
    results.append(anchor);

    anchor.addEventListener("click", () => {
      dropdown.classList.remove("is-active");
      input.value = movie.Title;
      onMovieSelect(movie.imdbID);
    });
  }
};

//fuction fetch a movie each time user type.
const onInput = async ({ target }) => {
  //async beacuse movies should wait for fectch the movie.

  const movies = await fetchData(target.value); //movies constains the arrays of list movies

  //if i do the fetch and got an empty array .close the dropmenu.
  if (!movies.length) {
    //contains a empty array.
    dropdown.classList.remove("is-active");
    return; //return for dont enter in the another part of the code.
  }
  //console.log(movies);
  dropdown.classList.add("is-active");
  displayMovies(movies);
};

//events that each times textValue change makes a fetch with debounce at 500ms delate.
input.addEventListener("input", debounce(onInput, 500));

//events to close the dropmenu is user click OUTSIDE the menu options.
document.addEventListener("click", ({ target }) => {
  //console.log(event.target);
  //doing click outside root elements(root element grab all the menu)
  if (!root.contains(target)) {
    //if root not contains events target.means clicking outside this parent elemtent.
    dropdown.classList.remove("is-active");
  }
});

//second fetch for after movie seleecion and see full details.
const onMovieSelect = async (movie) => {
  const resp = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "ec9bde75",
      i: movie,
    },
  });
  //select target summary in html and replace with movietemplate funcion.
  document.querySelector("#summary").innerHTML = movieTemplate(resp.data);
};

//function than display the html view from statistics
const movieTemplate = (movieDetail) => {
  return `
    <article class = "media">
      <figure class = "media-left">
        <p class ="image">
          <img src=" ${movieDetail.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</P
        </div>
      </div>
    </article>
    <article class="notification is-primary"> 
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-primary"> 
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article class="notification is-primary"> 
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article class="notification is-primary"> 
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Raiting</p>
    </article>
    <article class="notification is-primary"> 
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">Votes</p>
    </article>
  `;
};
