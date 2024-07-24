/*********************************************************************************
* WEB422 – Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Jacobs Timi Uba Student ID: 148981228 Date: 3rd July, 2024
*
*
********************************************************************************/

// pages/index.js
import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import { Table } from 'react-bootstrap';
import { useAtom } from 'jotai';
import { selectedLanguageAtom, recentlyViewedAtom } from '../atom/atoms'; // Import atoms

const Home = () => {
  const [selectedLanguage, setSelectedLanguage] = useAtom(selectedLanguageAtom);
  const [recentlyViewed, setRecentlyViewed] = useAtom(recentlyViewedAtom);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const apiKey = 'befb06c7fc9013a51c9e60f791d30f3a';

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=${selectedLanguage}&appid=${apiKey}`);
          const data = await response.json();
          setWeather(data);
        } catch (error) {
          setError('Error fetching weather data.');
        }
      }, () => {
        setError('Geolocation error.');
      });
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, [selectedLanguage]);

  return (
    <div>
      <NavBar setSelectedLanguage={setSelectedLanguage} recentlyViewed={recentlyViewed} />
      <div className="container mt-4">
        {error && <div className="alert alert-danger">{error}</div>}
        {weather && (
          <div>
            <h2>Current Weather</h2>
            <Table striped>
              <thead>
                <tr>
                  <th>City</th>
                  <th>Temperature (°C)</th>
                  <th>Weather</th>
                  <th>Min Temp (°C)</th>
                  <th>Max Temp (°C)</th>
                  <th>Wind Speed (m/s)</th>
                  <th>Humidity (%)</th>
                  <th>Pressure (hPa)</th>
                  <th>Sunrise</th>
                  <th>Sunset</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{weather.name}, {weather.sys.country} <img src={`http://openweathermap.org/images/flags/${weather.sys.country.toLowerCase()}.png`} alt="flag" /></td>
                  <td>{weather.main.temp}</td>
                  <td>{weather.weather[0].description}</td>
                  <td>{weather.main.temp_min}</td>
                  <td>{weather.main.temp_max}</td>
                  <td>{weather.wind.speed}</td>
                  <td>{weather.main.humidity}</td>
                  <td>{weather.main.pressure}</td>
                  <td>{new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</td>
                  <td>{new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
