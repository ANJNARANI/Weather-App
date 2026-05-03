console.log("Hello Anjana")
const searchInput = document.querySelector("#searchInput")
const searchbtn = document.querySelector("#searchbtn")
const selectUnit = document.querySelector("#selectUnit")
const grantAccessBtn = document.querySelector("#grantAccess")
const dataTemp = document.querySelector("#datatemp")
const weatherDesc = document.querySelector("#weatherDesc")
const dateText = document.querySelector("#dateText")
const feelsLIKE = document.querySelector("#feelsLike")
const humidity = document.querySelector("#humidity")
const windSpeed = document.querySelector("#windSpeed")
// const cityLoction = docoument.querySelector("#cityLoction")
const citySearchLoction = document.getElementById("cityLoction")
const API_KEY = "4ab72ee54d6b4bb1af477985f45df71b"

const ForecastContainer = document.querySelector("#ForecastContainer")
// selectUnit.value="metric"

//fetching weather by city name
// const city = "Nagpur"
// const unit = "metric"
searchbtn.addEventListener('click', (e) => {
  e.preventDefault()
  const city = searchInput.value;
  const unit = selectUnit.value || "metric";
  if (city != "") {
    fetchCITYWEATHER(city, unit);

  } else (alert("search city is empty"))
})
async function fetchCITYWEATHER(city, unit) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${unit}`)
    const data = await response.json()
    console.log("API BY CITY NAME", data);
    renderApiData(data)
  } catch (error) {
    console.error(error);
    console.error("Error fetching weather:", error);

  }

}
//render function//
// fetchCITYWEATHER(city, unit)
function renderApiData(data) {
  const unit = selectUnit.value;
  dataTemp.innerHTML = `${Math.round(data.list[0]?.main?.temp)} °${unit === "metric" ? "C" : "F"
    }`;
  weatherDesc.innerHTML = data?.list[0]?.weather[0].description;
  dateText.innerHTML = data?.list[0]?.dt_txt.split(" ")[0];
  citySearchLoction.innerHTML = data?.city.name;
  feelsLIKE.innerHTML = `${Math.round(data.list[0]?.main?.feels_like)} °${unit === "metric" ? "C" : "F"
    }`;
  humidity.innerHTML = `${Math.round(data.list[0]?.main?.humidity)}%`;
  windSpeed.innerHTML = `${Math.round(data.list[0]?.wind?.speed)} ${unit === "metric" ? "m/s" : "mph"
    }`;
  ForecastContainer.innerHTML = "";
  const arr = [8, 16, 24, 32, 39]
  arr.forEach((index) => {
    if (data.list[index]) {
      const day = data.list[index]
      const dy = new Date(day.dt * 1000)
      const iconCode = day.weather[0].icon;
      const card = document.createElement("div")
      card.className =
        "bg-gradient-to-tr from-white to-sky-200 shadow-[0_4px_10px_rgb(0,0,0,0.12)] select-none  shadow-black my-[30px] rounded-xl p-4 flex flex-col items-center text-center hover:shadow-lg transition";
        card.innerHTML=`
        <p class="font-semibold">${day.dt_txt.split(" ")[0]} ${dy.toLocaleDateString("en-US", {
          weekday: "short",
        })}</p>
        <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="icon">
        <p class="text-xl font-bold">${Math.round(day.main.temp)}°${
        unit === "metric" ? "C" : "F"
      }</p>
      <p class="text-sm text-gray-600">${day.weather[0].description}</p>`;
      ForecastContainer.appendChild(card)
    }
  })



}

// grant access btn//
grantAccessBtn.addEventListener('click', getLoction)

function getLoction() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition)
  } else {
    alert("geolocation is not avilable at the time")
  }
}
//lat or lon position//
function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  }

  sessionStorage.setItem("user_coords", JSON.stringify(userCoordinates))
  fetchUserWeather(userCoordinates)
}
//FUN. THAT CALL THE API LAT & LONG//
async function fetchUserWeather(coordinates) {
  const { lat, lon } = coordinates
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
    const data = await response.json();
    console.log("searching by coordinates", data);
    renderApiData(data)
  } catch (error) {
    console.error(error)
    console.log("error in fetching weather", error)

  }
}
// get from session storage and update the weathre
function getFromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user_coords");
  const coordinates = JSON.parse(localCoordinates);
  fetchUserWeather(coordinates);

}

getFromSessionStorage();
