// document.addEventListener('DOMContentLoaded', function() {
//     initMap(); // Initialize the map when the page loads
  
//     document.getElementById('form-input').addEventListener('submit', function(event) {
//       event.preventDefault(); // Prevents the default form submit action
//       var city = document.getElementById('city-input').value;
//       fetchWeatherData(city);
//     });
//   });
  

// function fetchWeatherData(city) {
//     fetch(`/weather?city=${city}`)
//       .then(response => response.json())
//       .then(data => {
        
//         document.getElementById('temp').textContent = `${data.temp} degrees Celsius`;
//         document.getElementById('description').textContent = data.description;
//         document.getElementById('weather-icon').src = data.icon;
       
//         updateMap(data.latitude, data.longitude);
//       })
//       .catch(error => console.error('Error fetching weather data:', error));
//   }
  
  
//   function initMap() {
//     var map = L.map('map').setView([0, 0], 2); // Initializes the map
  
 
//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: '© OpenStreetMap contributors'
//     }).addTo(map);
  
    
//     window.map = map;
//   }
  
  
//   function updateMap(latitude, longitude) {
//     window.map.setView(new L.LatLng(latitude, longitude), 13);
  
  
//     L.marker([latitude, longitude]).addTo(window.map);
//   }
  
  
//   document.addEventListener('DOMContentLoaded', initMap);

  
  