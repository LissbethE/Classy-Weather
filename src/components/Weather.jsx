import React from "react";
import Day from "./Day";

class Weather extends React.Component {
  // Similar to returning a cleanup function from an effect function, this one only runs
  // after the component unmounts, after it disappears and is destroyed, Not between renders
  componentWillUnmount() {
    console.log("Unmounting");
  }

  render() {
    const {
      temperature_2m_max: max,
      temperature_2m_min: min,
      time: dates,
      weathercode: codes,
    } = this.props.weather;

    return (
      <div>
        <h2>Weather {this.props.location}</h2>

        <ul className="weather">
          {dates?.map((date, i) => (
            <Day
              key={date}
              date={date}
              max={max.at(i)}
              min={min.at(i)}
              code={codes.at(i)}
              isToday={i === 0}
            />
          ))}
        </ul>
      </div>
    );
  }
}

export default Weather;
