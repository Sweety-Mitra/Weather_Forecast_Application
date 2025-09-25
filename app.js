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

/* ======= STATE ======= */
let currentUnit = 'C';
let lastCoords = null;
let lastCity = null;

/* ======= HELPERS ======= */
const showError = msg => {
  errorBox.textContent = msg;
  errorBox.classList.remove('hidden');
  setTimeout(clearError, 5000);
};
const clearError = () => {
  errorBox.textContent = '';
  errorBox.classList.add('hidden');
};
const showTempAlert = msg => {
  tempAlert.textContent = msg;
  tempAlert.classList.remove('hidden');
};
const hideTempAlert = () => {
  tempAlert.textContent = '';
  tempAlert.classList.add('hidden');
};

/* ======= LOADER CONTROL ======= */
const loaderOverlay = document.getElementById('loaderOverlay');

const showLoader = () => loaderOverlay.classList.remove('hidden');
const hideLoader = () => loaderOverlay.classList.add('hidden');

const formatTemp = temp =>
  currentUnit === 'C' ? Math.round(temp) : Math.round((temp * 9) / 5 + 32);

function findNearestHourIndex(hourlyTimes, currentTime) {
  const cur = new Date(currentTime).getTime();
  let nearestIdx = 0;
  let minDiff = Infinity;
  hourlyTimes.forEach((t, i) => {
    const diff = Math.abs(new Date(t).getTime() - cur);
    if (diff < minDiff) {
      minDiff = diff;
      nearestIdx = i;
    }
  });
  return nearestIdx;
}

/* ======= LOCAL STORAGE ======= */
const saveRecent = city => {
  if (!city) return;
  const key = 'recentCities_v1';
  let arr = JSON.parse(localStorage.getItem(key) || '[]');
  arr = arr.filter(c => c.toLowerCase() !== city.toLowerCase());
  arr.unshift(city);
  if (arr.length > maxRecent) arr = arr.slice(0, maxRecent);
  localStorage.setItem(key, JSON.stringify(arr));
  renderRecent();
};

const renderRecent = () => {
  const key = 'recentCities_v1';
  const arr = JSON.parse(localStorage.getItem(key) || '[]');
  if (!Array.isArray(arr) || arr.length === 0) {
    recentDropdown.classList.add('hidden');
    return;
  }
  recentDropdown.innerHTML = '';

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Recent searches';
  recentDropdown.appendChild(placeholder);

  arr.forEach(city => {
    const opt = document.createElement('option');
    opt.value = city;
    opt.textContent = city;
    recentDropdown.appendChild(opt);
  });
  recentDropdown.classList.remove('hidden');
};

/* ======= MAPPERS ======= */
const mapWeatherCode = code => {
  const codes = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Rime fog',
    51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
    56: 'Light freezing drizzle', 57: 'Dense freezing drizzle',
    61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
    66: 'Light freezing rain', 67: 'Heavy freezing rain',
    71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
    85: 'Slight snow showers', 86: 'Heavy snow showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail'
  };
  return codes[code] || 'Overcast';
};

const pickIcon = code => {
  if (code === 0) return 'images/icons/clear.png';
  if (code === 1 || code === 2) return 'images/icons/partly-cloudy.png';
  if (code === 3) return 'images/icons/cloudy.png';
  if (code === 45 || code === 48) return 'images/icons/fog.png';
  if ([51,53,55,56,57].includes(code)) return 'images/icons/drizzle.png';
  if ([61,63,65,66,67,80,81,82].includes(code)) return 'images/icons/rain.png';
  if ([71,73,75,77,85,86].includes(code)) return 'images/icons/snow.png';
  if ([95,96,99].includes(code)) return 'images/icons/thunder.png';
  return 'images/icons/cloudy.png';
};

/* ======= API CALLS ======= */
const fetchCoordsByCity = async city => {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
  );
  const data = await res.json();
  if (!data.results || data.results.length === 0)
    throw new Error('City not found');
  return data.results[0];
};

const fetchCoordsSuggestions = async query => {
  if (!query.trim()) return [];
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5`
  );
  const data = await res.json();
  return data.results || [];
};

const fetchWeatherByCoords = async (lat, lon) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m,pressure_msl,cloudcover,uv_index,precipitation&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum,uv_index_max&timezone=auto`;
  const res = await fetch(url);
  return res.json();
};

/* ======= RENDERING ======= */
const renderCurrent = (data, location) => {
  const current = data.current_weather;
  if (!current) return;

  cityNameEl.textContent = `${location.name || "Unknown"}${location.country ? ', ' + location.country : ''}`;
  dateTextEl.textContent = new Date(current.time).toLocaleString();

  const tempC = current.temperature;
  todayTempEl.textContent = formatTemp(tempC);
  tempUnitEl.textContent = currentUnit === 'C' ? '°C' : '°F';

  descriptionEl.textContent = mapWeatherCode(current.weathercode);
  windEl.textContent = current.windspeed + ' km/h';
  currentIcon.src = pickIcon(current.weathercode);
  currentIcon.alt = descriptionEl.textContent;

  if (data.hourly && data.hourly.time) {
    const idx = findNearestHourIndex(data.hourly.time, current.time);
    document.getElementById('humidity').textContent = data.hourly.relativehumidity_2m[idx] + '%';
    document.getElementById('pressure').textContent = data.hourly.pressure_msl[idx] + ' hPa';
    document.getElementById('clouds').textContent = data.hourly.cloudcover[idx] + '%';
    document.getElementById('uv').textContent = data.hourly.uv_index[idx];
    document.getElementById('precip').textContent = data.hourly.precipitation[idx] + ' mm';
  }

  updateBackground(current.weathercode, current.time);

  tempC > 40
    ? showTempAlert(`Extreme temperature alert: ${Math.round(tempC)}°C — stay hydrated!`)
    : hideTempAlert();
};

const renderForecast = data => {
  forecastEl.innerHTML = '';
  if (!data.daily || !data.daily.time) {
    forecastEl.innerHTML = '<div class="p-4 text-gray-600">No forecast available.</div>';
    return;
  }

  const days = data.daily.time;
  for (let i = 1; i <= 5 && i < days.length; i++) {
    const card = document.createElement('div');
    card.className = 'p-3 card text-center';
    card.innerHTML = `
      <div class="font-semibold">${new Date(days[i]).toLocaleDateString(undefined, { weekday: 'short' })}</div>
      <img src="${pickIcon(data.daily.weathercode[i])}" 
           alt="${mapWeatherCode(data.daily.weathercode[i])}" 
           class="mx-auto" />
      <div class="text-xl font-bold">
        ${formatTemp(data.daily.temperature_2m_max[i])}°${currentUnit} /
        ${formatTemp(data.daily.temperature_2m_min[i])}°${currentUnit}
      </div>
      <div class="text-sm text-gray-600">Precip: ${data.daily.precipitation_sum[i]} mm</div>
      <div class="text-sm text-gray-600">UV Max: ${data.daily.uv_index_max[i]}</div>
    `;
    forecastEl.appendChild(card);
  }
};
