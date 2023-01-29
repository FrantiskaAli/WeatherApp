
//HTESE ARE INITIAL GLOBAL VARIABLES I WILL BE USING
const myApiKey = 'a469da266bd757c273bf3f83c9045983';
const todayWeather = $('#today');
const searchCity = $('#search-input');
const forecastRow = $('#forecast');
const searchBtn = $('#search-button');
const oldBtns = $('#history');
const clear = $('#search-clear');

//getting localy stored history
let searchHistory = JSON.parse(localStorage.getItem("history")) || [];
console.log(searchHistory)

//function for clearing locally stored information on red button click
clear.on('click', function(event){
    event.preventDefault;
    localStorage.clear()
})

//creating array of buttons using history
searchHistory.forEach(createButton)

//On click, event when searched city
searchBtn.on('click', function(event){
    event.preventDefault();
let city = searchCity.val();
let cityURL = 'https://api.openweathermap.org/geo/1.0/direct?q='+ city + '&limit=5&appid=' + myApiKey;//create valid url
$.ajax({
    url: cityURL,
    method: 'get'
}).then(function(response) {
if(response.length === 0){   //if api call is not responded due to incorrect input stop the function
    alert('not valid input')
    location.reload
    return 
}else{  //input was correct handling
searchHistory.push(city) ;
localStorage.setItem('history', JSON.stringify(searchHistory));//updating local storage
let oldSearch = $('<button>');//creating history buttons
oldSearch.text(city).attr('id',city).attr('style','width: 80%;').addClass('historyBtn btn-dark py-2 my-1 rounded');//styling with bootstrap and setting id sttribute to know the city names
oldBtns.append(oldSearch);
searchCity.val('');//reset search
//these variables to be used when executing functions of display weather and weather forecast
let latitude = response[0].lat;
let longtitude = response[0].lon;

displayCurrentWeather(latitude, longtitude);//this function displays current weather
weatherForecast(latitude, longtitude);//this function displays forecast
}
})
})
//here what happens when old button clicked
oldBtns.on('click', 'button', function(event){
    event.preventDefault();
 let city = $(this);
 displayOld(city.attr('id'));//display old function
})


//this function starts with finding latitude and longtitude of the searched city and then executes functions with them as parameters
function displayOld(city){
    let cityURL = 'https://api.openweathermap.org/geo/1.0/direct?q='+ city + '&limit=5&appid=' + myApiKey;
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
$.ajax({//calling api
    url: currentWeatherURL,
    method: 'get'
}).then(function(response){
    todayWeather.empty()
//HEADING HTML ELEMENTS 
    let today = moment().format("dddd, MMM DD YYYY");//heading made by using moment.js
    let heading = $(`<h2>`);
    heading.addClass('display-4');//bootstrap styling
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
    let imageSource = 'https://openweathermap.org/img/wn/' + iconCode + '@2x.png'
    let image = $('<img>')
    image.attr('src', imageSource)
    //html elements with objects data inside
    let temperature = $('<p>');
    temperature.addClass('.lead').text(`Temperature is ${temp}°C.`);
    let windSpeed = $('<p>');
    windSpeed.addClass('.lead').text(`Current speed of wind is ${wind}MPH.`);
    let humidityPercent = $('<p>');
    humidityPercent.addClass('.lead').text(`Humidity is currently ${humidity}%.`);
    heading.append(image)
    todayWeather.append(heading, temperature, windSpeed, humidityPercent )
    todayWeather.addClass('border border-color-danger rounded bg-white')
})
}
//function that displays forecast blocks
function weatherForecast(lat, lon){
    let forecastURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat +'&lon=' + lon +'&appid=' + myApiKey;
$.ajax({
    url: forecastURL,
    method:'get'
}).then(function (response){
    let forecastDay = moment()//making sure i have 5 days forecast headings
    let y = 0 //this is variable I am using to increse the date in moment js inside the loloop later on
    forecastRow.empty()//clearing up old
    let headingMain = $('<h2>');//creating heading for the forcast row
    headingMain.text('Five days forecast : ').addClass('w-100 mb-2')//heading width was set to 100% in bootstrap so it doesnt mess around
    forecastRow.append(headingMain)
for (let i = 3; i < 40; i += 8 ){
    //index increasing by 8, because in the response object there is information for 5 days for every 3 hours, 8*3= 24 so it adds up to a day
    //creating HTML elements
    y +=1 //this will increase date (together with line bellow)
    forecastDay = moment().add(y, 'day').format('DD/MM/YYYY')
    let iconID = response.list[i].weather[0].icon
    let fcIconSource = 'https://openweathermap.org/img/wn/' + iconID + '@2x.png' //creating url for icon based on in-object information
    let fcIcon = $('<img>');
    fcIcon.attr('src',fcIconSource);//adding the newly made url as src attribute in image
    let forecastBox = $('<article>')
    //accessing values form the object
    let fcTemp = response.list[i].main.temp;
    fcTemp -= 273.15;
    fcTemp = fcTemp.toFixed(2);
    let fcWind = response.list[i].wind.speed;
    fcWind /= 1.609344;
    fcWind = fcWind.toFixed(2);
    let fcHumidity = response.list[i].main.humidity;
    
//creating html elements
    let fcheading = $('<h3>')
    fcheading.text(forecastDay)
    let forecastTemp = $('<p>');
    forecastTemp.text(`Temp: ${fcTemp}°C`); 
    let forecastWind = $('<p>');
    forecastWind.text(`Wind: ${fcWind}MPH`);
    let forecastHum = $('<p>');
    forecastHum.text(`Humidity: ${fcHumidity}%.`)
    forecastBox.addClass('bg-info m-1 p-1 rounded text-center text-dark border border-dark col-lg-2 col-sm-4 col-md-4 col-10 align-items-center text-wrap')
    forecastBox.append(fcIcon, fcheading,  forecastTemp, forecastWind, forecastHum)
    forecastRow.append(forecastBox)
}
})
}
//function to create buttons
function createButton(cityname){//this function creates buttons simple way, it is used at the begining when retrieving old data
    let historySearch = $('<button>')
historySearch.text(cityname).attr('id',cityname).attr('style','width: 80%;').addClass('historyBtn btn-dark py-2 my-1 rounded')
oldBtns.append(historySearch)
}

