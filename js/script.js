const loadingEl = document.querySelector(".loading");
const imgEl = document.querySelector(".loading img");
const citiesList = document.querySelector(".cities__list");
setTimeout(() => {
  loadingEl.classList.add("anime");
  imgEl.classList.add("anime");
  setTimeout(() => {
    document.body.removeChild(loadingEl);
  }, 600);
}, 1000);

axios.get("../assets/data/cities.json").then((response) => {
  const cities = response.data;
  const sortedCeties = cities.sort((a, b) => {
    return a === b ? 0 : a > b ? 1 : -1;
  })
  console.log(sortedCeties);
  // for (const city of cities) {
  //   const content = `
  //   <li class="city" data-city-name="${city.en}">${city.ar}</li>
  //   `;
  //   citiesList.innerHTML += content;
  // }
});
