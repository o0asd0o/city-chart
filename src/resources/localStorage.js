const local = {
    save: (key, objectValue) => {
        localStorage.setItem(key, JSON.stringify(objectValue));
    },
    getValue: (key) => {
        return JSON.parse(localStorage.getItem(key));
    }
};

export default local;
