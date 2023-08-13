const loadingEl = document.querySelector(".loading");
const imgEl = document.querySelector(".loading img");
const citiesList = document.querySelector(".cities__list");
const cityInput = document.getElementById("city__input");
const searchContainer = document.querySelector(".search-container");
const prayerLocationInfo = document.querySelector(".prayer__location-info");
const prayerInfoContainer = document.querySelector(".prayer__info");
const loader = document.querySelector(".loader");
setTimeout(() => {
  loadingEl.classList.add("anime");
  imgEl.classList.add("anime");
  setTimeout(() => {
    document.body.removeChild(loadingEl);
  }, 600);
}, 1000);

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
      <li class="city" onclick="getPrayerinfo('${city.ar}','${city.en}')">${city.ar}</li>
      `;
        citiesList.innerHTML += content;
      }
    } else {
      citiesList.innerHTML = "";
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

const displayPrayeInfo = () => {};
const getPrayerinfo = (cityNameAr, cityNameEn) => {
  new Promise((resolve, reject) => {
    setTimeout(() => {
      cityInput.value = cityNameAr;
      loader.classList.add("show");
      citiesList.parentElement.classList.remove("fill");
      resolve();
    }, 100);
  })
    .then(() => {
      new Promise((resolve, reject) => {
        setTimeout(() => {
          searchContainer.classList.add("animate__fadeOutUp");
          resolve();
        }, 1000);
      });
    })
    .then(() => {
      new Promise((resolve, reject) => {
        setTimeout(() => {
          searchContainer.classList.add("hide");
          resolve();
        }, 1200);
      });
    })
    .then(() => {
      new Promise((resolve, reject) => {
        setTimeout(() => {
          prayerLocationInfo.classList.add("show", "animate__fadeInUp");
          resolve();
        }, 1200);
      });
    })
    .then(() => {
      setTimeout(() => {
        prayerInfoContainer.classList.add("show", "animate__fadeInUpBig");
      }, 1200);
    });

  console.log(cityNameEn);
};
