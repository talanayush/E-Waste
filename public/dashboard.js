var latitude = 28.6;
var longitude = 77.3;

userLocation = [latitude, longitude];

var map;

function initializeMap() {
    map = new Microsoft.Maps.Map(document.getElementById('map'), {
        credentials: 'Akj9lWVlXHAaPXZFYAV0PMIp5QWMEd752OuexkY-6h2VrLsQXudjsJ2Sjmlj0Y-s', 
        center: new Microsoft.Maps.Location(28.6490624, 77.2112384),
        zoom: 10,
    });
}

function addPushpin(location) {
    var pin = new Microsoft.Maps.Pushpin(location, {
        title: 'Your Location',
        subTitle: 'Coordinates: ' + location.latitude + ', ' + location.longitude,
        color: 'red'
    });

    map.entities.push(pin);
}

function detectLocation(){
    var x = document.getElementById("coord");

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
      
          console.log("Latitude: " + latitude + "  , Longitude: " + longitude);
          x.innerHTML = "Latitude: " + latitude + "  , Longitude: " + longitude;

          initializeMap();
          console.log(latitude, longitude);
          addPushpin(new Microsoft.Maps.Location(latitude, longitude));

        }, function(error) {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              console.error("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              console.error("The request to get user location timed out.");
              break;
            case error.UNKNOWN_ERROR:
              console.error("An unknown error occurred.");
              break;
          }
        });
      } else {
        console.error("Geolocation is not available in this browser.");
    }
}

function insertIntoTable(data) {
  var divi = document.getElementById('locations');
  divi.innerHTML = "";
  var outerList = document.createElement("ul");
  outerList.id = "locationListID";


  for (var i = 0; i < data.length; i++) {
    var innerList = document.createElement("ul");
    innerList.id = "locationPacket";

    var listItem1 = document.createElement("li");
    listItem1.textContent = data[i][0];
    listItem1.id = "li"; // Set the id for listItem1

    var listItem2 = document.createElement("li");
    listItem2.textContent = data[i][1];
    listItem2.id = "li"; // Set the id for listItem2

    var listItem3 = document.createElement("li");
    listItem3.textContent = data[i][2];
    listItem3.id = "li"; // Set the id for listItem3

    var link = document.createElement("a");
    link.href = data[i][3];
    link.textContent = "GMap";
    link.id = "li"; // Set the id for the link

    var listItem4 = document.createElement("li");
    listItem4.appendChild(link);
    listItem4.id = "gmapLink"; // Set the id for listItem4

    innerList.appendChild(listItem3);
    innerList.appendChild(listItem1);
    innerList.appendChild(listItem2);
    innerList.appendChild(listItem4);
    innerList.appendChild(document.createElement('hr'));
    
    // Set an id for the innerList itself if needed
    innerList.id = "innerList_" + i;

      // for (var j = 0; j < data[i].length; j++) {
      //     var listItem = document.createElement("li");

      //     if (j === 3) {
      //         var link = document.createElement("a");
      //         link.href = data[i][j];
      //         link.textContent = "Link Text";
      //         listItem.appendChild(link);
      //     } else {
      //         listItem.textContent = data[i][j];
      //     }

      //     innerList.appendChild(listItem);
      // }

      var outerListItem = document.createElement("li");
      outerListItem.appendChild(innerList);
      outerList.appendChild(outerListItem);
  }
  console.log('outer list : ', outerList);
  divi.appendChild(outerList); // Add the outer list to the div element.
}



function loadMapScenario() {
    initializeMap();

    centreCoordinates.forEach(function (coordinate) {
        var latitude = coordinate[0];
        var longitude = coordinate[1];

        var pin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(latitude, longitude), {
            title: 'Centres',
            subTitle: 'Subtitle',
        });

        map.entities.push(pin);
    });

    console.log("Hello", latitude, longitude);
    addPushpin(new Microsoft.Maps.Location(latitude, longitude));
}

function organizeResponseAndPushpin(response){
  var result = [];
  for(let a = 0; a < response.length; ++a){
    result.push([response[a]['lat'], response[a]['long'], response[a]['centre'], response[a]['gmapLink']]);
  }
  centreCoordinates = result;
  console.log('From internal : ', result);

  loadMapScenario();
  insertIntoTable(result);
}

function findNearby() {
  const collectionCentreUrl = '/collectionCentres';

  fetch(collectionCentreUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    })
    .then((data) => {
      organizeResponseAndPushpin(data);
      console.log('From then', data);
    })
    .catch((error) => {
      console.error('Fetch error:', error);
    });
}
