import React from "react";
import Weather from "./components/Weather";
import Input from "./components/Input";

function convertToFlag(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());

  return String.fromCodePoint(...codePoints);
}

//////////////////////////////////
class App extends React.Component {
  state = {
    location: "",
    isLoading: false,
    displayLocation: "",
    weather: {},
  };

  //////////////////////////////////
  fetchWeather = async () => {
    if (this.state.location < 2) return this.setState({ weather: {} });

    try {
      this.setState({ isLoading: true });

      // 1) Getting location (geocoding)
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${this.state.location}`
      );
      const geoData = await geoRes.json();
      //console.log(geoData);

      if (!geoData.results) throw new Error("Location not found");

      const { latitude, longitude, timezone, name, country_code } =
        geoData.results.at(0);

      //console.log(`${name} ${convertToFlag(country_code)}`);
      this.setState({
        displayLocation: `${name} ${convertToFlag(country_code)}`,
      });

      // 2) Getting actual weather
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
      );
      const weatherData = await weatherRes.json();

      // console.log(weatherData.daily);
      this.setState({
        weather: weatherData.daily,
      });
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  setLocation = (e) => this.setState({ location: e.target.value });

  //////////////////////////////////
  // useEffect []
  componentDidMount() {
    // Get location in localstorage
    this.setState({ location: localStorage.getItem("location" || "") });
  }

  // useEffect [location] - this method isn't called on mount, only on re-render
  componentDidUpdate(prevPros, prevState) {
    if (this.state.location !== prevState.location) this.fetchWeather();

    // Saving it localstore
    localStorage.setItem("location", this.state.location);
  }

  //////////////////////////////////
  render() {
    return (
      <div className="app">
        <h1>Classy Weather</h1>

        <Input
          location={this.state.location}
          onChangeLocation={this.setLocation}
        />

        {this.state.isLoading && <p className="loader">Loading...</p>}

        {this.state.weather?.weathercode && (
          <Weather
            weather={this.state.weather}
            location={this.state.displayLocation}
          />
        )}
      </div>
    );
  }
}

export default App;
