<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Taehoon's Start Page</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #000000;
            color: #F5F5DC; /* Creamy Rustic White */
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            text-align: center;
            padding: 2rem;
            position: relative;
            overflow: hidden;
        }
        /* Rustic, ancient filter overlay */
        body::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url('https://www.transparenttextures.com/patterns/noisy-net.png');
            opacity: 0.04;
            z-index: 0;
        }
        main {
            position: relative;
            z-index: 1;
        }
        .weather-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }
        .weather-icon {
            width: 80px;
            height: 80px;
        }
        .temperature {
            font-size: 4rem;
            font-weight: 700;
            line-height: 1;
        }
        .quote {
            max-width: 600px;
            font-size: 1.25rem;
            font-style: italic;
        }
    </style>
</head>
<body>

    <main id="content" class="flex flex-col items-center justify-center">
        <div id="weather" class="weather-container">
            <!-- Weather data will be injected here -->
        </div>
        <p id="quote" class="quote">
            <!-- Quote will be injected here -->
        </p>
    </main>

    <script>
        // --- CONFIGURATION ---
        const CONFIG = {
            weatherKey: '5efafb1ab4d3edd94b1b2fc166ab650c', // Your OpenWeatherMap API Key
            weatherUnit: 'F', // 'F' for Fahrenheit, 'C' for Celsius
            language: 'en',
            trackLocation: false, // Set to false to always show Savannah, GA
            defaultLatitude: '32.0809', // Savannah, GA Latitude
            defaultLongitude: '-81.0912', // Savannah, GA Longitude
        };

        const QUOTES = [
            "The secret of getting ahead is getting started.",
            "The best way to predict the future is to create it.",
            "The only limit to our realization of tomorrow will be our doubts of today.",
            "Do not wait to strike till the iron is hot; but make it hot by striking.",
            "The man who has confidence in himself gains the confidence of others.",
            "What we fear doing most is usually what we most need to do.",
            "Success is not final, failure is not fatal: it is the courage to continue that counts.",
            "The will to win, the desire to succeed, the urge to reach your full potential... these are the keys that will unlock the door to personal excellence.",
            "A man is not finished when he is defeated. He is finished when he quits.",
            "The successful warrior is the average man, with laser-like focus.",
            "Strength does not come from physical capacity. It comes from an indomitable will.",
            "It is not the mountain we conquer, but ourselves."
            
        ];

        // --- ELEMENTS ---
        const weatherElement = document.getElementById('weather');
        const quoteElement = document.getElementById('quote');

        // --- FUNCTIONS ---

        /**
         * Fetches and displays the weather.
         * @param {number} lat - Latitude.
         * @param {number} lon - Longitude.
         */
        async function getWeather(lat, lon) {
            const apiKey = CONFIG.weatherKey;
            const unit = CONFIG.weatherUnit === 'F' ? 'imperial' : 'metric';
            const lang = CONFIG.language;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}&lang=${lang}`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Weather data not found. Status: ${response.status}`);
                }
                const data = await response.json();
                displayWeather(data);
            } catch (error) {
                console.error('Error fetching weather:', error);
                weatherElement.innerHTML = `<p>Could not fetch weather data.</p>`;
            }
        }

        /**
         * Displays the fetched weather data on the page.
         * @param {object} data - The weather data from the API.
         */
        function displayWeather(data) {
            const temp = Math.round(data.main.temp);
            const iconCode = data.weather[0].icon;
            const description = data.weather[0].description;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

            weatherElement.innerHTML = `
                <img src="${iconUrl}" alt="${description}" class="weather-icon">
                <div class="temperature">${temp}°${CONFIG.weatherUnit}</div>
            `;
        }

        /**
         * Displays a daily quote.
         */
        function displayDailyQuote() {
            const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
            const quoteIndex = dayOfYear % QUOTES.length;
            quoteElement.textContent = `"${QUOTES[quoteIndex]}"`;
        }

        /**
         * Gets user's location or uses default.
         */
        function initializeWeather() {
            if (CONFIG.trackLocation && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        getWeather(position.coords.latitude, position.coords.longitude);
                    },
                    (error) => {
                        // This block handles geolocation errors, like permission denied.
                        let warningMessage = 'Could not get location. ';
                        switch(error.code) {
                            case error.PERMISSION_DENIED:
                                warningMessage += "Permission denied. ";
                                break;
                            case error.POSITION_UNAVAILABLE:
                                warningMessage += "Location information is unavailable. ";
                                break;
                            case error.TIMEOUT:
                                warningMessage += "The request to get location timed out. ";
                                break;
                            default:
                                warningMessage += "An unknown error occurred. ";
                                break;
                        }
                        warningMessage += 'Falling back to default location.';
                        console.warn(warningMessage);
                        getWeather(CONFIG.defaultLatitude, CONFIG.defaultLongitude);
                    }
                );
            } else {
                 if (CONFIG.trackLocation) {
                    console.warn('Geolocation is not supported by this browser, using default location.');
                 }
                // If tracking is off, or geolocation is not supported, use the default location.
                getWeather(CONFIG.defaultLatitude, CONFIG.defaultLongitude);
            }
        }


        // --- INITIALIZATION ---
        document.addEventListener('DOMContentLoaded', () => {
            initializeWeather();
            displayDailyQuote();
        });

    </script>
</body>
</html>
