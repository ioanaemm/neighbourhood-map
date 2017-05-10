var locations = [];
var cityLocation = {lat: 48.863614, lng: 2.3522219};

function initMap() {
  var apiURL = 'https://api.foursquare.com/v2/venues/search?';
  var foursquareClientID = 'AJYVUNBHD2LB34H1RNVEIX3NXIHML2Z3KL2IMEUM2IIBCWDY';
  var foursquareSecret ='TMKNJ543FFAYKJTAQZZLJWIJXATL4A0K1GNWTVAEMK4UKCKZ';
  var foursquareVersion = '20170112';
  var venueFoursquareID = '4b4aac62f964a520a98c26e3';
  var foursquareURL = apiURL + 'client_id=' + foursquareClientID +  '&client_secret=' + foursquareSecret +'&v=' + foursquareVersion;
  foursquareURL += "&ll="+cityLocation.lat + "%2C%20" + cityLocation.lng;
  foursquareURL += '&query=coffee';
  //foursquareURL += '&intent=checkin';

  $.ajax({
    url: foursquareURL,
    success: function(data) {
      locations = data.response.venues;
      console.log(locations);
      initApp();
    }
  });

  function initApp() {
    function ViewModel() {
    	var self = this;
      self.filterValue = ko.observable('');
     	self.filteredItems = ko.computed(function(){
      	return locations.filter(function(location){
        	return location.name.toLowerCase().includes(self.filterValue().toLowerCase());
        });
      });
      self.selectItem = function(selectedElement) {
      	(onMarkerClick(selectedElement.marker))();
      }
    }
    ko.applyBindings(new ViewModel());

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

    var iconBase = "images/cup.png";

    var map = new google.maps.Map(document.getElementById("map"),{
      center: cityLocation,
      zoom: 13,
      styles: styles
    });


    var largeInfoWindow = new google.maps.InfoWindow();

    // created a marker for every locations in the array
    locations.forEach(function(crtLocation, index){
      var newMarker = new google.maps.Marker({
        position: crtLocation.location,
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        icon: iconBase,
        id: index,
        title: crtLocation.name
      });

      crtLocation.marker = newMarker;
      //added a click event listener for every marker selected
      newMarker.addListener("click", (onMarkerClick(newMarker)));
    });

    function onMarkerClick(target) {
       return function() {
         deselectMarkers();
         toggleMarker(target);
         showInfoWindow(target);
       }
    }
    function deselectMarkers(){
      locations.forEach(function(crtLocation){
          crtLocation.marker.setAnimation(null);
      });
    }

    function toggleMarker(target) {
      if (target.getAnimation() !== null) {
        target.setAnimation(null);
      } else {
        target.setAnimation(google.maps.Animation.BOUNCE);
      }
    }

    function showInfoWindow(marker) {
      if(largeInfoWindow.marker !== null) {
        largeInfoWindow.marker = marker;
        largeInfoWindow.setContent('<div>' + marker.title +'</div>');
        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;
        function getStreetView(data, status) {
          if (status == google.maps.StreetViewStatus.OK) {
            var nearStreetViewLocation = data.location.latLng;
            var heading = google.maps.geometry.spherical.computeHeading(
              nearStreetViewLocation, marker.position);
              largeInfoWindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
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
            largeInfoWindow.setContent('<div>' + marker.title + '</div>' +
              '<div>No Street View Found</div>');
          }
        }
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        largeInfoWindow.open(map, marker);
      }
    }
  }
}
