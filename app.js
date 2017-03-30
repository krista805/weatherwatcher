var APPID = "bf78eb3bed23fe28eb20151ea3b96f81";
// create a variable for each one of the elements that we want to change
var temp;
var loc;
var icon;
var humidity;
var wind;
var direction;

function updateByZip(zip){
  var url = "http://api.openweathermap.org/data/2.5/weather?" +
    "zip=" + zip +
    "&APPID=" + APPID;
  sendRequest(url);
}

function updateByGeo(lat, lon){
  var url = "http://api.openweathermap.org/data/2.5/weather?" +
    "lat=" + lat +
    "&lon=" + lon +
    "&APPID=" + APPID;
  sendRequest(url);
}

function sendRequest(url){
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
      // JSON data type
      var data = JSON.parse(xmlhttp.responseText);
      // construct weather object
      var weather = {};
      weather.icon = data.weather[0].id;
      weather.humidity = data.main.humidity;
      weather.wind = data.wind.speed;
      weather.direction = degreesToDirection(data.wind.deg);
      weather.loc = data.name;
      weather.temp = K2F(data.main.temp);
      update(weather);
    }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

function degreesToDirection(degrees){
  var range = 360/16;
  var low = 360 - range/2;
  var high = (low + range) % 360;
  var angles = ["N", "NNE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "NE"];
  for( i in angles){
    if( degrees >= low && degrees < high)
      return angles[i];

    low = (low + range) % 360;
    high = (high + range) % 360;
  }
  return "N";
}

function K2C(k){
  return Math.round(k - 273.25);
}

function K2F(k){
  return Math.round(k*(9/5)-459.67);
}

// want to specify how we update these.will pass in weather conditions we want it to take.
function update(weather){
  wind.innerHTML = weather.wind;
  direction.innerHTML = weather.direction;
  humidity.innerHTML = weather.humidity;
  loc.innerHTML = weather.loc;
  temp.innerHTML = weather.temp;
  icon.src = "imgs/codes/" + weather.icon + ".png";
  // icon is using .src because we have special images
    //on html: src="imgs/codes/200.png"
}

function showPosition(position){
  updateByGeo(position.coords.latitude, position.coords.longitude);
}
// when the app loads, we want to initialize the var to be the elements on the screen
window.onload = function () {
  temp = document.getElementById("temperature");
  loc = document.getElementById("location");
  icon = document.getElementById("icon");
  humidity = document.getElementById("humidity");
  wind = document.getElementById("wind");
  direction = document.getElementById("direction");

  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    var zip = window.prompt("Could not discover your location. What is your zip code?");
    updateByZip(zip);
  }
  // updateByZip("01007");
}
