document.getElementById('load-forecast').addEventListener('click', function() {
    // Replace 'YourCityHere' with the way you want to obtain the city name
    fetch(`/forecast?city=YourCityHere`)
        .then(response => response.json())
        .then(data => {
            const forecastContainer = document.getElementById('forecast-container');
            forecastContainer.innerHTML = ''; // Clear previous content

            data.data.forEach(day => {
                // Create and append the forecast details to the container
                forecastContainer.innerHTML += `
                    <div class="forecast-day">
                        <h3>${new Date(day.datetime).toDateString()}</h3>
                        <p>Temperature: ${day.temp}°C</p>
                        <p>Wind Speed: ${day.wind_spd} m/s</p>
                        <!-- Add any other forecast data you need -->
                    </div>
                `;
            });
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
        });
});
