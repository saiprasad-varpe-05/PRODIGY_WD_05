const getWeatherBtn = document.getElementById('getWeatherBtn');
const locationInput = document.getElementById('locationInput');
const weatherInfo = document.getElementById('weatherInfo');
const locationName = document.getElementById('locationName');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weatherDescription');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const loader = document.getElementById('loader');

// OpenWeatherMap API key
const apiKey = 'e5e0cd792c26ba0afda0157d9c469f5d'; // Replace with your actual API key

// Display loader and hide weather info
function showLoader() {
  loader.style.display = 'block';
  weatherInfo.style.display = 'none';
}

// Hide loader and show weather info
function hideLoader() {
  loader.style.display = 'none';
  weatherInfo.style.display = 'block';
}

// Display weather data on the page
function displayWeatherData(data) {
  locationName.textContent = `${data.name}, ${data.sys.country}`;
  temperature.textContent = `Temperature: ${data.main.temp}°C`;
  weatherDescription.textContent = `Weather: ${data.weather[0].description}`;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
  hideLoader();
}

// Fetch weather data by city name
async function fetchWeatherData(city) {
  showLoader();
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    
    if (data.cod === "404" || data.cod === 404) {
      alert('City not found! Please try another city.');
      hideLoader();
      return;
    }
    displayWeatherData(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    alert('Error fetching weather data. Please try again.');
    hideLoader();
  }
}

// Fetch weather data using geolocation
async function fetchWeatherByLocation(latitude, longitude) {
  showLoader();
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    displayWeatherData(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    alert('Error fetching weather data. Please try again.');
    hideLoader();
  }
}

// Event listener for button click (manual city search)
getWeatherBtn.addEventListener('click', () => {
  const city = locationInput.value.trim();
  if (city) {
    fetchWeatherData(city);
  } else {
    alert('Please enter a city name!');
  }
});

// Attempt to fetch weather data based on user's geolocation on page load
window.onload = function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByLocation(latitude, longitude);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        // Allow the user to manually enter a city if geolocation fails
      }
    );
  } else {
    console.warn('Geolocation is not supported by this browser.');
  }
};
