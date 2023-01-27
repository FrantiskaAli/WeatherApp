
//HTESE ARE INITIAL GLOBAL VARIABLES I WILL BE USING
const myApiKey = 'a469da266bd757c273bf3f83c9045983';
const todayWeather = $('#today');
const searchCity = $('#search-input');
const forecastRow = $('#forecast');
const searchBtn = $('#search-button');
//




//http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid={API key}   => RESULT[0].LAT and RESULT.[0].lon

//CREATING BUTTONS


//START WITH ACTUAL WEATHER

//FORECAST

//function for current weather
//thi8s function console.log latitutede and lantitude of the chosen city

let position = []
//this function finds latitude and longtitude of the searched city and returns array with them
function cityToLat(city){
    let cityURL = 'http://api.openweathermap.org/geo/1.0/direct?q='+ city + '&limit=5&appid=' + myApiKey;
$.ajax({
    url: cityURL,
    method: 'get'
}).then(function(response) {
let latitude = response[0].lat;
let longtitude = response[0].lon;
position.push(latitude, longtitude)
})

}


//this function wwill call on weather appi and create html alements to display current weather
function displayCurrentWeather(lat, lon){
    let currentWeatherURL = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat +'&lon=' + lon +'&appid=' + myApiKey;
$.ajax({
    url: currentWeatherURL,
    method: 'get'
}).then(function(response){
    console.log(response)
    
//HEADING HTML ELEMENTS 
    let today = moment().format("dddd, MMM DD YYYY");
    let heading = $(`<h2>`);
    heading.text( `${today} in London `);
    //VARIABLES TO ACCESS DATA IN OBJECT RETRIEVED
    let temp = response.main.temp;
    temp -= 273.15;
    temp = temp.toFixed(1);
    let wind =  response.wind.speed;
    wind /= 1.609344;
    wind= wind.toFixed(2)
    let humidity = response.main.humidity;
    //fetching icon picture
    let iconCode = response.weather[0].icon
    let imageSource = 'http://openweathermap.org/img/wn/' + iconCode + '@2x.png'
    let image = $('<img>')
    image.attr('src', imageSource)
    //html elements with objects data inside
    let temperature = $('<p>');
    temperature.addClass('.temperatureCurrent').text(`Temperature is ${temp}°C.`);
    let windSpeed = $('<p>');
    windSpeed.addClass('.speedOfWind').text(`Current speed of wind is ${wind}MPH.`);
    let humidityPercent = $('<p>');
    humidityPercent.addClass('.humidityCurrent').text(`Humidity is currently ${humidity}%.`);
    heading.append(image)
    todayWeather.append(heading, temperature, windSpeed, humidityPercent )

})
}

function weatherForecast(lat, lon){
    let forecastURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat +'&lon=' + lon +'&appid=' + myApiKey;
$.ajax({
    url: forecastURL,
    method:'get'
}).then(function (response){
    //in this forloop i am attempting to set index as well as 
for (let i = 3; i < 40; i += 8 ){
    //creating HTML elements
    let iconID = response.list[i].weather[0].icon
    let fcIconSource = 'http://openweathermap.org/img/wn/' + iconID + '@2x.png'
    let fcIcon = $('<img>');
    fcIcon.attr('src',fcIconSource);
    let forecastBox = $('<article>')
   
    //accessing values form the object
    let fcTemp = response.list[i].main.temp;
    fcTemp -= 273.15;
    fcTemp = fcTemp.toFixed(2);
    let fcWind = response.list[i].wind.speed;
    fcWind /= 1.609344;
    fcWind = fcWind.toFixed(2);
    let fcHumidity = response.list[i].main.humidity;

    let forecastTemp = $('<p>');
    forecastTemp.text(`Temp: ${fcTemp}°C`); 
    let forecastWind = $('<p>');
    forecastWind.text(`Wind: ${fcWind}MPH`);
    let forecastHum = $('<p>');
    forecastHum.text(`Humidity: ${fcHumidity}%.`)
   
    forecastBox.append(fcIcon, forecastTemp, forecastWind, forecastHum)
    forecastRow.append(forecastBox)


}
})



}


