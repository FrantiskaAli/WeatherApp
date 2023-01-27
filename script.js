
//HTESE ARE INITIAL GLOBAL VARIABLES I WILL BE USING
const myApiKey = 'a469da266bd757c273bf3f83c9045983';
const todayWeather = $('#today');
const searchCity = $('#search-input');
const forecastRow = $('#forecast');
const searchBtn = $('#search-button');
const oldBtns = $('#history');
//





//CREATING BUTTONS
searchBtn.on('click', function(event){
    event.preventDefault();
let city = searchCity.val();
cityToGeo(city)
let oldSearch = $('<button>')
oldSearch.text(city).attr('id',city).addClass('.historyBtn')
oldBtns.append(oldSearch)
searchCity.val('')
})
oldBtns.on('click', 'button', function(event){
    event.preventDefault();
 let city = $(this);
 cityToGeo(city.attr('id'));
 
 
 //cityToGeo(city)
    
    //cityToGeo(city)
})






//START WITH ACTUAL WEATHER

//FORECAST

//function for current weather
//thi8s function console.log latitutede and lantitude of the chosen city


//this function finds latitude and longtitude of the searched city and returns array with them
function cityToGeo(city){
    let cityURL = 'http://api.openweathermap.org/geo/1.0/direct?q='+ city + '&limit=5&appid=' + myApiKey;
$.ajax({
    url: cityURL,
    method: 'get'
}).then(function(response) {
let latitude = response[0].lat;
let longtitude = response[0].lon;

displayCurrentWeather(latitude, longtitude);//this function displays current weather
weatherForecast(latitude, longtitude);//this function displays forecast

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
    todayWeather.empty()
//HEADING HTML ELEMENTS 
    let today = moment().format("dddd, MMM DD YYYY");
    let heading = $(`<h2>`);
    let placeName = response.name
    heading.text( `${today} in ${placeName} `);
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
    let forecastDay = moment()//making sure i have 5 days forecast headings
    let y = 0 
    forecastRow.empty()
for (let i = 3; i < 40; i += 8 ){
    //creating HTML elements
    
    y +=1 //this will increase date (together with line bellow)
    forecastDay = moment().add(y, 'day').format('DD/MM/YYYY')
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
    
    let fcheading = $('<h3>')
    fcheading.text(forecastDay)
    let forecastTemp = $('<p>');
    forecastTemp.text(`Temp: ${fcTemp}°C`); 
    let forecastWind = $('<p>');
    forecastWind.text(`Wind: ${fcWind}MPH`);
    let forecastHum = $('<p>');
    forecastHum.text(`Humidity: ${fcHumidity}%.`)
   
    forecastBox.append(fcIcon, fcheading,  forecastTemp, forecastWind, forecastHum)
    forecastRow.append(forecastBox)


}
})



}


