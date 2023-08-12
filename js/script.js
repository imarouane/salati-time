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
  const sortedCities = [];
  const citiesInArabic = [];
  for (const city of cities) {
    citiesInArabic.push(city.ar);
  }
  citiesInArabic.sort();
  // console.log(citiesInArabic);
  for (let i = 0; i < citiesInArabic.length; i++) {
    for (let j = 0; j < cities.length; j++) {
      if (citiesInArabic[i] === cities[j].ar) {
        sortedCities.push({ ar: citiesInArabic[i], en: cities[j].en });
      }
    }
  }
  console.log(sortedCities);
  console.log(sortedCities.length);
  for (const city of sortedCities) {
    const content = `
    <li class="city" data-city-name="${city.en}">${city.ar}</li>
    `;
    citiesList.innerHTML += content;
  }
});
