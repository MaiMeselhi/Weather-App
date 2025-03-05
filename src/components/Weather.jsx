import { FaLocationArrow, FaWind } from "react-icons/fa"; // Use FaLocationArrow instead of FaLocationDot
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  fetchForcastByCity,
  fetchForcastByGeoLocation,
} from "../redux/weatherSlice";
import { BiSearch } from "react-icons/bi";

import { addTrip } from "../redux/tripSlice";
import CitySelector from "./CitySelector";
import sunnyImage from "../assets/sunny.jpg";
import cloudImage from "../assets/cloud.jpg";
import rainImage from "../assets/rain.jpg";
import snowImage from "../assets/snow.jpg";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";

export default function Weather() {
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const forecast = useSelector((state) => state.weather.forecast);
  console.log(forecast);

  // Use geolocation API to get the user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Aktuelle Position:", latitude, longitude);
          dispatch(fetchForcastByGeoLocation({ latitude, longitude }));
        },
        (error) => {
          console.error("Fehler bei der Geolocation:", error);
          // Fallback to Ludwigsburg coordinates (ensure this is correct)
          const fallbackLatitude = 48.8852529; // current Latitude

          const fallbackLongitude = 9.1545119; // current Longitude
          dispatch(
            fetchForcastByGeoLocation({
              latitude: fallbackLatitude,
              longitude: fallbackLongitude,
            })
          );
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, [dispatch]);

  {
    /*  only first ten results*/
  }
  const forecastHours = forecast?.forecast?.forecastday[0].hour.slice(8, 20);
  const weatherCondition = forecast?.current?.condition?.text?.toLowerCase();
  let backgroundImage = sunnyImage;

  if (weatherCondition) {
    if (
      weatherCondition.includes("sunny") ||
      weatherCondition.includes("clear")
    ) {
      backgroundImage = sunnyImage;
    } else if (
      weatherCondition.includes("cloud") ||
      weatherCondition.includes("overcast")
    ) {
      backgroundImage = cloudImage;
    } else if (weatherCondition.includes("rain")) {
      backgroundImage = rainImage;
    } else if (weatherCondition.includes("snow")) {
      backgroundImage = snowImage;
    }
  }
  const handleSearch = () => {
    if (city.trim() !== "") {
      dispatch(fetchForcastByCity(city));
    }
  };

  // Funktion zum Hinzufügen einer Reise
  const handleAddTrip = () => {
    if (city && startDate && endDate) {
      const trip = {
        id: new Date().getTime(), // Eindeutige ID basierend auf der Zeit
        city,
        startDate,
        endDate,
      };
      dispatch(addTrip(trip)); // Reise zu Redux und LocalStorage hinzufügen
      navigate("/history"); // Navigiere zur Historie-Seite
    }
  };

  return (
    <div
      className="weather-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="main-section">
        <div className="weather-info">
          <div className="location">
            {/* Z.B Ludwigsburg - Deutschland */}

            <h3>
              {forecast?.location?.name} - {forecast?.location?.country}
            </h3>
          </div>
          <div className="condition">
            {/*weatherCondition :  cloudy -sunny ..... */}

            <h1>{forecast?.current?.condition?.text}</h1>
          </div>
        </div>
        <div className="weather-hours">
          {forecastHours?.map((hour, index) => {
            const time = new Date(hour.time).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            });

            return (
              <div className="hour-card" key={index}>
                <div className="hour-time">
                  {/*  time format*/}
                  <p>{time}</p>
                </div>
                <div className="hour-condition">
                  <img src={hour?.condition.icon} alt="" />
                </div>
                <div className="hour-temp">
                  {/* temperture per hour*/}
                  <h2>{Math.ceil(hour?.temp_c)}°C</h2>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="side-section">
        <div className="search-box">
          <FaLocationArrow className="icon" />
          <input
            type="text"
            placeholder={forecast?.location?.name}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <BiSearch className="icon" onClick={handleSearch} />
        </div>

        <h2>Reiseplan erstellen</h2>
        <div className="search-box">
          <CitySelector setCity={setCity} />
        </div>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button onClick={handleAddTrip}>Reise hinzufügen</button>

        <div className="temp-info">
          {/* current temperture*/}

          <h1>{Math.ceil(forecast?.current?.temp_c)}°C</h1>
          <p>
            {/* wind direction*/}
            <FaWind /> {forecast?.current?.wind_dir}{" "}
            {forecast?.current?.wind_kph} Km/h
          </p>
        </div>

        <div className="forecast-days">
          <h1 className="forecast-heading"> The Next 7 Days Forecast</h1>
          {forecast?.forecast?.forecastday?.map((item, index) => {
            const forecastDate = new Date(item.date).toLocaleDateString(
              "en-GB",
              {
                weekday: "long",
                day: "2-digit",
                month: "long",
              }
            );
            return (
              <div className="forecast-item" key={index}>
                <div className="forecast-details">
                  <div className="forecast-icon">
                    <img src={item.day.condition.icon} alt="condition" />
                  </div>
                  <div className="details">
                    <h2>{forecastDate}</h2>
                    <p>{item.day.condition.text}</p>
                  </div>
                </div>
                <div className="forecast-temp">
                  <div className="temp-display">
                    <h2>{Math.ceil(item.day.maxtemp_c)}°C</h2>
                    <h2>{Math.ceil(item.day.mintemp_c)}°C</h2>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
