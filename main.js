var locations = [
  {title: "6 Rue Jean-Jacques Rousseau, 75001 Paris, France", coordinates: {lat: 48.86219089999999, lng: 2.3400461}},
  {title: "150 rue Damrémont 75018 Paris, France", coordinates: {lat: 48.8961279, lng: 2.338318}},
  {title: "25 rue Boissy dAnglas 75008 Paris, France", coordinates: {lat: 48.8693263, lng: 2.3219794}},
  {title: "5 rue Saint-Bernard 75011 Paris, France", coordinates: {lat: 48.8693263, lng: 2.3519794}},
  {title: "31 Avenue La Motte Picquet 75007 Paris, France", coordinates: {lat: 48.8536439197085, lng: 2.305679919708498}}
];

function initMap() {
  function ViewModel() {
  	var self = this;
    self.filterValue = ko.observable('');
   	self.filteredItems = ko.computed(function(){
    	return locations.filter(function(location){
      	return location.title.includes(self.filterValue());
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

  var iconBase = "images/cannoli.png";
  var cityLocation = {lat: 48.863614, lng: 2.3522219};

  var map = new google.maps.Map(document.getElementById("map"),{
    center: cityLocation,
    zoom: 13,
    styles: styles
  });


  var largeInfoWindow = new google.maps.InfoWindow();

  // created a marker for every locations in the array
  locations.forEach(function(crtLocation, index){
    var newMarker = new google.maps.Marker({
      position: crtLocation.coordinates,
      map: map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      icon: iconBase,
      id: index,
      title: crtLocation.title
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
