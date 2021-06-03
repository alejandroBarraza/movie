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

  side === "left" ? (left = resp.data) : (right = resp.data);

  if (left && right) {
    console.log("run comparison");
    onMovieCompare();
  }
};

const onMovieCompare = () => {
  console.log("entre");
  const statisticToCompareL = document.querySelectorAll("#left-summary .notification");
  const statisticToCompareR = document.querySelectorAll("#right-summary .notification");

  statisticToCompareL.forEach((leftStat, index) => {
    rightStat = statisticToCompareR[index];
    const leftValue = leftStat.dataset.value;
    const rightValue = rightStat.dataset.value;
    if (rightValue > leftValue) {
      console.log(rightValue);
      leftStat.classList.remove("neutral");
      leftStat.classList.add("neutral-win");
    } else {
      console.log(leftValue);
      rightStat.classList.remove("neutral");
      rightStat.classList.add("neutral-win");
    }
  });
};

//function than display the html view from statistics
const movieTemplate = (movieDetail) => {
  const boxOffice = parseInt(movieDetail.BoxOffice.replace(/\$|,/g, ""));
  const metaScore = parseInt(movieDetail.Metascore);
  const rating = parseFloat(movieDetail.imdbRating);
  const votes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));

  let awards = movieDetail.Awards.split(" ").reduce((acc, curr) => {
    let word;
    word = parseInt(curr);

    if (isNaN(word)) {
      return acc;
    } else {
      return acc + word;
    }
  }, 0);

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
    <article data-value=${awards} class="notification neutral "> 
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value=${boxOffice} class="notification neutral "> 
      <p class="title" >${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value=${metaScore} class="notification neutral "> 
      <p class="title" >${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${rating} class="notification neutral "> 
      <p class="title" >${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Raiting</p>
    </article>
    <article data-value=${votes} class="notification neutral "> 
      <p class="title" >${movieDetail.imdbVotes}</p>
      <p class="subtitle">Votes</p>
    </article>
  
  `;
};
