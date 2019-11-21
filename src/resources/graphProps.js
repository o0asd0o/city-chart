const defaultDataSetProp = {
    fill: false,
    borderWidth: 2,
};
const graphOptions = {
    responsive: true,
    legend: {
         display: false
    },
    tooltips: {
        callbacks: {
            label: function(tooltipItem) {
                return tooltipItem.yLabel + " Users";
            }
        }
    }
}

export { defaultDataSetProp, graphOptions };
