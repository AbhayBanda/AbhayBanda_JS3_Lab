const current_weather_api = {
  key: "7e3f21edee540e6110af347b55eb1ab2",
  base: "https://api.openweathermap.org/data/2.5/weather",
};

const geocodingApi = {
  key: "7e3f21edee540e6110af347b55eb1ab2",
  base: "http://api.openweathermap.org/geo/1.0/direct",
};
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let regionNames = new Intl.DisplayNames(["en"], { type: "region" });

var input = document.getElementById("city-input");
var city = "Delhi";
addEventListener("keypress", (input) => {
  if (input.key === "Enter") {
    const cityName = input.target.value;
    console.log(`Calling findWeatherforecast( ${cityName} )`);
    city = cityName;
    findWeatherforecast(cityName);
    input.target.value = "";
  }
});

const findWeatherforecast = (cityName) => {
  console.log(`Calling getLatAndLong( ${cityName} )`);
  getLatAndLong(cityName);
};

const getLatAndLong = (cityName) => {
  fetch(`${geocodingApi.base}?q=${cityName}&appid=${geocodingApi.key}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.length === 0) alert("Incorrect City name");
      else {
        console.log(`Calling getCityName( ${data} )`);
        getCityName(data);
      }
    })
    .catch((error) => console.log(error.message));
};

const getCityName = ([{ lat, lon, country }]) => {
  console.log(
    `[Latitude] : ${lat} [Longitude] : ${lon} [Country] : ${regionNames.of(
      country
    )}`
  );
  fetch(
    `${current_weather_api.base}?lat=${lat}&lon=${lon}&units=metric&appid=${geocodingApi.key}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.cod !== 200)
        alert(data.message || "OOPS!! error in parsing weather information");
      else {
        console.log(`Calling getWeatherInformation( ${data} )`);
        getWeatherInformation(data, country);
      }
    })
    .catch((error) => console.log(error.message));
};

const getWeatherInformation = ({ weather, main }, country) => {
  const [{ main: currentWeather }] = weather;
  const { temp, temp_min, temp_max } = main;

  dateUtil();

  document.getElementById(
    "city-country"
  ).innerText = `${city}, ${regionNames.of(country)}`;
  document.getElementById("temp").innerHTML = `${temp}°C`;
  document.getElementById("current-wather").innerText = `${currentWeather}`;
  document.getElementById(
    "min-max-temp"
  ).innerHTML = `${temp_min}°C / ${temp_max}°C`;
};

const dateUtil = () => {
  const date = new Date();
  const weekDay = weekdays[date.getDay()];
  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const currentDate = date.getDate();

  document.getElementById(
    "date"
  ).innerHTML = `${weekDay} ${currentDate} ${month} ${year}`;
};
Window.onload = findWeatherforecast(city);
