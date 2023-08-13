const loadingEl = document.querySelector(".loading");
const imgEl = document.querySelector(".loading img");
const citiesList = document.querySelector(".cities__list");
const cityInput = document.getElementById("city__input");

// setTimeout(() => {
//   loadingEl.classList.add("anime");
//   imgEl.classList.add("anime");
//   setTimeout(() => {
//     document.body.removeChild(loadingEl);
//   }, 600);
// }, 1000);

const filterAndDisplayCities = (inputValue) => {
  axios.get("../assets/data/cities.json").then((response) => {
    const cities = response.data;
    const filteredCities = cities.filter((cityObj) => {
      return cityObj.ar.toLowerCase().startsWith(inputValue);
    });
    const sortedCities = filteredCities
      .slice()
      .sort((a, b) => a.ar.localeCompare(b.ar));
    if (sortedCities.length > 0) {
      for (const city of sortedCities) {
        const content = `
      <li class="city" data-city-name="${city.en}">${city.ar}</li>
      `;
        citiesList.innerHTML += content;
      }
    } else {
      citiesList.innerHTML += "<p>لا يوجد مدينة بهذا الاسم</p>";
    }
  });
};
cityInput.addEventListener("input", (event) => {
  citiesList.parentElement.classList.add("fill");
  citiesList.innerHTML = "";
  const inputValue = event.target.value.toLowerCase().trim();
  filterAndDisplayCities(inputValue);
});
