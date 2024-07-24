// pages/city/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar';
import { Table, Button, ButtonGroup, Modal } from 'react-bootstrap';
import { useAtom } from 'jotai';
import { selectedLanguageAtom, recentlyViewedAtom } from '../../atom/atoms'; // Import atoms

const CityDetail = () => {
  const [selectedLanguage, setSelectedLanguage] = useAtom(selectedLanguageAtom);
  const [recentlyViewed, setRecentlyViewed] = useAtom(recentlyViewedAtom);
  const router = useRouter();
  const { id } = router.query;
  const [weather, setWeather] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCity, setSelectedCity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const recordsPerPage = 3; // Adjust as needed based on your design
  const apiKey = 'befb06c7fc9013a51c9e60f791d30f3a';

  useEffect(() => {
    setCurrentPage(1); // Reset page on city change
  }, [id]);

  useEffect(() => {
    if (id) {
      const fetchWeather = async () => {
        try {
          const response = await fetch(`https://api.openweathermap.org/data/2.5/find?q=${id}&units=metric&appid=${apiKey}&lang=${selectedLanguage}&cnt=50`);
          const data = await response.json();
          if (data.count > 0) {
            const weatherData = await Promise.all(data.list.map(city => fetchCityData(city.id)));
            setWeather(weatherData);
            setRecentlyViewed((prev) => [...new Set([id, ...prev])]); // Add to recently viewed, ensuring uniqueness
            setError('');
          } else {
            setWeather([]);
            setError('City not found.');
          }
        } catch (error) {
          setWeather([]);
          setError(`Error fetching weather data: ${error.message}`);
        }
      };
      fetchWeather();
    }
  }, [id, selectedLanguage]);

  const fetchCityData = async (cityId) => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?id=${cityId}&units=metric&appid=${apiKey}&lang=${selectedLanguage}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching city data: ${error.message}`);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(weather.length / recordsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleRowClick = (city) => {
    setSelectedCity(city);
    setShowModal(true);
  };

  const renderWeatherTable = () => {
    if (!weather || weather.length === 0) {
      return (
        <div className="alert alert-warning">No weather data available.</div>
      );
    }

    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = Math.min(startIndex + recordsPerPage, weather.length);
    const paginatedCities = weather.slice(startIndex, endIndex);

    return (
      <Table striped>
        <thead>
          <tr>
            <th>City</th>
            <th>Temperature (°C)</th>
            <th>Weather</th>
            {/* <th>Min Temp (°C)</th>
            <th>Max Temp (°C)</th>
            <th>Wind Speed (m/s)</th>
            <th>Humidity (%)</th>
            <th>Pressure (hPa)</th> */}
            <th>Sunrise</th>
            <th>Sunset</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCities.map((city, index) => (
            <tr key={`${city.id}-${index}`} onClick={() => handleRowClick(city)}> {/* Using a combination of city id and index for key */}
              <td>{city.name}, {city.sys.country} <img src={`http://openweathermap.org/images/flags/${city.sys.country.toLowerCase()}.png`} alt="flag" /></td>
              <td>{city.main.temp}</td>
              <td>{city.weather[0].description}</td>
              {/* <td>{city.main.temp_min}</td>
              <td>{city.main.temp_max}</td>
              <td>{city.wind.speed}</td>
              <td>{city.main.humidity}</td>
              <td>{city.main.pressure}</td> */}
              <td>{new Date(city.sys.sunrise * 1000).toLocaleTimeString()}</td>
              <td>{new Date(city.sys.sunset * 1000).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(weather.length / recordsPerPage);
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <Button key={i} variant={i === currentPage ? "primary" : "light"} onClick={() => setCurrentPage(i)}>
          {i}
        </Button>
      );
    }
    return <ButtonGroup>{pages}</ButtonGroup>; // Wrap the buttons in a ButtonGroup
  };

  const totalPages = Math.ceil(weather.length / recordsPerPage);

  return (
    <div>
      <NavBar setSelectedLanguage={setSelectedLanguage} recentlyViewed={recentlyViewed} />
      <div className="container mt-4">
        {error && <div className="alert alert-danger">{error}</div>}
        {renderWeatherTable()}
        <div className="text-center mt-3">
          {totalPages > 1 && (
            <ButtonGroup>
              <Button variant="success" disabled={currentPage === 1} onClick={handlePreviousPage}>Previous</Button>{' '}
              {renderPagination()}
              <Button variant="success" disabled={currentPage >= totalPages} onClick={handleNextPage}>Next</Button>
            </ButtonGroup>
          )}
        </div>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedCity?.name} </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p class='fw-bold'>Min Temp: {selectedCity?.main.temp_min} °C</p>
            <p class='fw-bold'>Max Temp: {selectedCity?.main.temp_max} °C</p>
            <p class='fw-bold'>Wind Speed: {selectedCity?.wind.speed} m/s</p>
            <p class='fw-bold'>Humidity: {selectedCity?.main.humidity} %</p>
            <p class='fw-bold'>Pressure: {selectedCity?.main.pressure} hPa</p>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default CityDetail;
