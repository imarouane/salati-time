const loadingEl = document.querySelector(".loading");
const imgEl = document.querySelector(".loading img");
const citiesList = document.querySelector(".cities__list");
const cityInput = document.getElementById("city__input");
const searchContainer = document.querySelector(".search-container");
const prayerLocationInfo = document.querySelector(".prayer__location-info");
const prayerInfoContainer = document.querySelector(".prayer__info");
const loader = document.querySelector(".loader");
const cityNameEl = document.querySelector(".city-name");
const hijriDate = document.querySelector(".hijri-date");
const worldDate = document.querySelector(".world-date");
const changeLocationBtn = document.querySelector(".btn-location");
let nowTime = document.querySelector(".now-time");

// setTimeout(() => {
//   loadingEl.classList.add("anime");
//   imgEl.classList.add("anime");
//   setTimeout(() => {
//     document.body.removeChild(loadingEl);
//   }, 600);
// }, 1000);

const updateDynamicHour = () => {
  let time = new Date().toLocaleTimeString("en-US", {
    timeZone: "Africa/Casablanca",
    // timeZoneName: "short",
  });
  let hours = time.split(" ")[0].split(":")[0];
  let minutes = time.split(" ")[0].split(":")[1];
  nowTime.innerHTML = `${hours}:${minutes}`;
};
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
  citiesList.parentElement.classList.add("fill", "animate__slideInDown");
  citiesList.innerHTML = "";
  const inputValue = event.target.value.toLowerCase().trim();
  filterAndDisplayCities(inputValue);
});

const getTodayDate = () => {
  const today = new Date();
  return today.toLocaleDateString();
};

const getArabicMonth = (month) => {
  return ARABIC_MONTHS[month - 1];
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
  let url = `http://api.aladhan.com/v1/calendarByCity/2023/8?city=${cityNameEn}&country=Morocco&method=5`;
  axios
    .get(url)
    .then((response) => {
      const allDataObjs = response.data.data;
      const today = getTodayDate();
      prayerInfoContainer.innerHTML = "";
      for (const dataObj of allDataObjs) {
        const prayerTime = new Date(dataObj.date.readable).toLocaleDateString();
        if (prayerTime === today) {
          hijriDate.innerHTML = `${dataObj.date.hijri.day}/${dataObj.date.hijri.month.ar}/${dataObj.date.hijri.year}هـ`;
          worldDate.innerHTML = `${dataObj.date.gregorian.day}/${getArabicMonth(
            dataObj.date.gregorian.month.number
          )}/${dataObj.date.gregorian.year}م`;
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
    })
    .catch(function () {
      throw new Error("لا يوجد بيانات لهذه المدينة!");
    });
};
const getPrayerinfo = (cityNameAr, cityNameEn) => {
  new Promise((resolve, reject) => {
    cityInput.value = cityNameAr;
    loader.classList.add("show");
    citiesList.parentElement.classList.remove("fill");
    resolve();
  })
    .then(() => {
      try {
        return new Promise((resolve, reject) => {
          displayPrayerInfo(cityNameEn);
          resolve();
        });
      } catch (error) {
        searchContainer.innerHTML += `<p class='error-messge'>${error}</p>`;
      }
    })
    .then(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          searchContainer.classList.add(
            "animate__animated",
            "animate__fadeOutUp"
          );
          resolve();
        }, 500);
      });
    })
    .then(() => {
      return new Promise((resolve) => {
        IntervalId = setInterval(updateDynamicHour, 1000);
        setTimeout(() => {
          searchContainer.classList.add("hide");
          loader.classList.remove("show");
          searchContainer.classList.remove("animate__animated");
          cityInput.value = "";
          resolve();
        }, 500);
      });
    })
    .then(() => {
      return new Promise((resolve) => {
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
    })
    .catch(() => {});
};

changeLocationBtn.addEventListener("click", () => {
  new Promise((resolve, reject) => {
    setTimeout(() => {
      prayerLocationInfo.classList.add("animate__fadeOutDown");
      prayerInfoContainer.classList.add("animate__fadeOutUp");
      resolve();
    }, 100);
  }).then(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        prayerLocationInfo.classList.remove("show", "animate__fadeInUp");
        prayerInfoContainer.classList.remove("show", "animate__fadeInUp");
        resolve();
      }, 1000);
    }).then(() => {
      searchContainer.classList.remove("hide");
      prayerLocationInfo.classList.remove("animate__fadeOutDown");
      prayerInfoContainer.classList.remove("animate__fadeOutUp");
    });
  });
});
