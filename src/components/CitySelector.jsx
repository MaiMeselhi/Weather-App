import React from "react";
import { useDispatch } from "react-redux";
import { fetchForcastByCity } from "../redux/weatherSlice";

const cities = [
  { name: "Cairo", country: "Egypt" },
  { name: "Berlin", country: "Germany" },
  { name: "Paris", country: "France" },
  { name: "London", country: "United Kingdom" },
  { name: "Dubai", country: "UAE" },
  { name: "Tokyo", country: "Japan" },
];

const CitySelector = ({ setCity }) => {
  const dispatch = useDispatch();

  const handleCityChange = (event) => {
    const city = event.target.value;
    setCity(city);
    dispatch(fetchForcastByCity(city)); // Dispatch action to fetch weather data
  };

  return (
    <div className="city-selector">
      <select onChange={handleCityChange}>
        <option value="">Select a City</option>
        {cities.map((city, index) => (
          <option key={index} value={city.name}>
            {city.name} - {city.country}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CitySelector;
