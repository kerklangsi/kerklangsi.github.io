// MQ6 Highcharts Chart from localStorage with dynamic time ranges

let allDataMQ6 = JSON.parse(localStorage.getItem('mq6Data')) || [];
let timeRangeMQ6 = '1mo';

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

function updateMQ6Chart() {
  const now = Date.now();
  const duration = timeRanges[timeRangeMQ6];
  const interval = intervalMap[timeRangeMQ6];

  const filtered = allDataMQ6.filter(p => now - p.time <= duration);

  let points;
  if (timeRangeMQ6 === 'live') {
    points = filtered.map(p => [p.time, p.value]);
  } else {
    points = aggregateData(filtered, interval);
  }

  Highcharts.chart('mq6Chart', {
    chart: { type: 'spline' },
    title: { text: 'MQ6 PPM Sensor Data' },
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
      name: 'MQ6 PPM',
      data: points
    }]
  });
}

document.getElementById('timeRangeMQ6').addEventListener('change', (e) => {
  timeRangeMQ6 = e.target.value;
  updateMQ6Chart();
});

document.getElementById('resetChartMQ6').addEventListener('click', () => {
  allDataMQ6 = [];
  localStorage.setItem('mq6Data', JSON.stringify([]));
  updateMQ6Chart();
});

updateMQ6Chart();
