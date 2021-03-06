let wasteChart = new Chart($('#wasteChart') ,{
    type: 'bar',
    data: {
        labels: ['Waste Fill'],
        datasets:[{
            label: 'Waste height %',
            data: [0],
            backgroundColor: ['rgba(75, 192, 110, .5)'],
            borderColor: ['rgba(75, 192, 110, 1)'],
            borderWidth: 2
        }]
    },
    options: {
        scales: {
            yAxes: [{
                gridLines :{display: false},
                ticks: {
                    beginAtZero:true,
                    max: 100
                }
            }],
            xAxes: [{gridLines: {display: false}, barPercentage: 1, categoryPercentage: .9}]
            
        }
    }
});

let humidChart = new Chart($('#humidChart'), {
    type: 'doughnut',
    data: {
        datasets: [{
            label: 'Humidity %',
            data: [0, 100],
            backgroundColor:['rgba(54, 162, 235, 0.2)'],
            borderColor:['rgba(54, 162, 235)', 'rgba(54, 162, 235)']
        }],
        labels: ['Humidity']
    },
    options: {
    }
});