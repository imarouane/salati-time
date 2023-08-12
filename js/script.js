const loadingEl = document.querySelector(".loading");
const imgEl = document.querySelector(".loading img");

setTimeout(() => {
  loadingEl.classList.add("anime");
  imgEl.classList.add("anime");
  setTimeout(() => {
    document.body.removeChild(loadingEl);
  }, 600);
}, 1000);

axios.get("../assets/data/cities.json").then((response) => {
  console.log(response.data[6].names.ar);
  // return response.data;
});
