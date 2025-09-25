/* ======= CONFIG ======= */
// Maximum number of recent searches to store
const maxRecent = 6;

/* ======= DOM REFS ======= */
// Cache all frequently used DOM elements for performance
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const suggestionsBox = document.getElementById('suggestionsBox');
const geoBtn = document.getElementById('geoBtn');
const recentDropdown = document.getElementById('recentDropdown');
const unitToggle = document.getElementById('unitToggle');

const errorBox = document.getElementById('errorBox');
const tempAlert = document.getElementById('tempAlert');

const cityNameEl = document.getElementById('cityName');
const dateTextEl = document.getElementById('dateText');
const currentIcon = document.getElementById('currentIcon');
const todayTempEl = document.getElementById('todayTemp');
const tempUnitEl = document.getElementById('tempUnit');
const descriptionEl = document.getElementById('description');
const windEl = document.getElementById('wind');
const forecastEl = document.getElementById('forecast');

// Adding Background
// Updates the page background depending on weather condition + time of day
const updateBackground = (weatherCode, currentTime) => {
  const hour = new Date(currentTime).getHours();
  const isDay = hour >= 6 && hour < 18; // 6 AM - 6 PM considered day

  let bgClass = '';

  if ([0,1,2].includes(weatherCode)) bgClass = 'clear';
  else if (weatherCode === 3) bgClass = 'cloudy';
  else if ([45,48].includes(weatherCode)) bgClass = 'fog';
  else if ([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(weatherCode)) bgClass = 'rain';
  else if ([71,73,75,77,85,86].includes(weatherCode)) bgClass = 'snow';
  else if ([95,96,99].includes(weatherCode)) bgClass = 'thunder';
  else bgClass = 'clear';

  if ([56,57,66,67].includes(weatherCode)) bgClass = 'hail';

  const finalClass = `${isDay ? 'bg-day' : 'bg-night'}-${bgClass}`;

  document.body.classList.remove(
    'bg-day-clear','bg-day-cloudy','bg-day-rain','bg-day-snow','bg-day-thunder','bg-day-fog','bg-day-hail',
    'bg-night-clear','bg-night-cloudy','bg-night-rain','bg-night-snow','bg-night-thunder','bg-night-fog','bg-night-hail'
  );

  document.body.classList.add(finalClass);
};
