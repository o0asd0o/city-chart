
const defaultDataSetProp = {
    fill: false,
    borderWidth: 1,
};

const graphOptions = {
    responsive: true,
    legend: {
         display: false
    },
    tooltips: {
        callbacks: {
            label: function(tooltipItem) {
                return parseInt(tooltipItem.yLabel).toLocaleString() + " Citizens"; // to make the `hover label` dynamic
            }
        }
    }
};

const columnColors = {
    background: {
        default: "rgb(51,51,51,0.4)",
        selected: "rgb(240,98,146,0.4)",
    },
    border: {
        default: "rgb(30,30,30)",
        selected: "rgb(233,30,99)",
    }
}

export { defaultDataSetProp, graphOptions, columnColors };
