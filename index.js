//reusable object to pass in to CreateAutocomplete object.
const autocomplete = {
  renderOption(movie) {
    //check for broken images comming from API.
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
    <img src="${imgSrc}">
    <h2>${movie.Title}</h2>
  `;
  },
  onOptionSelect(movie) {
    //before render the movie data.hide tutorial banner.
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie);
  },
  inputValue(movie) {
    return movie.Title;
  },
  async onFetchData(searchTerm) {
    const resp = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "ec9bde75",
        s: searchTerm,
      },
    });
    //return a empty array until make the dropdown seatchbar.(FIX AFTER)
    if (resp.data.Error) {
      return [];
    }
    return resp.data.Search;
  },
};

//first input search

createAutocomplete({
  root: document.querySelector("#left-autocomplete"),
  ...autocomplete,
});

//second input search.
createAutocomplete({
  root: document.querySelector("#right-autocomplete"),
  ...autocomplete,
});

//second fetch for after movie selection and see full details.
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
