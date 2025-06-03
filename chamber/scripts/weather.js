// Weather API for Mapleton, UT
const API_KEY = '8c45e5c07930e7462edbd1376f62ffea';
const CITY = 'Mapleton,UT,US';

// Fetch and display current weather
async function getCurrentWeather() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=imperial`);
        const data = await response.json();
        
        document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°F`;
        document.getElementById('weather-description').textContent = data.weather[0].description;
    } catch (error) {
        document.getElementById('temperature').textContent = '--°F';
        document.getElementById('weather-description').textContent = 'Weather unavailable';
    }
}

// Fetch and display 3-day forecast
async function getForecast() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&appid=${API_KEY}&units=imperial`);
        const data = await response.json();
        
        // Get daily forecasts (find noon forecasts for accuracy)
        const dailyForecasts = getDailyForecasts(data.list);
        
        document.getElementById('day1-temp').textContent = `${dailyForecasts[0].temp}°F`;
        document.getElementById('day2-temp').textContent = `${dailyForecasts[1].temp}°F`;
        document.getElementById('day3-temp').textContent = `${dailyForecasts[2].temp}°F`;
    } catch (error) {
        document.getElementById('day1-temp').textContent = '--°F';
        document.getElementById('day2-temp').textContent = '--°F';
        document.getElementById('day3-temp').textContent = '--°F';
    }
}

// Extract daily forecasts from 3-hour interval data (find noon temps for accuracy)
function getDailyForecasts(forecastList) {
    const dailyData = [];
    const today = new Date();
    
    // Group forecasts by date
    const forecastsByDate = {};
    
    forecastList.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dateString = date.toDateString();
        
        if (!forecastsByDate[dateString]) {
            forecastsByDate[dateString] = [];
        }
        forecastsByDate[dateString].push(forecast);
    });
    
    // Get the next 3 days starting from today
    for (let i = 0; i < 3; i++) {
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + i);
        const targetDateString = targetDate.toDateString();
        
        if (forecastsByDate[targetDateString]) {
            // Find the forecast closest to noon (12:00) for most accurate daily temp
            const dayForecasts = forecastsByDate[targetDateString];
            let closestToNoon = dayForecasts[0];
            let minTimeDiff = Math.abs(12 - new Date(dayForecasts[0].dt * 1000).getHours());
            
            dayForecasts.forEach(forecast => {
                const hour = new Date(forecast.dt * 1000).getHours();
                const timeDiff = Math.abs(12 - hour);
                if (timeDiff < minTimeDiff) {
                    minTimeDiff = timeDiff;
                    closestToNoon = forecast;
                }
            });
            
            dailyData.push({
                temp: Math.round(closestToNoon.main.temp)
            });
        }
    }
    
    return dailyData;
}

// Update day names to show actual days of the week
function updateDayNames() {
    const today = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayNameElements = document.querySelectorAll('.day-name');
    
    if (dayNameElements.length >= 3) {
        for (let i = 0; i < 3; i++) {
            const targetDate = new Date(today);
            targetDate.setDate(today.getDate() + i);
            dayNameElements[i].textContent = dayNames[targetDate.getDay()];
        }
    }
}

// Initialize weather when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateDayNames();
    getCurrentWeather();
    getForecast();
});