let allDataTempHumi = JSON.parse(localStorage.getItem('tempHumiData')) || [];
let timeRangeTempHumi = '1m';

const timeRanges = {
  '1m': 1 * 60 * 1000, '10m': 10 * 60 * 1000, '30m': 30 * 60 * 1000,
  '1h': 60 * 60 * 1000, '6h': 6 * 60 * 60 * 1000, '12h': 12 * 60 * 60 * 1000,
  '1d': 24 * 60 * 60 * 1000, '1w': 7 * 24 * 60 * 60 * 1000,
  '2w': 14 * 24 * 60 * 60 * 1000, '1mo': 30 * 24 * 60 * 60 * 1000,
  'max': Infinity
};

const intervalMap = {
  '10m': 10 * 1000, '30m': 30 * 1000, '1h': 60 * 1000,
  '6h': 5 * 60 * 1000, '12h': 10 * 60 * 1000, '1d': 15 * 60 * 1000,
  '1w': 30 * 60 * 1000, '2w': 60 * 60 * 1000, '1mo': 2 * 60 * 60 * 1000
};

function aggregateTempHumi(data, interval) {
  if (!data.length) return { temp: [], humi: [] };
  const result = { temp: [], humi: [] };
  let bucketStart = data[0].time;
  let tempSum = 0, humiSum = 0, count = 0;
  for (const point of data) {
    if (point.time < bucketStart + interval) {
      tempSum += point.temp;
      humiSum += point.humi;
      count++;
    } else {
      result.temp.push([bucketStart, tempSum / count]);
      result.humi.push([bucketStart, humiSum / count]);
      bucketStart += interval * Math.floor((point.time - bucketStart) / interval);
      tempSum = point.temp;
      humiSum = point.humi;
      count = 1;
    }
  }
  if (count > 0) {
    result.temp.push([bucketStart, tempSum / count]);
    result.humi.push([bucketStart, humiSum / count]);
  }
  return result;
}

function updateTempHumiChart() {
  const now = allDataTempHumi.at(-1)?.time || Date.now();
  const duration = timeRanges[timeRangeTempHumi];
  const interval = intervalMap[timeRangeTempHumi];
  const fromTime = now - duration;

  const filtered = allDataTempHumi.filter(p =>
    timeRangeTempHumi === 'max' ? true : (p.time >= fromTime && p.time <= now)
  );

  let tempPoints, humiPoints;
  if (['1m', '10m', '30m', 'max'].includes(timeRangeTempHumi)) {
    tempPoints = filtered.map(p => [p.time, p.temp]);
    humiPoints = filtered.map(p => [p.time, p.humi]);
  } else {
    const aggregated = aggregateTempHumi(filtered, interval);
    tempPoints = aggregated.temp;
    humiPoints = aggregated.humi;
  }

  if (tempPoints.length === 0) tempPoints.push([now, 0]);
  if (humiPoints.length === 0) humiPoints.push([now, 0]);

  Highcharts.chart('tempHumiChart', {
    chart: { type: 'spline', reflow: true, spacingRight: 10 },
    title: { text: 'Temperature & Humidity' },
    xAxis: { type: 'datetime', title: { text: 'Time' }, min: fromTime, max: now },
    yAxis: { title: { text: 'Values' }, min: 0 },
    tooltip: { xDateFormat: '%Y-%m-%d %H:%M:%S' },
legend: { layout: 'vertical', align: 'right', verticalAlign: 'top', floating: true, borderWidth: 1, backgroundColor: '#FFFFFF' },
    series: [{ name: 'Temperature (°C)', data: tempPoints, color: '#f5450a' }, { name: 'Humidity (%)', data: humiPoints, color: '#1e90ff' }]
  });
}

document.getElementById('timeRangeTempHumi').addEventListener('change', e => {
  timeRangeTempHumi = e.target.value;
  updateTempHumiChart();
});

document.getElementById('resetChartTempHumi').addEventListener('click', () => {
  allDataTempHumi = [];
  localStorage.setItem('tempHumiData', JSON.stringify([]));
  updateTempHumiChart();
});

setInterval(() => {
  allDataTempHumi = JSON.parse(localStorage.getItem('tempHumiData')) || [];
  updateTempHumiChart();
}, 5000);
