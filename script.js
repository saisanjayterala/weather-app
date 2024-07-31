const apiKey = 'API_KEY_HERE';
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

searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        showLoading();
        getWeatherData(city);
        getForecastData(city);
    }
});

unitToggle.addEventListener('click', function() {
    units = units === 'metric' ? 'imperial' : 'metric';
    const city = cityName.textContent;
    if (city) {
        showLoading();
        getWeatherData(city);
        getForecastData(city);
    }
});

themeToggle.addEventListener('click', function() {
    isDarkTheme = !isDarkTheme;
    document.body.classList.toggle('dark-theme');
});

function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayWeatherData(data);
            hideLoading();
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Error fetching weather data. Please try again.');
            hideLoading();
        });
}

function getForecastData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayForecastData(data);
            hideLoading();
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
            alert('Error fetching forecast data. Please try again.');
            hideLoading();
        });
}

function displayWeatherData(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    weatherIcon.innerHTML = `<i class="fas fa-${getWeatherIcon(data.weather[0].icon)}"></i>`;
    temperature.textContent = `${Math.round(data.main.temp)}°${units === 'metric' ? 'C' : 'F'}`;
    feelsLike.textContent = `Feels like: ${Math.round(data.main.feels_like)}°${units === 'metric' ? 'C' : 'F'}`;
    description.textContent = data.weather[0].description;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} ${units === 'metric' ? 'm/s' : 'mph'}`;
    pressure.textContent = `${data.main.pressure} hPa`;
    visibility.textContent = `${data.visibility / 1000} km`;
}

function displayForecastData(data) {
    forecastItems.innerHTML = '';
    for (let i = 0; i < data.list.length; i += 8) {
        const forecastItem = data.list[i];
        const date = new Date(forecastItem.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const forecastItemElement = document.createElement('div');
        forecastItemElement.classList.add('forecast-item');
        forecastItemElement.innerHTML = `
            <p>${dayName}</p>
            <i class="fas fa-${getWeatherIcon(forecastItem.weather[0].icon)}"></i>
            <p>${Math.round(forecastItem.main.temp)}°${units === 'metric' ? 'C' : 'F'}</p>
            <p>${forecastItem.weather[0].description}</p>
        `;
        forecastItems.appendChild(forecastItemElement);
    }
}

function getWeatherIcon(iconCode) {
    const iconMap = {
        '01d': 'sun',
        '01n': 'moon',
        '02d': 'cloud-sun',
        '02n': 'cloud-moon',
        '03d': 'cloud',
        '03n': 'cloud',
        '04d': 'cloud',
        '04n': 'cloud',
        '09d': 'cloud-showers-heavy',
        '09n': 'cloud-showers-heavy',
        '10d': 'cloud-sun-rain',
        '10n': 'cloud-moon-rain',
        '11d': 'bolt',
        '11n': 'bolt',
        '13d': 'snowflake',
        '13n': 'snowflake',
        '50d': 'smog',
        '50n': 'smog'
    };
    return iconMap[iconCode] || 'question';
}

function showLoading() {
    loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    loadingOverlay.style.display = 'none';
}

// Initialize with a default city
getWeatherData('Hyderabad');
getForecastData('Hyderabad');