// Temperature & Humidity Highcharts Chart from localStorage with dynamic time ranges

let allData = JSON.parse(localStorage.getItem('tempHumiData')) || [];
let timeRangeTempHumi = '1mo';

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

function aggregate(data, interval) {
  if (data.length === 0) return { tempPoints: [], humiPoints: [] };
  const tempPoints = [], humiPoints = [];
  let bucketStart = data[0].time;
  let tSum = 0, hSum = 0, count = 0;

  for (const point of data) {
    if (point.time < bucketStart + interval) {
      tSum += point.temp;
      hSum += point.humi;
      count++;
    } else {
      tempPoints.push([bucketStart, tSum / count]);
      humiPoints.push([bucketStart, hSum / count]);
      bucketStart += interval * Math.floor((point.time - bucketStart) / interval);
      tSum = point.temp; hSum = point.humi; count = 1;
    }
  }
  if (count > 0) {
    tempPoints.push([bucketStart, tSum / count]);
    humiPoints.push([bucketStart, hSum / count]);
  }
  return { tempPoints, humiPoints };
}

function updateChartTempHumi() {
  const now = Date.now();
  const duration = timeRanges[timeRangeTempHumi];
  const interval = intervalMap[timeRangeTempHumi];

  const filtered = allData.filter(p => now - p.time <= duration);

  let tempPoints = [], humiPoints = [];
  if (timeRangeTempHumi === 'live') {
    tempPoints = filtered.map(p => [p.time, p.temp]);
    humiPoints = filtered.map(p => [p.time, p.humi]);
  } else {
    const result = aggregate(filtered, interval);
    tempPoints = result.tempPoints;
    humiPoints = result.humiPoints;
  }

  Highcharts.chart('tempHumiChart', {
    chart: { type: 'spline' },
    title: { text: 'Temperature & Humidity Data' },
    xAxis: {
      type: 'datetime',
      title: { text: 'Time' }
    },
    yAxis: {
      title: { text: 'Value' },
      min: 0,
      max: 100
    },
    tooltip: {
      shared: true,
      xDateFormat: '%Y-%m-%d %H:%M:%S'
    },
    series: [
      {
        name: 'Temperature (°C)',
        data: tempPoints,
        color: 'rgba(255, 99, 132, 1)'
      },
      {
        name: 'Humidity (%)',
        data: humiPoints,
        color: 'rgba(54, 162, 235, 1)'
      }
    ]
  });
}

document.getElementById('timeRangeTempHumi').addEventListener('change', (e) => {
  timeRangeTempHumi = e.target.value;
  updateChartTempHumi();
});

document.getElementById('resetChartTempHumi').addEventListener('click', () => {
  allData = [];
  localStorage.setItem('tempHumiData', JSON.stringify([]));
  updateChartTempHumi();
});

updateChartTempHumi();
