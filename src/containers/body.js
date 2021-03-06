import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Bar } from "react-chartjs-2";
import { countriesArray } from "./../resources/countries.json";
import { defaultDataSetProp, graphOptions, columnColors } from "./../resources/graphProps";
import { toTitleCase } from "./../resources/helpers";
import localStorage from "./../resources/localStorage";

// load saved dropdown values
const initialCountry = localStorage.getValue("selectedCountry");
const initialState = localStorage.getValue("selectedState");
const initialCity = localStorage.getValue("selectedCity");

// default values for the dropdowns
const getDefaultCountries = () =>  countriesArray.map((country) => ({ value: country.code, label: country.name }));
const getDefaultStates = () => {
    const mapState = (state) => ({ value: state.code, label: toTitleCase(state.name) });
    if (initialCountry) { // retrieve saved states based on country
        return countriesArray
            .find((country) => country.code === initialCountry.value).states
            .map(mapState);
    } else { // default
        return countriesArray[0].states.map(mapState);
    }
};

const getDefaultCities = () => {
    const mapCity = (city) => ({ value: city.name, label: city.name });
    if (initialCountry && initialState) { // retrieve saved cityies based on state
        return countriesArray
            .find((country) => country.code === initialCountry.value).states
            .find((state) => state.code === initialState.value).cities
            .map(mapCity);
    } else { // default
        return countriesArray[0].states[0].cities.map(mapCity);
    }
};

const Body = () => {
    const [countries] = useState(getDefaultCountries());
    const [states, setStates] = useState(getDefaultStates());
    const [cities, setCities] = useState(getDefaultCities());

    // selected values
    const [pickedCountry, setPickedCountry] = useState(initialCountry || countries[0]);
    const [pickedState, setPickedState] = useState(initialState || states[0]);
    const [pickedCity, setPickedCity] = useState(initialCity || cities[0]);

    // states to be used on Bar graph
    const [graphData, setGraphData] = useState({
        labels: [],
        dataSet: [],
    });

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

        const cities = selectedCountry.states
            .find((state) => state.code === value).cities
            .map((city) => ({ value: city.name, label: toTitleCase(city.name) }));

        setCities(cities);

        setPickedCity(cities[0]);
    };

    const handleCityChange = (selectedCity) => {
        setPickedCity(selectedCity);
    };

    // function to change the selected City from the Bar graph
    const onChangeSelectedCity = () => {
        const citiesToDisplay = countriesArray
            .find((country) => country.code === pickedCountry.value).states
            .find((state) => state.code === pickedState.value).cities;

        const highlightedCity = citiesToDisplay.find((city) => city.name === pickedCity.value);

        // horizontal labels
        const labels = citiesToDisplay
            .sort((itemA, itemB) => itemA.name.localeCompare(itemB.name))
            .map((city) => city.name);

        const { border, background } = columnColors;

        const datasets = [{
            label: highlightedCity.name,
            backgroundColor: citiesToDisplay.map((city) => pickedCity.value === city.name ? background.selected : background.default),
            borderColor: citiesToDisplay.map((city) => pickedCity.value === city.name ? border.selected : border.default),
            data: citiesToDisplay.map((city) => city.population),
            ...defaultDataSetProp,
        }];

        // save selected values to local storage.
        localStorage.save("selectedCountry", pickedCountry);
        localStorage.save("selectedState", pickedState);
        localStorage.save("selectedCity", pickedCity);

        setGraphData({ labels, datasets });
    };

    useEffect(onChangeSelectedCity, [pickedCity]);

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
            <Bar data={graphData} options={graphOptions}/>
            <p className="x-label">Cities</p>
        </div>
    </div>);
};

export default Body;
