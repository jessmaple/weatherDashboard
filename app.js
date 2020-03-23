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
  if (search.length > 0 && cityArray.indexOf(search) === -1 ) {
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

function lookUpWeather() {}

loadCity();
