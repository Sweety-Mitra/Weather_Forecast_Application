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