const API_KEY = "caad362517791514675eb7475054c156";
const input = document.querySelector(".header__form-input");
const inputBnt = document.querySelector(".header__form-img");
const timeCity = document.querySelector(".info__time");
const cityTag = document.querySelector(".info__city");
const gradus = document.querySelector(".info__gradus");
const gradus2 = document.querySelector(".temp");
const pressure = document.querySelector(".pressure");
const himidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind");
const infoImage = document.querySelector(".info__image");
const dataInfo = document.querySelector(".data__info");
const noResult = document.querySelector(".noResult");
const weekRes = document.querySelector(".weather-week");
const dataList = document.querySelector('.dataList')
const body = document.querySelector('body')
let city = null;


function checkInput() {
  city = input.value.trim();
  dataList.innerHTML = ''
  if (!city) return;
  input.value = "";
  setTimeout(() => {
    document.querySelector(".data__info").classList.add("data__info-active");
  }, 400);
}

async function findfCity () {
  dataList.innerHTML = ''
  dataInfo.style.opacity = 0;
  weekRes.style.opacity = 0;
  noResult.style.opacity = 0;
  dataList.style.opacity = 1
  body.style.overflow = 'hidden';

  if (input.value.length < 2 || input.value === '') {
    return
  }

  const response = await fetch(`./weather.json`)
  const data = await response.json()
  const filterData = await data.filter((item) => item.name.toLowerCase().startsWith(input.value.toLowerCase()))
  console.log(filterData)


  filterData.forEach(item => {
    const cityEl = document.createElement('li')
    cityEl.textContent = item.name
    dataList.append(cityEl)
    cityEl.addEventListener('click', () => {
      input.value = cityEl.textContent
      input.focus()
      dataList.style.opacity = 0
    })
  })
  }
  input.addEventListener('input', findfCity)

async function getData() {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city},&appid=${API_KEY}&units=metric`
  );
  const data = await response.json();

  async function getWeatherOnWeek() {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.8/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=minutely,hourly,alerts&units=metric&lang=ru&appid=${API_KEY}`
    );
    const arrData = await response.json();
    console.log(arrData);

    const cardTitle = document.querySelectorAll(".card__title");
    cardTitle.forEach((item, index) => {
      const str = new Date(arrData.daily[index].dt * 1000).toLocaleString(
        "ru-Ru",
        {
          weekday: "short",
        }
      );
      item.textContent = str[0].toUpperCase() + str.slice(1);
    });

    const cardData = document.querySelectorAll(".card__data");
    cardData.forEach((item, index) => {
      item.textContent = new Date(
        arrData.daily[index].dt * 1000
      ).toLocaleDateString("ru-Ru", {
        day: "2-digit",
        month: "short",
      });
    });

    const cardImage = document.querySelectorAll(".card__image");
    cardImage.forEach((item, index) => {
      const imageUrl = arrData.daily[index].weather[0].main.toLowerCase();
      item.src = `./images/${imageUrl}.svg`;
    });

    const maxTemp = document.querySelectorAll(".card__max-temp");
    maxTemp.forEach((item, index) => {
      if (Math.round(arrData.daily[index].temp.max) >= 0) {
        item.textContent = "+" + Math.round(arrData.daily[index].temp.max);
      } else {
        item.textContent = Math.round(arrData.daily[index].temp.max);
      }
    });

    const minTemp = document.querySelectorAll(".card__min-temp");
    minTemp.forEach((item, index) => {
      if (Math.round(arrData.daily[index].temp.min) >= 0) {
        item.textContent = "+" + Math.round(arrData.daily[index].temp.min);
      } else {
        item.textContent = Math.round(arrData.daily[index].temp.min);
      }
    });

    const cardAbout = document.querySelectorAll(".card__about");
    cardAbout.forEach((item, index) => {
      item.textContent = arrData.daily[index].weather[0].description;
    });
  }
  getWeatherOnWeek();

  if (!response.ok) {
    dataInfo.style.opacity = 0;
    noResult.style.opacity = 1;
    weekRes.style.opacity = 0;
    body.style.overflow = 'hidden';
    return;
  } else {
    dataInfo.style.opacity = 1;
    noResult.style.opacity = 0;
    weekRes.style.opacity = 1;
    body.style.overflow = 'auto';
  }

  const imageUrl = data.weather[0]["main"].toLowerCase();
  console.log(imageUrl);
  infoImage.src = `./images/${imageUrl}.svg`;

  const date = new Date(new Date().getTime() + data.timezone * 1000);
  const hours = "0" + date.getUTCHours();
  const minutes = "0" + date.getUTCMinutes();
  timeCity.textContent = "Время: " + hours.slice(-2) + ":" + minutes.slice(-2);

  gradus.textContent = Math.round(data.main.temp) + "°";
  gradus2.textContent =
    Math.round(data.main.temp) +
    `° - ощущается как ${Math.round(data.main.feels_like)}°`;
  cityTag.textContent = "Город: " + data.name;

  const MmHg = Math.round(data.main.pressure * 0.750062);

  if (MmHg >= 800) {
    pressure.textContent = MmHg + " мм ртутного столба" + " - высокое";
  } else if (700 <= MmHg <= 800) {
    pressure.textContent = MmHg + " мм ртутного столба" + " - нормальное";
  } else {
    pressure.textContent = MmHg + " мм ртутного столба" + " - низкое";
  }

  himidity.textContent = data.main.humidity
    ? data.main.humidity + "%"
    : "Без осадков";

  const directions = [
    "северный",
    "северо-восточный",
    "восточный",
    "юго-восточный",
    "южный",
    "юго-западный",
    "западный",
    "северо-западный",
  ];
  const deg = data.wind.deg;
  const index = Math.round(deg / 45) % 8;
  const windRes = directions[index];
  const windSpeed = Math.round(data.wind.speed);

  if (windSpeed <= 5) {
    wind.textContent = windSpeed + " м/с " + windRes + ` - слабый ветер`;
  } else if (windSpeed <= 7) {
    wind.textContent = windSpeed + " м/с " + windRes + ` - умеренный ветер`;
  } else if (windSpeed <= 9) {
    wind.textContent = windSpeed + " м/с " + windRes + ` - свежий ветер`;
  } else if (windSpeed >= 10) {
    wind.textContent = windSpeed + " м/с " + windRes + ` - сильный ветер`;
  }
}

function getCity() {
  inputBnt.addEventListener("click", () => {
    checkInput();
    getData();
    getWeatherOnWeek();
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      checkInput();
      getData();
      getWeatherOnWeek();
    }
  });
}
getCity();
