# 🌤 Weather Forecast Application

A responsive weather forecast web application built with **HTML**, **Tailwind CSS**, and **JavaScript**.  
This app fetches real-time weather data using the [Open-Meteo API](https://open-meteo.com/) and [Nominatim Reverse Geocoding API](https://nominatim.org/), allowing users to view current weather, 5-day forecasts, and search by city or current location.

---

## 🚀 Features

✅ **Current Weather Display**  
- Shows temperature, wind speed, humidity, pressure, cloud cover, UV index, and precipitation.  
- Weather icons and background change dynamically based on conditions and time of day.  

✅ **5-Day Forecast**  
- Displays daily max/min temperature, precipitation, and UV index in easy-to-read cards.  

✅ **Search & Geolocation**  
- Search weather by city name.  
- Get weather for your **current location** using Geolocation API.  
- Auto-suggestions while typing city names (top 5 matches).  

✅ **Recently Searched Cities**  
- Stores last 6 searched cities using **localStorage**.  
- Dropdown menu allows quick selection to re-fetch weather.  

✅ **Temperature Unit Toggle**  
- Switch between °C and °F for today’s temperature and forecast.  

✅ **Extreme Temperature Alert**  
- Displays a custom alert banner if temperature exceeds 40°C.  

✅ **Error Handling**  
- Displays errors in a nice message box (not browser alerts).  
- Handles API/network errors and invalid city names gracefully.  

✅ **Responsive Design**  
- Optimized for **desktop**, **iPad Mini**, and **iPhone SE** screen sizes.

---

## 🛠️ Tech Stack

- **HTML5** – Structure  
- **Tailwind CSS** – Responsive styling  
- **JavaScript (Vanilla)** – Logic & DOM manipulation  
- **Open-Meteo API** – Weather data  
- **Nominatim API** – Reverse geocoding for current location  

---

## 📦 Setup Instructions

**Clone this repository**
   ```bash
   git clone https://github.com/Sweety-Mitra/Weather_Forecast_Application.git
   cd weather-forecast-app

---

## 🌐 Live Demo

🔗 [Try the Weather Forecast App](https://yourusername.github.io/weather-forecast-app/)

