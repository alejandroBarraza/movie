//function that debounce a function a moment of time.call fn(onInput) as a callback
const debounce = (fn, delay = 1000) => {
  let idTimeOut;
  return (...arguments) => {
    if (idTimeOut) {
      clearInterval(idTimeOut);
    }
    idTimeOut = setTimeout(() => {
      fn.apply(null, arguments);
    }, delay);
  };
};
