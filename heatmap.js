function LoadsHeatMapChart(data, labels) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Function to convert the .NET JSON date format to a JavaScript Date object
    function parseJsonDate(jsonDate) {
        var timestamp = parseInt(jsonDate.replace(/\/Date\((\d+)\)\//, '$1'));
        return new Date(timestamp);
    }

    // Parse the labels to create a date array
    const dates = labels.map(label => parseJsonDate(label));

    // Initialize the calendarData as a 2D array for each month
    const calendarData = monthNames.map(month => ({
        name: month,
        data: Array.from({ length: 31 }, () => 0) // Initialize each day of the month with 0 loads
    }));

    // Populate the calendarData with the data values
    dates.forEach((date, index) => {
        const month = date.getMonth();
        const dayOfMonth = date.getDate();

        calendarData[month].data[dayOfMonth - 1] = data[index] || 0;
    });

    // Configuration for the heatmap chart
    const options = {
        series: calendarData,
        chart: {
            type: 'heatmap',
            height: 1000,
            toolbar: {
                show: true
            }
        },
        plotOptions: {
            heatmap: {
                shadeIntensity: 1,
                enableShades: true,
                colorScale: {
                    ranges: [
                        { from: 0, to: 0, color: '#ffffff', name: 'No data' },
                        { from: 1, to: 10, color: '#85D1B5', name: '1-10 loads' },
                        { from: 11, to: 20, color: '#4CA97C', name: '11-20 loads' },
                        { from: 21, to: 30, color: '#11865B', name: '21-30 loads' }
                    ]
                }
            }
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            type: 'category',
            categories: Array.from({ length: 31 }, (_, i) => (i + 1).toString()), // Days of the month as strings
            labels: {
                style: {
                    fontSize: '12px'
                }
            }
        },
        yaxis: {
            type: 'category',
            categories: monthNames,
            labels: {
                style: {
                    fontSize: '12px'
                }
            }
        },
        title: {
            text: 'Yearly Load Counts for Driver',
            align: 'center'
        },
        tooltip: {
            custom: function({ series, seriesIndex, dataPointIndex, w }) {
                const month = monthNames[seriesIndex];
                const day = dataPointIndex + 1;
                const value = w.globals.series[seriesIndex][dataPointIndex];
                return `<div class="tooltip">${month} ${day}, ${value} loads</div>`;
            }
        },
        grid: {
            padding: {
                right: 20,
                left: 20
            }
        },
        responsive: [{
            breakpoint: 600,
            options: {
                chart: {
                    height: 800
                },
                xaxis: {
                    labels: {
                        rotate: -45
                    }
                }
            }
        }]
    };

    const driverHeatmapChart = new ApexCharts(document.querySelector("#heatmap-chart"), options);
    driverHeatmapChart.render();
}