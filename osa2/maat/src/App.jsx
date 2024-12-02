import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((response) => {
        setCountries(response.data);
      });
  }, []);

  useEffect(() => {
    const result = countries.filter((country) =>
      country.name.common.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredCountries(result);
  }, [filterText, countries]);

  useEffect(() => {
    if (filteredCountries.length === 1) {
      const country = filteredCountries[0];
      const capital = country.capital[0];
      const capitalCoordinates = country.capitalInfo.latlng;

      if (capitalCoordinates) {
        const [lat, lon] = capitalCoordinates;
        axios
          .get(
            `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&units=metric&appid=${WEATHER_API_KEY}`
          )
          .then((response) => {
            setWeather({
              temperature: response.data.current.temp,
              description: response.data.current.weather[0].description,
              icon: response.data.current.weather[0].icon,
            });
          });
      }
    } else {
      setWeather(null);
    }
  }, [filteredCountries]);

  const handleShowCountry = (countryName) => {
    setFilterText(countryName);
  };

  const renderCountries = () => {
    if (filterText === '') return <div>No countries found</div>;

    if (filteredCountries.length > 10)
      return <div>Too many matches, specify another filter</div>;

    if (filteredCountries.length === 1) {
      const country = filteredCountries[0];
      const languages = Object.values(country.languages || {});

      return (
        <div>
          <h2>{country.name.common}</h2>
          <p>
            <strong>Capital:</strong> {country.capital?.[0] || 'N/A'}
          </p>
          <p>
            <strong>Area:</strong> {country.area} km²
          </p>

          <h3>Languages</h3>
          <ul>
            {languages.map((language, index) => (
              <li key={index}>{language}</li>
            ))}
          </ul>

          <img
            src={country.flags.png}
            alt={`Flag of ${country.name.common}`}
            style={{ width: '150px', height: 'auto' }}
          />

          {weather && (
            <div>
              <h3>Weather in {country.capital?.[0]}</h3>
              <p>
                <strong>Temperature:</strong> {weather.temperature} °C
              </p>
              <p>
                <strong>Description:</strong> {weather.description}
              </p>
              <img
                src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt={weather.description}
              />
            </div>
          )}
        </div>
      );
    }

    if (filteredCountries.length > 0 && filteredCountries.length <= 10) {
      return filteredCountries.map((country) => (
        <div key={country.cca3} style={{ marginBottom: '10px' }}>
          <span>{country.name.common}</span>
          <button
            style={{ marginLeft: '5px' }}
            onClick={() => handleShowCountry(country.name.common)}
          >
            Show
          </button>
        </div>
      ));
    }

    return <div>No countries found</div>;
  };

  return (
    <div>
      <form style={{ margin: '1em 0' }}>
        <label htmlFor="countriesSearch">Search for countries </label>
        <input
          type="text"
          id="countriesSearch"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </form>
      {renderCountries()}
    </div>
  );
};

export default App;
