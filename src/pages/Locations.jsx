import React, { useState, useEffect } from 'react';
import './Locations.css';

// OPTIONAL: import a default bg image
import defaultBg from '../assets/images/location.jpg';

const usStates = [
  {
    name: "California",
    capital: {
      name: "Sacramento",
      population: 525041,
      coords: { lat: 38.5816, lng: -121.4944 }
    },
    largestCity: {
      name: "Los Angeles",
      population: 3980400,
      coords: { lat: 34.0522, lng: -118.2437 }
    },
    website: "https://www.ca.gov"
  },
  {
    name: "New York",
    capital: {
      name: "Albany",
      population: 97856,
      coords: { lat: 42.6526, lng: -73.7562 }
    },
    largestCity: {
      name: "New York City",
      population: 8419600,
      coords: { lat: 40.7128, lng: -74.0060 }
    },
    website: "https://www.ny.gov"
  },
  {
    name: "Texas",
    capital: {
      name: "Austin",
      population: 964254,
      coords: { lat: 30.2672, lng: -97.7431 }
    },
    largestCity: {
      name: "Houston",
      population: 2328000,
      coords: { lat: 29.7604, lng: -95.3698 }
    },
    website: "https://www.texas.gov"
  },
  {
    name: "Florida",
    capital: {
      name: "Tallahassee",
      population: 197102,
      coords: { lat: 30.4383, lng: -84.2807 }
    },
    largestCity: {
      name: "Jacksonville",
      population: 954614,
      coords: { lat: 30.3322, lng: -81.6557 }
    },
    website: "https://www.myflorida.com"
  }
];

const Locations = ({ bgImage }) => {
  const [search, setSearch]   = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const filtered = usStates.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.capital.name.toLowerCase().includes(search.toLowerCase()) ||
    s.largestCity.name.toLowerCase().includes(search.toLowerCase())
  );

  const containerStyle = {
    backgroundImage:    `url(${bgImage || defaultBg})`,
    backgroundSize:     'cover',
    backgroundPosition: 'center',
    minHeight:          '100vh',
    paddingTop:         '3rem'
  };

  if (loading) {
    return (
      <div className="loader-wrapper">
        <div className="spinner" />
        <span>Loading locations…</span>
      </div>
    );
  }

  return (
    <div className="locations-page" style={containerStyle}>
      <div className="overlay" />
      <h1>Famous U.S. States & Cities</h1>

      <input
        type="text"
        className="search-input"
        placeholder="Search state, capital, or city"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="locations-list">
        {filtered.map((state, i) => (
          <div className="location-card" key={i}>
            <h2>{state.name}</h2>

            <div className="city-info">
              <h3>Capital</h3>
              <p>{state.capital.name} (Pop. {state.capital.population.toLocaleString()})</p>
              <iframe
                title={`${state.capital.name} map`}
                width="100%" height="200" frameBorder="0"
                src={`https://maps.google.com/maps?q=${state.capital.coords.lat},${state.capital.coords.lng}&z=10&output=embed`}
                allowFullScreen
              />
            </div>

            <div className="city-info">
              <h3>Largest City</h3>
              <p>{state.largestCity.name} (Pop. {state.largestCity.population.toLocaleString()})</p>
              <iframe
                title={`${state.largestCity.name} map`}
                width="100%" height="200" frameBorder="0"
                src={`https://maps.google.com/maps?q=${state.largestCity.coords.lat},${state.largestCity.coords.lng}&z=10&output=embed`}
                allowFullScreen
              />
            </div>

            <p className="official-link">
              <a href={state.website} target="_blank" rel="noopener noreferrer">
                Visit Official Website
              </a>
            </p>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="no-results">No matching state or city found.</p>
        )}
      </div>
    </div>
  );
};

export default Locations;
