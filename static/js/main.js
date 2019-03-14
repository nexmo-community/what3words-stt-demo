let locationArea = document.getElementById('location');
let center;
let map;

const loadMap = center => {
  map = L.map('map', {
    center: center,
    zoom: 13
  });

  L.tileLayer(
    'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken:
        'pk.eyJ1IjoibWFydHluZGF2aWVzIiwiYSI6ImNqdDdlZnF1YTBqZHI0NHBoYWx6eWtqeTEifQ.tEtT1xnxEpC82JOKw-qD5w'
    }
  ).addTo(map);
};

(function() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
      center = [position.coords.latitude, position.coords.longitude];
      loadMap(center);
    });
  } else {
    center = [51.505, -0.09];
    loadMap(center);
  }

  var socket = io();
  socket.on('newCoords', inboundCoords => {
    let { coords, w3wString } = inboundCoords;
    let coordsArray = [
      parseFloat(coords.split(',')[0]),
      parseFloat(coords.split(',')[1])
    ];
    console.log(coordsArray);
    locationArea.className = 'green';
    locationArea.innerHTML = w3wString;
    let marker = L.marker(coordsArray).addTo(map);
    map.flyTo(coordsArray);
  });
})();
