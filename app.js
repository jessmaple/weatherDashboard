var cityArray = [];
// Array is used for storage, In this case, it is used to keep track of city names

// search button
// On click - Action for the button to be created, Allows user to add a list of cities in local storage
$("#search-button").on("click", function() {
  // Look up weather from open weather API
  lookUpWeather();

  // List of cities searched
  loadCity();
});

function loadCity() {
  //ul = Created a dynamic unordered list using JQuery
  var ul = $("<ul class='list-group'>");
  //   gives city value from text box
  var search = $("#search")
    .val()
    .trim();

  // .empty is to clear the div and avoid duplicates
  $("#city").empty();

  // There has to be a value in order for the search to work / indexOf shows that there is no city name in the array, if there is no city name, then its added.
  if (search.length > 0 && cityArray.indexOf(search) === -1) {
    // .push adds to our array
    cityArray.push(search);

    // whatever is entered, is added to localStorage
    // Inserting city arry to storage, json.Stringify converts objects to strings, local storage does not accept an object
    localStorage.setItem("city", JSON.stringify(cityArray));
  }

  //  Retrives city array from local storage
  var getCity = localStorage.getItem("city");
  // JSON.parse retrives data from local storage and converts back into an object using JSON.parse
  getCity = JSON.parse(getCity);

  // Display cities only if they are in local storage, if a city name is not in local storage, it will not be shown
  if (getCity != null) {
    //   Assign local storage array to city array if it isnt empty
    cityArray = getCity;

    // For loop looks through array to create li tags
    for (var i = 0; i < cityArray.length; i++) {
      var li = $("<li class='list-group-item'>");
      li.append(cityArray[i]);

      // Li tag appends to ul tag
      ul.append(li);
    }
    // ul appends to city div
    $("#city").append(ul);
  }
}

// GET requests retrieve data, Post requests inserts date, Delete requests delete data, Put requests update data
// client initiates requests, server recives requests, Ajax is a client, Jquery is all client requests
// api call -
function lookUpWeather() {
  var queryurl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    $("#search").val() +
    "&appid=70abe480196682c4e522136544b6489c";
  console.log(queryurl);
  $.ajax({
    url: queryurl,
    method: "GET"
    //    Static tags are tags in the HTML file, Dynamic tags are tags created from JS or Jquery
  }).then(function(data) {
    console.log(data);

    var pcity = $("<p>");
    var city = data.name;
    pcity.append(city);

    var date = data.dt;
    date = moment(date, "X").format("MM/DD/YYYY");
    pcity.append(date);
    $("#dashboard").append(pcity);

    var icon =
      "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
    var img = $("<img>");
    img.attr("src", icon);
    pcity.append(img);
    $("#dashboard").append(pcity);

    var K = data.main.temp;
    var temp = (K - 273.15) * 1.8 + 32;
    var ptemp = $("<p>");
    temp = Math.round(temp);
    ptemp.append("temperature:", temp);
    $("#dashboard").append(ptemp);

    var humid = data.main.humidity;
    var phumid = $("<p>");
    phumid.append("humidity:", humid);
    $("#dashboard").append(phumid);

    var wind = data.wind.speed;
    var pwind = $("<p>");
    pwind.append("Wind Speed:", wind);
    $("#dashboard").append(pwind);

    $.ajax({
      url: `http://api.openweathermap.org/data/2.5/uvi?appid=70abe480196682c4e522136544b6489c&lat=${data.coord.lat}&lon=${data.coord.lon}`,
      method: "GET"
    }).then(function(data) {
      console.log(data);
      var uv = data.value;
      var puv = $("<p>");
      puv.append("UV Index:", uv);
      $("#dashboard").append(puv);

      $.ajax({
        url: `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=70abe480196682c4e522136544b6489c`,
        method: "GET"
      }).then(function(data) {
        console.log(data);
        console.log(data.list[0].dt_txt);
        var row = $("<div class= 'row'>");

        for (let index = 0; index < data.list.length; index++) {
          if (data.list[index].dt_txt.indexOf("00:00:00") > -1) {
            //         <div class="card">
            //   <div class="card-body">
            //     <h5 class="card-title">Special title treatment</h5>
            //     <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
            //   </div>
            // </div>

            var col = $("<div class = 'col-sm-2'>");
            var card = $("<div class ='card'>");
            var cardBody = $("<div class = 'card-body'>");
            var title = $("<h5 class = 'card-title'>");
            title.append("5-Day Forcast:");
            var cardText = $("<p class = 'card-text'>");
            cardText.append(
              moment(data.list[index].dt, "X").format("MM/DD/YYYY")
            );
            card.append(cardBody, title, cardText);

            col.append(card);
            row.append(col);

            $("#fiveDay").append(row);

            console.log(row);
          }
        }
      });
    });
  });
}

loadCity();
