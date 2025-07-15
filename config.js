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
            z-index: -1;
        }
        main {
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            height: 80vh;
        }
        .bias-container {
            max-width: 900px; /* Increased width for larger text */
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .bias-title {
            font-size: 3.5rem; /* Made significantly larger */
            font-weight: 700;
            margin-bottom: 1.5rem;
        }
        .bias-solution {
            font-size: 1.75rem; /* Made significantly larger */
            line-height: 1.6;
        }
        #info-bar {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 2.5rem; /* Increased gap */
            padding-top: 1.5rem;
            border-top: 1px solid rgba(245, 245, 220, 0.2);
            width: 100%;
            max-width: 900px; /* Increased width */
        }
        .weather-container {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        .weather-icon {
            width: 50px; /* Increased size */
            height: 50px; /* Increased size */
        }
        .temperature, #time, #date {
            font-size: 1.5rem; /* Increased size */
            font-weight: normal;
        }
        .temperature {
            font-weight: 700;
        }
    </style>
</head>
<body>

    <main id="content">
        <div id="bias-container" class="bias-container">
            <!-- Bias and solution will be injected here -->
        </div>

        <div id="info-bar">
            <div id="weather" class="weather-container">
                <!-- Weather data will be injected here -->
            </div>
            <div id="time">
                <!-- Time will be injected here -->
            </div>
            <div id="date">
                <!-- Date will be injected here -->
            </div>
        </div>
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

        // Extracted and refined behavioral biases
        const BIASES = [
            {
                bias: "Action Bias",
                solution: "We have a tendency to favor action over inaction. DO NOTHING when there is no change in signal and TAKE ACTION only when the signal changes."
            },
            {
                bias: "Availability Heuristic",
                solution: "We tend to use information that comes to mind quickly. Counter this by consulting a robust Quantitative and Fundamental Research Summary daily."
            },
            {
                bias: "Confirmation Bias",
                solution: "We tend to favor information that confirms our existing beliefs. Avoid this by reviewing every meaningful economic release in a daily, unbiased analysis."
            },
            {
                bias: "Disposition Effect",
                solution: "We tend to sell winning assets too early and hold losing assets too long. Use a Top-Down or Bottom-Up approach to block out noise and focus on the long-term trend."
            },
            {
                bias: "Hindsight Bias",
                solution: "We tend to believe that past events were more predictable than they actually were. Combat this by using quantitative signals and forward-thinking long term goals."
            },
            {
                bias: "Hyperbolic Discounting",
                solution: "We're inclined to choose smaller, immediate rewards over larger rewards that come later. Avoid frameworks that try to predict every market wiggle and focus on long-term strategy."
            },
            {
                bias: "Illusion of Explanatory Depth",
                solution: "We often believe we understand complex topics more than we actually do. Remind yourself that narrow social media topics aren't the only drivers of asset markets by reviewing broader data."
            },
            {
                bias: "Optimism Bias",
                solution: "We tend to be overly optimistic about outcomes. It's better to be the second investor in a confirmed trade than the first in a trade that may not pan out."
            },
            {
                bias: "Recency Bias",
                solution: "We give too much weight to recent events. Make only marginal changes to your strategy based on new data, rather than making wholesale changes."
            },
            {
                bias: "Sunk Cost Fallacy",
                solution: "We irrationally follow through on something because we've already invested in it. Use risk management signals to dispassionately cut small losses before they become big ones."
            },
             {
                bias: "Myopic Loss Aversion",
                solution: "We focus too much on short-term results and overreact to losses. Use risk management signals that advise doing nothing when there is no signal change, and taking action only when there is."
            },
            {
                bias: "Negativity Bias",
                solution: "We give more weight to negative experiences than positive ones. A risk management process should override this disposition, keeping you invested until signals instruct otherwise."
            },
            {
                bias: "Illusion of Validity",
                solution: "We have overconfidence in our ability to predict outcomes from a set of data. Rely on statistical models and actively seek out disconfirming evidence."
            },
            {
                bias: "Zero-Risk Bias",
                solution: "We tend to prefer options that eliminate a risk completely, even if it's not the most effective choice. Evaluate risk-reduction options based on their total expected value, not just the elimination of a single risk."
            }
        ];

        // --- ELEMENTS ---
        const weatherElement = document.getElementById('weather');
        const biasContainerElement = document.getElementById('bias-container');
        const timeElement = document.getElementById('time');
        const dateElement = document.getElementById('date');

        // --- FUNCTIONS ---

        async function getWeather(lat, lon) {
            const apiKey = CONFIG.weatherKey;
            const unit = CONFIG.weatherUnit === 'F' ? 'imperial' : 'metric';
            const lang = CONFIG.language;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}&lang=${lang}`;

            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Weather data not found. Status: ${response.status}`);
                const data = await response.json();
                displayWeather(data);
            } catch (error) {
                console.error('Error fetching weather:', error);
                weatherElement.innerHTML = `<p>Weather unavailable</p>`;
            }
        }

        function displayWeather(data) {
            const temp = Math.round(data.main.temp);
            const iconCode = data.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

            weatherElement.innerHTML = `
                <img src="${iconUrl}" alt="${data.weather[0].description}" class="weather-icon">
                <div class="temperature">${temp}°${CONFIG.weatherUnit}</div>
            `;
        }

        function displayDailyBias() {
            const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
            const biasIndex = dayOfYear % BIASES.length;
            const selectedBias = BIASES[biasIndex];

            biasContainerElement.innerHTML = `
                <h2 class="bias-title">${selectedBias.bias}</h2>
                <p class="bias-solution">${selectedBias.solution}</p>
            `;
        }

        function displayDateTime() {
            const now = new Date();
            const timeOptions = { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit', hour12: true };
            const dateOptions = { timeZone: 'America/New_York', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

            timeElement.textContent = now.toLocaleTimeString('en-US', timeOptions);
            dateElement.textContent = now.toLocaleDateString('en-US', dateOptions);
        }

        function initializeWeather() {
            getWeather(CONFIG.defaultLatitude, CONFIG.defaultLongitude);
        }

        // --- INITIALIZATION ---
        document.addEventListener('DOMContentLoaded', () => {
            initializeWeather();
            displayDailyBias();
            displayDateTime(); // Initial call
            setInterval(displayDateTime, 1000); // Update time every second
        });

    </script>
</body>
</html>
