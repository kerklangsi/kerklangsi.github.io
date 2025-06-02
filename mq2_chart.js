//window.addEventListener('DOMContentLoaded', () => {
  let allDataMQ2 = JSON.parse(localStorage.getItem('mq2Data')) || [];

  const chartMQ2 = Highcharts.chart('mq2Chart', {
    chart: {
      type: 'spline',
      zoomType: 'x'
    },
    title: {
      text: 'MQ2 Sensor'
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'top',
      floating: true,
      borderWidth: 1,
      backgroundColor: '#FFFFFF'
    },
    xAxis: {
      type: 'datetime'
    },
    yAxis: {
      title: {
        text: 'PPM'
      }
    },
    series: [{
      name: 'MQ2',
      data: [],
      color: '#28a745'
    }]
  });

  const timeRanges = {
    '1m': 1 * 60 * 1000,
    '10m': 10 * 60 * 1000,
    '30m': 30 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '6h': 6 * 60 * 60 * 1000,
    '12h': 12 * 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000,
    '1w': 7 * 24 * 60 * 60 * 1000,
    '2w': 14 * 24 * 60 * 60 * 1000,
    '1mo': 30 * 24 * 60 * 60 * 1000
  };

  let timeRangeMQ2 = '1m';

  function updateMQ2Chart() {
    let filtered = [];
    if (timeRangeMQ2 === 'max') {
      filtered = allDataMQ2;
    } else {
      const from = Date.now() - timeRanges[timeRangeMQ2];
      filtered = allDataMQ2.filter(d => d.time >= from);
    }
    if (chartMQ2 && chartMQ2.series[0]) {
      chartMQ2.series[0].setData(filtered.map(d => [d.time, d.value]), true);
    }
  }

  document.getElementById('timeRangeMQ2').addEventListener('change', e => {
    timeRangeMQ2 = e.target.value;
    updateMQ2Chart();
  });

  setInterval(() => {
    allDataMQ2 = JSON.parse(localStorage.getItem('mq2Data')) || [];
    updateMQ2Chart();
  }, 5000);

  updateMQ2Chart();
//});
