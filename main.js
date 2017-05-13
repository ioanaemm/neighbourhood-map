var locations = [];
var cityLocation = {lat: 48.863614, lng: 2.3522219};

function googleMapsErrorHandler() {
  alert('Sorry, there was an error with Google Maps.');
}

function initMap() {

  // stored all the components needed in variables for the Foursquare's API ajax call
  var apiURL = 'https://api.foursquare.com/v2/venues/search?';
  var foursquareClientID = 'AJYVUNBHD2LB34H1RNVEIX3NXIHML2Z3KL2IMEUM2IIBCWDY';
  var foursquareSecret ='TMKNJ543FFAYKJTAQZZLJWIJXATL4A0K1GNWTVAEMK4UKCKZ';
  var foursquareVersion = '20170112';
  var venueFoursquareID = '4b4aac62f964a520a98c26e3';
  var foursquareURL = apiURL + 'client_id=' + foursquareClientID +  '&client_secret=' + foursquareSecret +'&v=' + foursquareVersion;
  foursquareURL += "&ll="+cityLocation.lat + "%2C%20" + cityLocation.lng;
  foursquareURL += '&query=coffee';


  $.ajax({
    url: foursquareURL,
    success: function(data) {
      locations = data.response.venues;
      initApp();
    },
    error: function() {
      alert('Sorry, there was an error with Foursquare\'s API.');
    }
  });

  function initApp() {
    function ViewModel() {
    	var self = this;
      self.filterValue = ko.observable('');

      self.menuIsShowing = ko.observable(true);
      self.toggleMenu = function() {
        console.log('toggleMenu()');
        if(self.menuIsShowing()) {
          self.menuIsShowing(false);
        } else {
          self.menuIsShowing(true);
        }
      };
      self.currentIcon = ko.computed(function(){
        if(self.menuIsShowing()) {
          return "&#x2716;";
        } else {
          return "&#9776;";
        }
      });

      // this part creates the filter functionality for the app
     	self.filteredItems = ko.computed(function(){
      	return locations.filter(function(location){
          // in order to show the marker for the filtered item i had to store the result of the individual filter in a variable
          var filteredResult = location.name.toLowerCase().includes(self.filterValue().toLowerCase());
          // if there's a marker for the current location
          //set the marker visible on the map for the filtered item
        	if(location.marker) {
            location.marker.setVisible(filteredResult);
          }
          return filteredResult;
        });
      });

      self.resultCount = ko.computed(function(){
        if(self.filteredItems().length > 0 ) {
          return self.filteredItems().length + " results found.";
        } else {
          return "No results found.";
        }
      });

      // after clicking on an item from the list, the marker will show
      self.selectItem = function(crtLocation) {
        self.menuIsShowing(false);
      	(onMarkerClick(crtLocation))();
      };

    }
    ko.applyBindings(new ViewModel());

    // this is the array for styling the map
    var styles = [
      {
        featureType: "water",
        stylers: [
          { color: "#ffffff" }
        ]
      },
      {
        featureType: "administrative",
        elementType: "labels.text",
        stylers: [
          { color: "#ffffff" },
          { weight: 6 }
        ]
      },
      {
        featureType: "administrative",
        elementType: "labels.text.fill",
        stylers: [
          { color: "#aaaaaa" }
        ]
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [
          { color: "#ffffff" }
        ]
      },
      {
        featureType: "transit.station",
        stylers: [
          { weight: 9 },
          { hue: "#e85113" }
        ]
      },
      {
        featureType: "road.highway",
        elementType: "labels.icon",
        stylers: [
          { visibility: "off" }
        ]
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [
          { lightness: 100 }
        ]
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [
          { lightness: -100 }
        ]
      },
      {
        featureType: "poi",
        elementType: "geometry",
        stylers: [
          { visibility: "on" },
          { color: "#f0e4d3" }
        ]
      },
      {
        featureType: "road.highway",
        elementType: "geometry.fill",
        stylers: [
          {color: "#ffffff"},
          { lightness: -25 }
        ]
      },
      {
        featureType: "road.arterial",
        elementType: "geometry.fill",
        stylers: [
          {color: "#dddddd"}
        ]
      },
      {
        featureType: "road.local",
        elementType: "geometry.fill",
        stylers: [
          {color: "#FFF5CB"}
        ]
      },
      {
        featureType: "landscape.man_made",
        stylers: [
          {color: "#ddddd"}
        ]
      }

    ];


    var defaultIcon = "images/cup.png";

    // created an instance of the Map class
    var map = new google.maps.Map(document.getElementById("map"),{
      center: cityLocation,
      zoom: 15,
      styles: styles
    });

    // created an instance for the InfoWindow class
    var largeInfoWindow = new google.maps.InfoWindow();

    // this part of code goes through all the locations array in order to create a marker for every location
    locations.forEach(function(crtLocation, index){
      //created an instance for the Marker class
      var newMarker = new google.maps.Marker({
        position: crtLocation.location,
        map: map,
        draggable: false,
        animation: google.maps.Animation.DROP,
        icon: defaultIcon,
        id: index,
        title: crtLocation.name
      });

      //
      crtLocation.marker = newMarker;
      //added a click event listener for every marker selected
      newMarker.addListener("click", (onMarkerClick(crtLocation)));

    });

    // every time the user clicks on a marker, it starts to bounce and an info window appears
    function onMarkerClick(target) {
       return function() {
        deselectMarkers();
        map.setZoom(15);
        map.setCenter(target.marker.getPosition());
        toggleMarker(target);
        showInfoWindow(target);
       };
    }

    // iterate over the locations array in order to stop the animation for the markers
    function deselectMarkers(){
      locations.forEach(function(crtLocation){
          crtLocation.marker.setAnimation(null);
      });
    }

    // if there is an animation we set it to null
    //otherwise we make the marker to bounce
    function toggleMarker(target) {
      if (target.marker.getAnimation() !== null) {
        target.marker.setAnimation(null);
      } else {
        target.marker.setAnimation(google.maps.Animation.BOUNCE);
      }
    }

    // after clicking on a marker a info window appears
    // which contains a tittle
    function showInfoWindow(crtLocation) {
      var venueInfo = "<p>Number of people who have ever checked-in here: " + crtLocation.stats.checkinsCount + "</p>";
      venueInfo += "<p>"+ crtLocation.hereNow.summary +" right now. </p>";
      function getStreetView(data, status) {
        // check to see if the result's status from StreetViewService is ok
        // if it is, then store the position of the streetview image in a variable
        // for creating a panorama we need to create the heading
        // as in compute the position of the marker with the streetview's image
        if (status == google.maps.StreetViewStatus.OK) {
          var nearStreetViewLocation = data.location.latLng;
          var heading = google.maps.geometry.spherical.computeHeading(
            nearStreetViewLocation, crtLocation.marker.position);
            largeInfoWindow.setContent('<div>' + crtLocation.marker.title + '</div><div id="pano"></div>' + venueInfo);
            // set the options for the panorama
            var panoramaOptions = {
              position: nearStreetViewLocation,
              pov: {
                heading: heading,
                pitch: 30
              }
            };
          var panorama = new google.maps.StreetViewPanorama(
            document.getElementById('pano'), panoramaOptions);
        } else {
          largeInfoWindow.setContent('<div>' + crtLocation.marker.title + '</div>' +
            '<div>No Street View Found</div>' + venueInfo);
        }
      }

      if(largeInfoWindow.marker !== null) {
        largeInfoWindow.marker = crtLocation.marker;
        largeInfoWindow.setContent('<div>' + crtLocation.marker.title +'</div>');

        //created an instance of the StreetViewService class in order to show a picture of the location
        // this piece of code is the same as the one from Udacity course
        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;
        streetViewService.getPanoramaByLocation(crtLocation.marker.position, radius, getStreetView);
        largeInfoWindow.open(map, crtLocation.marker);
      }

    }
  }
}
