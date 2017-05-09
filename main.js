var markers = [];


function initMap() {


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

  var locations = [
    {title: "6 Rue Jean-Jacques Rousseau, 75001 Paris, France", location: {lat: "48.86219089999999", lng: "2.3400461"}},
    {title: "150 rue Damrémont 75018 Paris, France", location: {lat: "48.8961279", lng: "2.338318"}},
    {title: "25 rue Boissy dAnglas 75008 Paris, France", location: {lat: "48.8693263", lng: "2.3219794"}},
    {title: "5 rue Saint-Bernard 75011 Paris, France", location: {lat: "48.8693263", lng: "2.3519794"}},
    {title: "31 Avenue La Motte Picquet 75007 Paris, France", location: {lat: "48.8536439197085", lng: "2.305679919708498"}}
  ];

  for(var i = 0; i < locations.length; i++) {

    var position = locations[i].location;
    position.lat = parseFloat(position.lat);
    position.lng = parseFloat(position.lng);
    var title = locations[i].title;
    var marker = new google.maps.Marker({
      position: position,
      map: map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      icon: iconBase,
      id: i
    });

   markers.push(marker);
   marker.addListener("click", (function(target){
      return function() {
        deselectMarkers();
        toggleMarker(target);
      }
   })(marker));
  }
  function deselectMarkers(){
    markers.forEach(function(crtElement){
      crtElement.setAnimation(null);
    });
  }

  function toggleMarker(target) {
    if (target.getAnimation() !== null) {
      target.setAnimation(null);
    } else {
      target.setAnimation(google.maps.Animation.BOUNCE);
    }
  }

}
