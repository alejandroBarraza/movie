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

  // return movie title
  inputValue(movie) {
    return movie.Title;
  },

  // fetch data show up in dropmenu
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
  onOptionSelect(movie) {
    //before render the movie data.hide tutorial banner.
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#left-summary"), "left");
  },
  ...autocomplete,
});

//second input search.
createAutocomplete({
  root: document.querySelector("#right-autocomplete"),
  onOptionSelect(movie) {
    //before render the movie data.hide tutorial banner.
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#right-summary"), "right");
  },
  ...autocomplete,
});

let left;
let right;
//second fetch for after movie selection and see full details.
const onMovieSelect = async (movie, summaryTarget, side) => {
  const resp = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "ec9bde75",
      i: movie,
    },
  });
  //select target summary in html and replace with movietemplate funcion.
  summaryTarget.style.display = "block";
  summaryTarget.innerHTML = movieTemplate(resp.data);
  if (side === "left") {
    left = resp.data;
    console.log(left);
  } else {
    right = resp.data;
    console.log(right);
  }

  if (left && right) {
    console.log("run comparison");
    onMovieCompare();
  }
};

const onMovieCompare = () => {
  console.log("entre");
  const statisticToCompareL = document.querySelectorAll("#left-summary .notification");
  const statisticToCompareR = document.querySelectorAll("#right-summary .notification");
  // const [awardsL, boxOfficeL, MetascoreL, ratingL, votesL] = statisticToCompareL.values();
  statisticToCompareL.forEach((leftStat, index) => {
    // rightStat = statisticToCompareR[index];
    const valueleft = {
      dollard: leftStat.querySelector(".title").innerText,
    };
    console.log(valueleft.dollard);
  });

  // if (side == "right") {
  //   const [awardsR, boxOfficeR, MetascoreR, ratingR, votesR] = statisticToCompareR.values();
  // }
  // const box = boxOfficeL > boxOfficeR ? console.log("win") : console.log("lose");
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
          <h1 class="content-style">${movieDetail.Title}</h1>
          <h4 class="content-style">${movieDetail.Genre}</h4>
          <p class="content-style">${movieDetail.Plot}</P
        </div>
      </div>
    </article>
    <article class="notification "> 
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article class="notification "> 
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article class="notification "> 
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article class="notification "> 
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Raiting</p>
    </article>
    <article class="notification "> 
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">Votes</p>
    </article>
  
  `;
};
