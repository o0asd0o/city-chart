const toTitleCase = (value) => {
    return value.split(" ")
        .map(string => string[0].toUpperCase() + string.substr(1).toLowerCase())
        .join(" ");
};

export { toTitleCase };
