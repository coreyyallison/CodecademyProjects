//CodeCademy Project working with API's. This program allows you to search for a location and it will return with places 
//to visit, things to do, and the weather in that location.


// Foursquare API Info
const clientId = 'ENTER YOUR CLIENT ID';
const clientSecret = 'ENTER YOUR CLIENT SECRET';
const url = 'https://api.foursquare.com/v2/venues/explore?near=';

// OpenWeather Info
const openWeatherKey = 'ENTER YOUR WEATHER KEY';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4")];
const $weatherDiv = $("#weather1");
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Add AJAX functions here:
const getVenues = async () => {
  const city = $input.val();
  const urlToFetch = url+city+'&limit=5&client_id='+clientId+'&client_secret='+clientSecret+'&v=20210730';

  try {
    let response = await fetch(urlToFetch);
      if(response.ok) {
        console.log(response);
        const jsonResponse = await response.json();

        //We get all of the venues as the original project askes, but instead of the given data I get the id of each to make a new request getting all data for each venue.
        //The id is required to get this data.
        let venuesHTML = jsonResponse.response.groups[0].items.map(item => 'https://api.foursquare.com/v2/venues/'+item.venue.id+'?&client_id='+clientId+'&client_secret='+clientSecret+'&v=20210730');
        console.log(venuesHTML);
        let venues = [];

        //I use a for loop going through each request and getting the associated json data and putting it into an array. Grabbing the json data using the same boilerplate
        //we have been using this section so far.
        for(i = 0; i < venuesHTML.length; i++) {
          response = await fetch(venuesHTML[i]);
          if(response.ok) {
            jsonVenueResponse = await response.json();
            venues.push(jsonVenueResponse.response.venue);
          }
        }
        console.log(venues);
        return venues;
      }
    } catch(error) {
    console.log(error);
  }
}

const getForecast = async () => {
  const urlToFetch = `${weatherUrl}?&q=${$input.val()}&APPID=${openWeatherKey}`;
  try {
    const response = await fetch(urlToFetch);
    if(response.ok) {
      const jsonResponse = await response.json();
      return jsonResponse;
    }
  }
  catch (error) {
    console.log(error);
  }
}


// Render functions
const renderVenues = (venues) => {
  //1st challange; we are using a for loop to go through each div and add content. I switched to a for loop
  //because I can go the length of how many total venues were found for that location or 4. Also using a for loop, I can randomize
  //which venue content is placed in each div element.
  //I first establish a random number to be used as the starting index by using a randNumber function that can be called and reused
  //in the while function to follow.
  const randNumber = () => Math.floor(Math.random() * venues.length);

  //I moved the destination h2 placement to the top since after each venue information placement I reset the value to 'USED' so it
  //is not used multiple times. 
  $destination.append(`<h2>${venues[0].location.city}</h2>`);

  for(let i = 0; i < venues.length && i < 4; ++i) {
    index = randNumber();

    //Using a while loop to check if we have already used this venue. If we have, it reloops and tries another
    //random number to find a new venue.
    while(venues[index] == 'USED') {
      index = randNumber();
    };
    //same code used in the original project to retrieve the needed information
    const venue = venues[index];
    const venueIcon = venue.categories[0].icon;
    const venueImgSrc = `${venueIcon.prefix}bg_64${venueIcon.suffix}`;
    let venueContent = createVenueHTML(venue.name, venue.location, venueImgSrc, venue.contact.formattedPhone, venue.photos.groups[0].items[0]);
    // console.log(venue.name);
    // console.log(venue.contact);
    // console.log(venue.tips[0].text);
    $venueDivs[i].append(venueContent);

    //once all information is retrieved, the index placement is replaced with 'USED' so it can be caught it the above while loop,
    //avoiding it being used multiple times
    venues[index] = 'USED'
  };
}

const renderForecast = (day) => {
  // Add your code here:  
  const weatherContent = createWeatherHTML(day);
  $weatherDiv.append(weatherContent);
}

const executeSearch = () => {
  $venueDivs.forEach(venue => venue.empty());
  $weatherDiv.empty();
  $destination.empty();
  $container.css("visibility", "visible");
  getVenues().then(venues => {
    return renderVenues(venues);
  });
  getForecast().then(forecast => {
    return renderForecast(forecast)});
  return false;
}

$submit.click(executeSearch)
