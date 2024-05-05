import React, {useState, useEffect}  from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';

const Weather = () => {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [coordinate, setCoordinate] = useState({latitude: 0, ongitude: 0});

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
    <LocationInput location={location} setLocation={setLocation} handleSubmit={handleSubmit}/>
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

const fetchGeoData = async (location) => {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${import.meta.env.VITE_WEATHER_API_KEY}`);
    const json = await response.json();
    console.log('This is in fetchGeoData', json[0])
    return json[0];
}



export default Weather;
