// MQ4 Highcharts Chart from localStorage with dynamic time ranges

let allDataMQ4 = JSON.parse(localStorage.getItem('mq4Data')) || [];
let timeRangeMQ4 = '1mo';

const timeRanges = {
  live: 1 * 60 * 1000,
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

const intervalMap = {
  '10m': 10 * 1000,
  '30m': 30 * 1000,
  '1h': 60 * 1000,
  '6h': 5 * 60 * 1000,
  '12h': 10 * 60 * 1000,
  '1d': 15 * 60 * 1000,
  '1w': 30 * 60 * 1000,
  '2w': 60 * 60 * 1000,
  '1mo': 2 * 60 * 60 * 1000
};

function aggregateData(data, interval) {
  if (data.length === 0) return [];
  const buckets = [];
  let bucketStart = data[0].time;
  let sum = 0, count = 0;

  for (const point of data) {
    if (point.time < bucketStart + interval) {
      sum += point.value;
      count++;
    } else {
      buckets.push([bucketStart, sum / count]);
      bucketStart += interval * Math.floor((point.time - bucketStart) / interval);
      sum = point.value;
      count = 1;
    }
  }
  if (count > 0) buckets.push([bucketStart, sum / count]);
  return buckets;
}

function updateMQ4Chart() {
  const now = Date.now();
  const duration = timeRanges[timeRangeMQ4];
  const interval = intervalMap[timeRangeMQ4];

  const filtered = allDataMQ4.filter(p => now - p.time <= duration);

  let points;
  if (timeRangeMQ4 === 'live') {
    points = filtered.map(p => [p.time, p.value]);
  } else {
    points = aggregateData(filtered, interval);
  }

  Highcharts.chart('mq4Chart', {
    chart: { type: 'spline' },
    title: { text: 'MQ4 PPM Sensor Data' },
    xAxis: {
      type: 'datetime',
      title: { text: 'Time' }
    },
    yAxis: {
      title: { text: 'PPM' },
      min: 0,
      max: 1000
    },
    tooltip: {
      xDateFormat: '%Y-%m-%d %H:%M:%S',
      valueSuffix: ' PPM'
    },
    series: [{
      name: 'MQ4 PPM',
      data: points
    }]
  });
}

document.getElementById('timeRangeMQ4').addEventListener('change', (e) => {
  timeRangeMQ4 = e.target.value;
  updateMQ4Chart();
});

document.getElementById('resetChartMQ4').addEventListener('click', () => {
  allDataMQ4 = [];
  localStorage.setItem('mq4Data', JSON.stringify([]));
  updateMQ4Chart();
});

setInterval(() => {
  allDataMQ4 = JSON.parse(localStorage.getItem('mq4Data')) || [];
  updateMQ4Chart();
}, 1000); // update every 5 seconds
