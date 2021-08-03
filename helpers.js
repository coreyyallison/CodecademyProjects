//added a two more variables to display more information on each venue
const createVenueHTML = (name, location, iconSource, phone, photo) => {
  return `<h2>${name}</h2>
  <img class="venueimage" src="${photo.prefix}100x100${photo.suffix}"/>
  <h3>Phone:</h3><p>${phone}<p>  
  <h3>Address:</h3>
  <p>${location.address}</p>
  <p>${location.city}</p>
  <p>${location.country}</p>`
}

//Same function as in original project, but I have added some <h2> templates that display the 'Feels like temp, humidity, and wind speed'
const createWeatherHTML = (currentDay) => {
  return `<h2>${weekDays[(new Date()).getDay()]}</h2>
		<h2>Temperature: ${kelvinToFahrenheit(currentDay.main.temp)}&deg;F</h2>
    <h2>Feels like: ${kelvinToFahrenheit(currentDay.main.feels_like)}&deg;F</h2>
		<h2>Condition: ${currentDay.weather[0].description}</h2>
    <h2>Humidity: ${currentDay.main.humidity}%</h2>
    <h2>Wind Speed: ${currentDay.wind.speed}mph</h2>
  	<img src="https://openweathermap.org/img/wn/${currentDay.weather[0].icon}@2x.png">`;
}

const kelvinToFahrenheit = k => ((k - 273.15) * 9 / 5 + 32).toFixed(0);