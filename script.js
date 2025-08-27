// Weather App JavaScript
class WeatherApp {
    constructor() {
        this.apiKey = '18a61e87d75343b73ca84bd7408dc404'; // Replace with your OpenWeatherMap API key
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkForStoredLocation();
    }

    bindEvents() {
        // Search functionality
        document.getElementById('searchBtn').addEventListener('click', () => {
            this.searchByCity();
        });

        document.getElementById('welcomeSearchBtn').addEventListener('click', () => {
            this.searchByCity();
        });

        // Location functionality
        document.getElementById('locationBtn').addEventListener('click', () => {
            this.getCurrentLocation();
        });

        document.getElementById('welcomeLocationBtn').addEventListener('click', () => {
            this.getCurrentLocation();
        });

        // Enter key support
        document.getElementById('locationInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchByCity();
        });

        document.getElementById('welcomeLocationInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchByCity();
        });
    }

    async searchByCity() {
        const input = document.getElementById('locationInput').value || document.getElementById('welcomeLocationInput').value;
        if (!input.trim()) {
            this.showError('Please enter a city name');
            return;
        }

        this.showLoading();
        try {
            const weatherData = await this.fetchWeatherData(input);
            const forecastData = await this.fetchForecastData(input);
            this.displayWeather(weatherData, forecastData);
            this.hideWelcome();
        } catch (error) {
            this.showError('City not found. Please check the spelling and try again.');
        }
    }

    async getCurrentLocation() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by your browser');
            return;
        }

        this.showLoading();
        
        try {
            const position = await this.getCurrentPosition();
            const { latitude, longitude } = position.coords;
            
            const weatherData = await this.fetchWeatherDataByCoords(latitude, longitude);
            const forecastData = await this.fetchForecastDataByCoords(latitude, longitude);
            
            this.displayWeather(weatherData, forecastData);
            this.hideWelcome();
        } catch (error) {
            this.showError('Unable to get your location. Please check your location permissions.');
        }
    }

    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            });
        });
    }

    async fetchWeatherData(city) {
        const response = await fetch(
            `${this.baseUrl}/weather?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`
        );
        
        if (!response.ok) {
            throw new Error('City not found');
        }
        
        return await response.json();
    }

    async fetchWeatherDataByCoords(lat, lon) {
        const response = await fetch(
            `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
        );
        
        if (!response.ok) {
            throw new Error('Weather data not available');
        }
        
        return await response.json();
    }

    async fetchForecastData(city) {
        const response = await fetch(
            `${this.baseUrl}/forecast?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`
        );
        
        if (!response.ok) {
            throw new Error('Forecast data not available');
        }
        
        return await response.json();
    }

    async fetchForecastDataByCoords(lat, lon) {
        const response = await fetch(
            `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
        );
        
        if (!response.ok) {
            throw new Error('Forecast data not available');
        }
        
        return await response.json();
    }

    displayWeather(weatherData, forecastData) {
        this.hideLoading();
        this.hideError();
        this.showWeatherCard();

        // Update current weather
        this.updateCurrentWeather(weatherData);
        
        // Update forecast
        this.updateForecast(forecastData);
        
        // Store location for future use
        this.storeLocation(weatherData.name, weatherData.sys.country);
    }

    updateCurrentWeather(data) {
        // Location info
        document.getElementById('cityName').textContent = data.name;
        document.getElementById('countryName').textContent = data.sys.country;
        document.getElementById('dateTime').textContent = this.formatDateTime(new Date());

        // Weather icon
        const iconCode = data.weather[0].icon;
        document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        // Temperature and description
        document.getElementById('temperature').textContent = Math.round(data.main.temp);
        document.getElementById('weatherDescription').textContent = data.weather[0].description;

        // Weather details
        document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°C`;
        document.getElementById('humidity').textContent = `${data.main.humidity}%`;
        document.getElementById('windSpeed').textContent = `${Math.round(data.wind.speed * 3.6)} km/h`; // Convert m/s to km/h
        document.getElementById('visibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;
        document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
        
        // UV Index (not available in current weather API, showing placeholder)
        document.getElementById('uvIndex').textContent = 'N/A';
    }

    updateForecast(forecastData) {
        const forecastContainer = document.getElementById('forecast');
        forecastContainer.innerHTML = '';

        // Group forecast by day and get daily forecast
        const dailyForecasts = this.getDailyForecasts(forecastData.list);

        dailyForecasts.forEach(forecast => {
            const forecastItem = this.createForecastItem(forecast);
            forecastContainer.appendChild(forecastItem);
        });
    }

    getDailyForecasts(forecastList) {
        const dailyForecasts = [];
        const seenDays = new Set();

        forecastList.forEach(forecast => {
            const date = new Date(forecast.dt * 1000);
            const day = date.toDateString();

            if (!seenDays.has(day) && dailyForecasts.length < 5) {
                seenDays.add(day);
                dailyForecasts.push({
                    date: date,
                    temp: forecast.main.temp,
                    description: forecast.weather[0].description,
                    icon: forecast.weather[0].icon
                });
            }
        });

        return dailyForecasts;
    }

    createForecastItem(forecast) {
        const item = document.createElement('div');
        item.className = 'forecast-item';
        
        item.innerHTML = `
            <div class="forecast-date">${this.formatDate(forecast.date)}</div>
            <div class="forecast-icon">
                <img src="https://openweathermap.org/img/wn/${forecast.icon}@2x.png" alt="Weather icon">
            </div>
            <div class="forecast-temp">${Math.round(forecast.temp)}°C</div>
            <div class="forecast-desc">${forecast.description}</div>
        `;

        return item;
    }

    formatDateTime(date) {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatDate(date) {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    }

    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
        document.getElementById('weatherCard').classList.add('hidden');
        document.getElementById('error').classList.add('hidden');
        document.getElementById('welcome').classList.add('hidden');
    }

    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
    }

    showError(message) {
        this.hideLoading();
        document.getElementById('errorMessage').textContent = message;
        document.getElementById('error').classList.remove('hidden');
        document.getElementById('weatherCard').classList.add('hidden');
        document.getElementById('welcome').classList.add('hidden');
    }

    hideError() {
        document.getElementById('error').classList.add('hidden');
    }

    showWeatherCard() {
        document.getElementById('weatherCard').classList.remove('hidden');
    }

    hideWelcome() {
        document.getElementById('welcome').classList.add('hidden');
    }

    storeLocation(city, country) {
        localStorage.setItem('lastLocation', JSON.stringify({ city, country }));
    }

    checkForStoredLocation() {
        const stored = localStorage.getItem('lastLocation');
        if (stored) {
            const { city } = JSON.parse(stored);
            document.getElementById('locationInput').value = city;
        }
    }
}

// Demo mode with mock data (when no API key is provided)
class WeatherAppDemo extends WeatherApp {
    constructor() {
        super();
        this.demoMode = true;
    }

    async fetchWeatherData(city) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Return mock data
        return {
            name: city,
            sys: { country: 'Demo' },
            weather: [{ 
                description: 'Partly cloudy', 
                icon: '02d' 
            }],
            main: {
                temp: 22,
                feels_like: 24,
                humidity: 65,
                pressure: 1013
            },
            wind: { speed: 5.5 },
            visibility: 10000
        };
    }

    async fetchForecastData(city) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockForecasts = [];
        const icons = ['01d', '02d', '03d', '04d', '10d'];
        const descriptions = ['Sunny', 'Partly cloudy', 'Cloudy', 'Light rain', 'Clear'];
        
        for (let i = 0; i < 40; i++) {
            mockForecasts.push({
                dt: Date.now() / 1000 + (i * 3 * 3600),
                main: { temp: 20 + Math.random() * 10 },
                weather: [{
                    description: descriptions[Math.floor(Math.random() * descriptions.length)],
                    icon: icons[Math.floor(Math.random() * icons.length)]
                }]
            });
        }
        
        return { list: mockForecasts };
    }

    async fetchWeatherDataByCoords(lat, lon) {
        return this.fetchWeatherData('Current Location');
    }

    async fetchForecastDataByCoords(lat, lon) {
        return this.fetchForecastData('Current Location');
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // For demo purposes, always use demo mode
    // To use real weather data, replace 'YOUR_API_KEY' with your actual API key in the WeatherApp class
    console.log('Running in demo mode. To use real weather data, please get an API key from OpenWeatherMap and update the apiKey variable in script.js');
    const app = new WeatherAppDemo();
}); 