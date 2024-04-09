const searchButton = document.getElementById("search-button");
const input = document.getElementById("city-name");
const weather = document.getElementById("weather");
const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weather-description");
const city = document.getElementById("city");
const country = document.getElementById("country");
const iconImage = document.getElementById("icon-image");
const errorMessage = document.getElementById("error-message");
const weatherContainer = document.getElementById("weather-container");
const windSpeed = document.getElementById("wind-speed");
const humidity = document.getElementById("humidity");

const key = `82005d27a116c2880c8f0fcb866998a0`;
const weatherTypes = [
  "Clear",
  "Clouds",
  "Rain",
  "Snow",
  "Thunderstorm",
  "Drizzle",
  //7xx: Atmosphere there are many like Smoke, Mist, Haze, Fog etc will come in same category
];

const fetchData = async (lat, lon) => {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`
    );
    if (response.status === 200) {
      const data = await response.json();
      const description = data.weather[0].description;
      const tempInKelvin = data.main.temp;
      const tempInCelcius = Math.floor(tempInKelvin - 273.15);
      const cityName = data.name;
      const countryName = data.sys.country;
      const weatherType = data.weather[0].main;
      const iconId = data.weather[0].icon;
      const humid = data.main.humidity;
      const wind = data.wind.speed;

      return {
        description,
        tempInCelcius,
        cityName,
        countryName,
        weatherType,
        iconId,
        humid,
        wind,
      };
    } else {
      console.log("ERROR! Wrong City Name");
    }
  } catch (e) {
    console.log(e);
  }
};

const fetchLocation = async (cityName) => {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${key}`
    );
    const data = await response.json();
    const { lat, lon } = data[0];
    return { lat, lon };
  } catch (e) {
    console.log(e);
    return { lat: "not found", lon: "not found" };
  }
};

const getWeatherForCurrentLocation = async () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const weatherData = await fetchData(latitude, longitude);
      displayWeatherData(weatherData);
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
};

getWeatherForCurrentLocation();

const getWeatherHandler = async () => {
  if (input.value.trim() === "") {
    console.log("Enter City Name");
    displayWeatherData("Please Enter City Name");
  } else {
    const { lat, lon } = await fetchLocation(input.value);
    const weatherData = await fetchData(lat, lon);
    if (weatherData) {
      weatherData.cityName = input.value;
    }
    displayWeatherData(weatherData);
  }
};

const capitalizeFirstLetter = (word) => {
  word = word.toLowerCase().split("");
  word[0] = word[0].toUpperCase();
  word = word.join("");
  return word;
};

const displayWeatherData = (weatherData) => {
  if (weatherData === undefined || weatherData === "Please Enter City Name") {
    weather.style.display = "none";
    errorMessage.style.display = "block";
    if (weatherData === "Please Enter City Name") {
      errorMessage.innerHTML = "Please Enter a City Name";
    } else {
      errorMessage.innerHTML = "Invalid City";
    }
    iconImage.setAttribute("src", `./images/icons/unknown.png`);
    weatherContainer.style.backgroundImage = "none";
  } else {
    const {
      tempInCelcius,
      description,
      cityName,
      countryName,
      wind,
      humid,
      iconId,
      weatherType,
    } = weatherData;
    temperature.innerHTML = tempInCelcius;
    weatherDescription.innerHTML = description;
    city.innerHTML = capitalizeFirstLetter(cityName);
    country.innerHTML = countryName;
    windSpeed.innerHTML = wind;
    humidity.innerHTML = humid;
    iconImage.setAttribute("src", `./images/icons/${iconId}.png`);
    if (weatherTypes.includes(weatherType)) {
      weatherContainer.style.backgroundImage =
        "url(/images/background/" + weatherType + ".avif)";
    } else {
      weatherContainer.style.backgroundImage =
        "url(/images/background/default.avif)";
    }
    weather.style.display = "block";
    errorMessage.style.display = "none";
  }
};

searchButton.addEventListener("click", getWeatherHandler);
