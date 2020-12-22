//fetch api with axios.
const fetchData = async () => {
  const resp = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "ec9bde75",
      s: "avengers",
    },
  });
  console.log(resp.data);
};
fetchData();
