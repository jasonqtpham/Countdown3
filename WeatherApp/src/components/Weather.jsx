import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  TextField,
  Typography,
  Input,
  Button,
  Card,
  CardContent,
  paperClasses,
  Paper,
  Grid,
} from "@mui/material";

const Weather = () => {
  const [location, setLocation] = useState("");
  const [forecast, setforecast] = useState(null);
  const [coordinate, setCoordinate] = useState(null);
  const [hourlyData, setHourlyData] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submitted:", location);
    const geoData = await fetchGeoData(location);
    console.log("name geo data", geoData.name);
    setCoordinate({ latitude: geoData.lat, longitude: geoData.lon });

    setLocation("");
  };

  useEffect(() => {
    console.log(coordinate);
  }, [coordinate]);

  useEffect(() => {
    const fetchforecast = async () => {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${
          coordinate.latitude
        }&lon=${coordinate.longitude}&units=imperial&appid=${
          import.meta.env.VITE_WEATHER_API_KEY
        }`
      );
      const json = await response.json();
      setforecast(json);
      console.log("this is in fetch weather data:", json);
    };

    const fetchHourlyData = async () => {
      const response = await fetch(
        `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${
          coordinate.latitude
        }&lon=${coordinate.longitude}&appid=${
          import.meta.env.VITE_WEATHER_API_KEY
        }&units=imperial`
      );
      const json = await response.json();
      setHourlyData(json);
      console.log("this is in fetch Hourly data:", json);
    };

    const fetchWeeklyData = async () => {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${coordinate.latitude}&lon=${coordinate.longitude}&cnt=7&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=imperial`
      );
      const json = await response.json();
      setWeeklyData(json);
      console.log("this is in fetch WEEKLY data:", json);
    };

    fetchforecast();
    fetchHourlyData();
    fetchWeeklyData();
  }, [coordinate]);

  return (
      <Box px={2} py={4}>
        <Typography variant="h3">Weather App</Typography>
        <LocationInput
          location={location}
          setLocation={setLocation}
          handleSubmit={handleSubmit}
        />
        {forecast && (
          <Box display="flex" justifyContent="center">
            <Box mr={2}>
              <Card>
                <Box maxWidth={400} bgcolor="#c5cbe6">
                  <CurrentWeather forecast={forecast} />
                  <Box
                    display="flex"
                    overflow="auto"
                    style={{ maxHeight: '130px' }}
                    p={2}
                    bgcolor="#9ca9e6"
                  >
                    {hourlyData &&
                      hourlyData.list.map((forecast, index) => (
                        <HourlyForecast key={index} forecast={forecast} />
                      ))}
                  </Box>
                </Box>
              </Card>
            </Box>
            <Box>
              <Grid container spacing={2}>
                {weeklyData &&
                  weeklyData.list.map((forecast, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                      <WeeklyForecastCard forecast={forecast} />
                    </Grid>
                  ))}
              </Grid>
            </Box>
          </Box>
        )}
      </Box>

  );
};

const LocationInput = ({ location, setLocation, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Enter City Location"
        variant="standard"
        value={location}
        onChange={(event) => setLocation(event.target.value)}
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
};
const CurrentWeather = ({ forecast }) => {
  return (
    <CardContent
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h4">{forecast.name}</Typography>
      <Typography variant="h5">{forecast.weather[0].main}</Typography>
      <br />
      <Box display="flex" alignItems="center">
        <img
          src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@4x.png`}
          alt="Weather Icon"
          style={{ marginRight: "8px" }}
        />
      </Box>
      <Typography variant="h5">
        H: {Math.floor(forecast.main.temp_max)} L:
        {Math.floor(forecast.main.temp_min)}
      </Typography>

      <Typography variant="h5">
        Temperature: {Math.floor(forecast.main.temp)} °C
      </Typography>
      <Typography variant="h5">
        Humidity: {forecast.main.humidity}%
      </Typography>
      <Typography variant="h5">
        Wind Speed: {forecast.wind.speed} m/s
      </Typography>
    </CardContent>
  );
};

const HourlyForecast = ({ forecast }) => {
  const iconUrl = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
  const forecastTime = new Date(forecast.dt * 1000).toLocaleString("en-US", {
    hour: "numeric",
    hour12: true,
  });
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      m={1}
      style={{ width: "80px" }}
    >
      <Typography variant="h6">{forecastTime}</Typography>
      <Box mb={1}>
        <img src={iconUrl} alt="Weather Icon" style={{ width: "70px" }} />
      </Box>
      <Typography variant="h6" align="center">
        {Math.floor(forecast.main.temp)}°
      </Typography>
    </Box>
  );
};

const WeeklyForecastCard = ({ forecast }) => {
  const iconUrl = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
  const date = new Date(forecast.dt * 1000).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <Card>
      <CardContent
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h6" gutterBottom>
        {date}
      </Typography>
      <Typography variant="h5">{forecast.weather[0].main}</Typography>
      <br />
      <Box display="flex" alignItems="center">
        <img
          src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@4x.png`}
          alt="Weather Icon"
          style={{ marginRight: "8px" }}
        />
      </Box>
      <Typography variant="h5">
        H: {Math.floor(forecast.temp.max)} L: {Math.floor(forecast.temp.min)}
      </Typography>
      <Typography variant="h5">
        Humidity: {forecast.humidity}%
      </Typography>
    </CardContent>
    </Card>
  );
};
const fetchGeoData = async (location) => {
  const response = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${
      import.meta.env.VITE_WEATHER_API_KEY
    }`
  );
  const json = await response.json();
  console.log("This is in fetchGeoData", json[0]);
  return json[0];
};

export default Weather;
