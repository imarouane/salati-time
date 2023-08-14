const loadingEl = document.querySelector(".loading");
const imgEl = document.querySelector(".loading img");
const citiesList = document.querySelector(".cities__list");
const cityInput = document.getElementById("city__input");
const searchContainer = document.querySelector(".search-container");
const prayerLocationInfo = document.querySelector(".prayer__location-info");
const prayerInfoContainer = document.querySelector(".prayer__info");
const loader = document.querySelector(".loader");
let cityNameEl = document.querySelector(".city-name");

// setTimeout(() => {
//   loadingEl.classList.add("anime");
//   imgEl.classList.add("anime");
//   setTimeout(() => {
//     document.body.removeChild(loadingEl);
//   }, 600);
// }, 1000);

const ARABIC_MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "ماي",
  "يونيو",
  "يوليوز",
  "غشت",
  "سبتمبر",
  "أكتوبر",
  "نونبر",
  "دجنبر",
];

const ARABIC_PRAYERS_NAME = {
  Fajr: "الفجر",
  Sunrise: "الشروق",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء",
};

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

const getFormattedTodayDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0"); //
  const year = today.getFullYear();

  return `${day}-${month}-${year}`;
};

function getPartOfDay(time) {
  const parts = time.split(":");
  const hour = parseInt(parts[0]);
  if (hour >= 5 && hour < 12) {
    return `${time} ص`;
  } else if (hour >= 12 && hour < 17) {
    return `${time} ظ`;
  } else if (hour >= 17 && hour < 21) {
    return `${time} م`;
  } else {
    return `${time} ل`;
  }
}

const displayPrayerInfo = (cityNameEn) => {
  return new Promise((resolve, reject) => {
    let url = `http://api.aladhan.com/v1/calendarByCity/2023/8?city=${cityNameEn}&country=Morocco&method=5`;
    axios
      .get(url)
      .then((response) => {
        const allDataObjs = response.data.data;
        const today = getFormattedTodayDate();
        for (const dataObj of allDataObjs) {
          if (dataObj.date.gregorian.date === today) {
            const timings = dataObj.timings;
            for (const timeKey in timings) {
              const time = timings[timeKey].split(" ")[0];
              const hourFormat = getPartOfDay(time);
              for (const prayerKey in ARABIC_PRAYERS_NAME) {
                if (timeKey === prayerKey) {
                  const contnet = `
                <li class="prayer__info--item">
                  <h3 class="prayer-name">${ARABIC_PRAYERS_NAME[prayerKey]}</h3>
                  <h3 class="prayer-time">${hourFormat}</h3>
                </li>
                `;
                  prayerInfoContainer.innerHTML += contnet;
                }
              }
            }
          }
        }
        resolve();
      })
      .catch(function (error) {
        console.log(error);
        reject("لا يوجد بيانات لهذه المدينة!");
      });
  });
};
const getPrayerinfo = (cityNameAr, cityNameEn) => {
  displayPrayerInfo(cityNameEn)
    .then(() => {
      setTimeout(() => {
        cityInput.value = cityNameAr;
        loader.classList.add("show");
        citiesList.parentElement.classList.remove("fill");
      }, 100);
    })
    .then(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          searchContainer.classList.add(
            "animate__animated",
            "animate__fadeOutUp"
          );
          resolve();
        }, 1000);
      });
    })
    .then(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          searchContainer.classList.add("hide");
          resolve();
        }, 500);
      });
    })
    .then(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          prayerLocationInfo.classList.add(
            "show",
            "animate__animated",
            "animate__fadeInUp"
          );
          cityNameEl.textContent = cityNameAr;
          resolve();
        }, 100);
      });
    })
    .then(() => {
      setTimeout(() => {
        prayerInfoContainer.classList.add(
          "show",
          "animate__animated",
          "animate__fadeInUp"
        );
      }, 50);
    });
};
