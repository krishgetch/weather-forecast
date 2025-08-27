# Weather App

A modern, responsive weather application that fetches real-time weather data from the OpenWeatherMap API. Built with HTML, CSS, and JavaScript.

## Features

- 🌍 **Location-based Weather**: Get weather data for any city worldwide
- 📍 **Current Location**: Use your device's GPS to get local weather
- 🌤️ **Current Weather**: Display temperature, humidity, wind speed, and more
- 📅 **5-Day Forecast**: View weather predictions for the next 5 days
- 🎨 **Modern UI**: Beautiful, responsive design with smooth animations
- 💾 **Local Storage**: Remembers your last searched location
- 📱 **Mobile Responsive**: Works perfectly on all device sizes

## Weather Information Displayed

- Current temperature and "feels like" temperature
- Weather description and icon
- Humidity percentage
- Wind speed (km/h)
- Visibility (km)
- Atmospheric pressure (hPa)
- UV Index (when available)
- 5-day weather forecast

## Setup Instructions

### 1. Get an API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/)
2. Sign up for a free account
3. Go to your API keys section
4. Copy your API key

### 2. Configure the App

1. Open `script.js` in your code editor
2. Find the line: `this.apiKey = 'YOUR_API_KEY';`
3. Replace `'YOUR_API_KEY'` with your actual API key:
   ```javascript
   this.apiKey = 'your_actual_api_key_here';
   ```

### 3. Run the Application

1. Open `index.html` in your web browser
2. Or serve the files using a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   ```

## Usage

### Search by City
1. Enter a city name in the search box
2. Click the search button or press Enter
3. View the weather information

### Use Current Location
1. Click the location button (📍)
2. Allow location access when prompted
3. View weather for your current location

## File Structure

```
weather-app/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript functionality and API integration
└── README.md           # This file
```

## API Information

This app uses the OpenWeatherMap API:
- **Current Weather**: `https://api.openweathermap.org/data/2.5/weather`
- **5-Day Forecast**: `https://api.openweathermap.org/data/2.5/forecast`
- **Units**: Metric (Celsius, km/h, etc.)
- **Rate Limit**: 60 calls/minute for free tier

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Geolocation

The app uses the browser's Geolocation API to get your current location. Make sure to:
- Allow location access when prompted
- Use HTTPS for production (geolocation requires secure context)

## Demo Mode

If no API key is provided, the app will show a console message about demo mode. You can enable demo mode by uncommenting the demo class initialization in `script.js`.

## Customization

### Changing Units
To change from metric to imperial units:
1. In `script.js`, change `&units=metric` to `&units=imperial` in API calls
2. Update the display units in the HTML and CSS accordingly

### Styling
- Modify `styles.css` to change colors, fonts, and layout
- The app uses CSS Grid and Flexbox for responsive design
- Custom properties (CSS variables) can be added for easy theming

### Adding Features
- UV Index: Requires additional API call to OpenWeatherMap's UV endpoint
- Hourly forecast: Modify the forecast display logic
- Weather alerts: Add API calls for severe weather warnings

## Troubleshooting

### Common Issues

1. **"City not found" error**
   - Check the spelling of the city name
   - Try using the city name in English
   - Some cities may require country code (e.g., "London, UK")

2. **Location not working**
   - Ensure you've allowed location access
   - Check if your browser supports geolocation
   - Try refreshing the page

3. **API errors**
   - Verify your API key is correct
   - Check if you've exceeded the rate limit
   - Ensure you have an active OpenWeatherMap account

### Debug Mode

Open the browser's developer console (F12) to see:
- API request/response logs
- Error messages
- Demo mode notifications

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve the application.

## Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for providing the weather API
- [Font Awesome](https://fontawesome.com/) for the icons
- [Google Fonts](https://fonts.google.com/) for the Inter font family 