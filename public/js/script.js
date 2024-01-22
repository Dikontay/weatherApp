// This function should be called when the user submits the form with the city name
function fetchWeatherData(city) {
    fetch(`/weather?city=${city}`)
      .then(response => response.json())
      .then(data => {
        // Assuming you have elements with these IDs to display the weather data
        document.getElementById('temp').textContent = `${data.temp} degrees Celsius`;
        document.getElementById('description').textContent = data.description;
        document.getElementById('weather-icon').src = data.icon;
  
        // Now update the map
        updateMap(data.latitude, data.longitude);
      })
      .catch(error => console.error('Error fetching weather data:', error));
  }
  
  // Initialize map function
  function initMap() {
    var map = L.map('map').setView([0, 0], 2); // Initializes the map
  
    // Set up the OSM layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
  
    // Save the map in the global scope so we can access it later
    window.map = map;
  }
  
  // Update map function
  function updateMap(latitude, longitude) {
    window.map.setView(new L.LatLng(latitude, longitude), 13);
  
    // If you want to add a marker at the location
    L.marker([latitude, longitude]).addTo(window.map);
  }
  
  // Call the initMap function when the page loads
  document.addEventListener('DOMContentLoaded', initMap);
  