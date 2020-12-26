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
  <label><b> Search for a movie </label>
  <input class="input"/>
  <div class="dropdown>
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

//function than display poster and title from a fetch movie.
const displayMovies = (movies) => {
  for (const movie of movies) {
    const anchor = document.createElement("a"); //anchor bc bulma doc is an anchor for dropmenu.
    anchor.classList.add("dropdown-item"); //css class for dropdown in bulmca documentation.
    anchor.innerHTML = `
      <img src="${movie.Poster}">
      <h2>${movie.Title}</h2>
    `;
    results.append(anchor);
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
