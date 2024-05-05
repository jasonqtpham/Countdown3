import React, {useState, useEffect}  from "react";
import { Container, Box, TextField, Typography, Input, Button, Card, CardContent, paperClasses, Paper} from '@mui/material';

const Weather = () => {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [coordinate, setCoordinate] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Submitted:', location);
    const geoData = await fetchGeoData(location);
    console.log('name geo data',geoData.name);
    setCoordinate({latitude: geoData.lat, longitude: geoData.lon});
    
    setLocation('');
  };

  useEffect(() => {console.log(coordinate)}, [coordinate]);

  useEffect(() => {
    const fetchWeatherData = async () => {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinate.latitude}&lon=${coordinate.longitude}&units=imperial&appid=${import.meta.env.VITE_WEATHER_API_KEY}`);
        const json = await response.json();
        setWeatherData(json);
        console.log('this is in fetch weather data:', json);
    };
    fetchWeatherData()
  },[coordinate]);

  return (
    <Container>
      <Typography variant="h3">Weather App</Typography>
      <LocationInput location={location} setLocation={setLocation} handleSubmit={handleSubmit}/>
      <CurrentWeather weatherData={weatherData}/>
    </Container>
  );
};

const LocationInput = ({ location, setLocation, handleSubmit}) => {
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
const CurrentWeather = ({ weatherData }) => {
  return (
    weatherData && (
      <Box display="flex" justifyContent="left">
        <Card>
          <CardContent
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="h4">{weatherData.name}</Typography>
            <br />
            <Box display="flex" alignItems="center">
              <img
                src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
                alt="Weather Icon"
                style={{ marginRight: '8px' }}
              />
            </Box>
            <Typography variant="h5">{weatherData.weather[0].description}</Typography>
            <Typography variant="h5">Temperature: {weatherData.main.temp} °C</Typography>
            <Typography variant="h5">Humidity: {weatherData.main.humidity}%</Typography>
            <Typography variant="h5">Wind Speed: {weatherData.wind.speed} m/s</Typography>
          </CardContent>
        </Card>
      </Box>
    )
  );
};

const fetchGeoData = async (location) => {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${import.meta.env.VITE_WEATHER_API_KEY}`);
    const json = await response.json();
    console.log('This is in fetchGeoData', json[0])
    return json[0];
}



export default Weather;
