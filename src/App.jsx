import { LoadingButton } from "@mui/lab";
import { Box, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";

const API_WEATHER = `http://api.weatherapi.com/v1/current.json?key=${
  import.meta.env.VITE_API_KEY
}&q=`;

function App() {
  const [city, setCity] = useState("");
  const [loading, setloading] = useState(false);
  const [error, setError] = useState({
    message: "",
    error: false,
  });

  const [weather, setWeather] = useState({
    city: "",
    country: "",
    temp: "",
    condition: "",
    icon: "",
    conditionText: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    setloading(true);
    setError({
      message: "",
      error: false,
    });

    try {
      if (!city.trim()) throw { message: "El campo ciudad es obligatorio" };

      const response = await fetch(`${API_WEATHER}${city}`);
      const data = await response.json();

      if (data.error) throw { message: data.error.message };

      setWeather({
        city: data?.location?.name || "",
        country: data?.location?.country || "",
        temp: data.current.temp_c,
        // temp: `${
        //   Math.round((parseFloat(data?.current?.temp_c) || 0) * 9) / 5
        // }°C`,
        condition: data.current.condition.code,
        icon: data.current.condition.icon,
        conditionText: data.current.condition.text,
      });
    } catch (error) {
      //console.log(error)
      setError({
        message: error.message,
        error: true,
      });
    } finally {
      setloading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 2 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        Weather App
      </Typography>
      <Box
        sx={{ display: "grid", gap: 2 }}
        component="form"
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <TextField
          id="city"
          label="City Name"
          variant="outlined"
          size="small"
          required
          fullWidth
          value={city}
          onChange={(e) => setCity(e.target.value)}
          error={error.error}
          helperText={error.message}
        />

        <LoadingButton
          type="submit"
          variant="contained"
          loading={loading}
          loadingIndicator="Loading..."
        >
          Buscar
        </LoadingButton>
      </Box>

      {weather.city && (
        <Box
          sx={{
            mt: 2,
            display: "grid",
            grap: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h4" component="h2">
            {weather.city}, {weather.country}
          </Typography>
          <Box 
            component='img'
            alt={weather.conditionText}
            src={weather.icon}
            sx={{ margin: '0 auto' }} 

          />
          <Typography variant="h5" component='h5'>
            {weather.temp} °C
          </Typography>
          <Typography variant="h6" component='h4' >{weather.conditionText}</Typography>


        </Box>
      )}

      <Typography textAlign="center" sx={{ mt: 2, fontSize: "10px" }}>
        Powered by:{" "}
        <a href="https://www.weatherapi.com/" title="Weather API">
          WeatherAPI.com
        </a>
      </Typography>
    </Container>
  );
}

export default App;
