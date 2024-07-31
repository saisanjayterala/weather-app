const apiKey = 'e4d9851448dfb9935dff83bf34def32d';
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const cityName = document.getElementById('city-name');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const feelsLike = document.getElementById('feels-like');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');
const forecastItems = document.getElementById('forecast-items');
const unitToggle = document.getElementById('unit-toggle');
const themeToggle = document.getElementById('theme-toggle');
const loadingOverlay = document.getElementById('loading-overlay');

let units = 'metric';
let isDarkTheme = false;

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    const lastSearchedCity = localStorage.getItem('lastSearchedCity') || 'Hyderabad';
    cityInput.value = lastSearchedCity;
    getWeatherData(lastSearchedCity);

    searchForm.addEventListener('submit', handleSearch);
    unitToggle.addEventListener('click', handleUnitToggle);
    themeToggle.addEventListener('click', handleThemeToggle);
});

function handleSearch(e) {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
        localStorage.setItem('lastSearchedCity', city);
    }
}

function handleUnitToggle() {
    units = units === 'metric' ? 'imperial' : 'metric';
    const city = cityName.textContent.split(',')[0];
    if (city) {
        getWeatherData(city);
    }
}

function handleThemeToggle() {
    isDarkTheme = !isDarkTheme;
    document.body.classList.toggle('dark-theme');
}

function getWeatherData(city) {
    showLoading();
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}`;

    Promise.all([
        fetch(weatherUrl).then(response => response.json()),
        fetch(forecastUrl).then(response => response.json())
    ])
    .then(([weatherData, forecastData]) => {
        displayCurrentWeather(weatherData);
        displayForecast(forecastData);
        hideLoading();
    })
    .catch(error => {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again.');
        hideLoading();
    });
}

function displayCurrentWeather(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">`;
    temperature.textContent = `${Math.round(data.main.temp)}°${units === 'metric' ? 'C' : 'F'}`;
    feelsLike.textContent = `Feels like: ${Math.round(data.main.feels_like)}°${units === 'metric' ? 'C' : 'F'}`;
    description.textContent = data.weather[0].description;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} ${units === 'metric' ? 'm/s' : 'mph'}`;
    pressure.textContent = `${data.main.pressure} hPa`;
    visibility.textContent = `${data.visibility / 1000} km`;
}

function displayForecast(data) {
    forecastItems.innerHTML = '';
    const dailyData = data.list.filter(item => item.dt_txt.includes('12:00:00'));
    dailyData.forEach(day => {
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
            <p>${new Date(day.dt * 1000).toLocaleDateString('en-US', {weekday: 'short'})}</p>
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
            <p>${Math.round(day.main.temp)}°${units === 'metric' ? 'C' : 'F'}</p>
            <p>${day.weather[0].description}</p>
        `;
        forecastItems.appendChild(forecastItem);
    });
}

function showLoading() {
    loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    loadingOverlay.style.display = 'none';
}