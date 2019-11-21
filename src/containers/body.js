import React, { useState } from "react";
import Select from "react-select";
import { Bar } from 'react-chartjs-2';
import { countriesArray } from "./../resources/countries.json";
import { defaultDataSetProp, graphOptions } from "./../resources/graphProps";
import { toTitleCase } from "./../resources/helpers";

const countriesDefaultValues = countriesArray.map((country) => ({ value: country.code, label: country.name }));
const statesDefaultValues = countriesArray[0].states.map((state) => ({ value: state.code, label: toTitleCase(state.name) }));
const citiesDefaultValues = countriesArray[0].states[0].cities.map((city) => ({ value: city.name, label: city.name }));

const Body = () => {
    const [countries] = useState(countriesDefaultValues);
    const [states, setStates] = useState(statesDefaultValues);
    const [cities, setCities] = useState(citiesDefaultValues);

    const [pickedCountry, setPickedCountry] = useState(countries[0]);
    const [pickedState, setPickedState] = useState(states[0]);
    const [pickedCity, setPickedCity] = useState(cities[0]);

    const [graphData, setGraphData] = useState({
        labels: [],
        dataSet: [],
    })

    const handleCountryChange = (selectedItem) => {
        const { value } = selectedItem;
        const selectedCountry = countriesArray.find((country) => country.code === value);
        setPickedCountry(selectedItem);

        const states = selectedCountry.states.map((state) => ({ value: state.code, label: toTitleCase(state.name) }));
        setStates(states);
        setPickedState(states[0]);

        const cities = selectedCountry.states[0].cities.map((city) => ({ value: city.name, label: city.name }));
        setCities(cities);
        setPickedCity(cities[0]);
    };

    const handleStateChange = (selectedState) => {
        const { value } = selectedState;
        const selectedCountry = countriesArray.find((country) => country.code === pickedCountry.value);

        setPickedState(selectedState);

        const cities = selectedCountry.states.find((state) => state.code === value).cities
            .map((city) => ({ value: city.name, label: toTitleCase(city.name) }));
        setCities(cities);
        setPickedCity(cities[0]);
    }

    const handleCityChange = (selectedCity) => {
        setPickedCity(selectedCity);

        const citiesToDisplay = countriesArray.find((country) => country.code === pickedCountry.value).states
            .find((state) => state.code === pickedState.value).cities;

        const highlightedCity = citiesToDisplay.find((city) => city.name === pickedCity.value);

        const labels = citiesToDisplay.map((city) => city.name);
        const datasets = [{
            ...defaultDataSetProp,
            label: highlightedCity.name,
            backgroundColor: "333",
            borderColor: "#333",
            data: citiesToDisplay.map((city) => city.population),
        }];
        setGraphData({ labels, datasets });
    }

    return (<div className="body">
        <div className="input-container">
            <p className="title">Please select city to see population graph</p>
            <div className="dropdowns-container">
                <div className="item">
                    <p>Country: </p>
                    <Select options={countries} value={pickedCountry} onChange={(selectedItem) => handleCountryChange(selectedItem)}/>
                </div>
                <div className="item">
                    <p>State: </p>
                    <Select options={states} value={pickedState} onChange={(selectedItem) => handleStateChange(selectedItem)}/>
                </div>
                <div className="item">
                    <p>City: </p>
                    <Select options={cities} value={pickedCity} onChange={(selectedItem) => handleCityChange(selectedItem)} />
                </div>
            </div>
        </div>
        <div className="chart-container">
            <p className="y-label">Population</p>
            <Bar  data={graphData} options={graphOptions}/>
            <p className="x-label">Cities</p>
        </div>
    </div>);
};

export default Body;
