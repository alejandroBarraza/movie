//reusable functinon for an input search
const createAutocomplete = ({ root, renderOption, onOptionSelect, inputValue, onFetchData }) => {
  //select the root elemt for append results
  root.innerHTML = `
  <label class="color"><b> Search  </label>
  <input class="input"/>
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results">  
      </div>
    </div>         
  </div>

`;

  //select the input
  const input = root.querySelector(".container input ");
  //select the dropdown div for show the dropmenu or not.
  const dropdown = root.querySelector(".dropdown");
  //select the reulst for display the content.
  const results = root.querySelector(".results");

  //function than display poster and title from a fetch movie.
  const displayMovies = (items) => {
    //before display more movies.clean the dropdown content.
    results.innerHTML = "";
    for (const item of items) {
      const option = document.createElement("a"); //anchor bc bulma doc is an anchor for dropmenu.
      option.classList.add("dropdown-item"); //css class for dropdown in bulmca documentation.
      option.innerHTML = renderOption(item);
      results.append(option);

      //event when user click a movie in dropmenu.
      option.addEventListener("click", () => {
        dropdown.classList.remove("is-active");
        input.value = inputValue(item); //change the input value.
        onOptionSelect(item.imdbID); //display movie info we choose
      });
    }
  };

  //fuction fetch a movie each time user type.
  const onInput = async ({ target }) => {
    //async beacuse movies should wait for fectch the movie.
    const items = await onFetchData(target.value); //movies constains the arrays of list movies
    //if i do the fetch and got an empty array .close the dropmenu.
    if (!items.length) {
      //contains a empty array.
      dropdown.classList.remove("is-active");
      return; //return for dont enter in the another part of the code.
    }
    //console.log(movies);
    dropdown.classList.add("is-active");
    displayMovies(items);
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
};
