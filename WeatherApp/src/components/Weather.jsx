import React, {useState, useEffect}  from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';

const Weather = () => {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [coordinate, setCoordinate] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Submitted:', location);
    const geoData = await fetchData(location);
    console.log('name ',geoData.name);
    setCoordinate({lat: geoData.lat, lon: geoData.lon});
    
    setLocation('');
  };

  useEffect(() => {console.log(coordinate)}, [coordinate]);

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

const fetchData = async (location) => {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${import.meta.env.VITE_WEATHER_API_KEY}`);
    const json = await response.json();
    console.log(json[0])
    return json[0];
}
export default Weather;
