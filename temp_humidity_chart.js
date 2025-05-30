import { db } from './firebase-init.js';
import { ref, onValue } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

const ctxTempHumi = document.getElementById('tempHumiChart').getContext('2d');
let allData = JSON.parse(localStorage.getItem('tempHumiData')) || [];
let ChartTempHumi;
let timeRangeTempHumi = 'max';

function saveData() {
  localStorage.setItem('tempHumiData', JSON.stringify(allData));
}

function aggregate(data, interval) {
  if (data.length === 0) return { labels: [], temps: [], humis: [] };
  const labels = [], tempAvgs = [], humiAvgs = [];
  let bucketStart = data[0].time, tSum = 0, hSum = 0, count = 0;
  for (const point of data) {
    if (point.time < bucketStart + interval) {
      tSum += point.temp;
      hSum += point.humi;
      count++;
    } else {
      labels.push(bucketStart);
      tempAvgs.push(tSum / count);
      humiAvgs.push(hSum / count);
      bucketStart += interval * Math.floor((point.time - bucketStart) / interval);
      tSum = point.temp; hSum = point.humi; count = 1;
    }
  }
  if (count > 0) {
    labels.push(bucketStart);
    tempAvgs.push(tSum / count);
    humiAvgs.push(hSum / count);
  }
  return { labels, temps: tempAvgs, humis: humiAvgs };
}

function formatLabel(offsetMs) {
  switch (timeRangeTempHumi) {
    case 'live': return (offsetMs / 1000).toFixed(0) + 's';
    case '1h': return (offsetMs / 60000).toFixed(0) + 'm';
    case '1d': return (offsetMs / 3600000).toFixed(0) + 'h';
    case '1mo': return (offsetMs / 86400000).toFixed(0) + 'd';
    case '1y': return (offsetMs / (30 * 86400000)).toFixed(0) + 'mo';
    default: return (offsetMs / 86400000).toFixed(0) + 'd';
  }
}

function updateChartTempHumi() {
  const now = Date.now();
  const durations = {
    live: 60000,
    '1h': 3600000,
    '1d': 86400000,
    '1mo': 30 * 86400000,
    '1y': 365 * 86400000,
    max: Infinity
  };
  const intervalMap = {
    '1h': 60000,
    '1d': 3600000,
    '1mo': 86400000,
    '1y': 2592000000,
    max: 86400000
  };

  const filtered = allData.filter(p => now - p.time <= durations[timeRangeTempHumi]);
  let labels, temps, humis;

  if (timeRangeTempHumi === 'live') {
    labels = filtered.map(p => formatLabel(p.time - (now - durations[timeRangeTempHumi])));
    temps = filtered.map(p => p.temp).reverse();
    humis = filtered.map(p => p.humi).reverse();
  } else {
    const { labels: raw, temps: t, humis: h } = aggregate(filtered, intervalMap[timeRangeTempHumi]);
    labels = raw.map(t => formatLabel(t - (now - durations[timeRangeTempHumi])));
    temps = t;
    humis = h;
  }

  if (ChartTempHumi) ChartTempHumi.destroy();
  ChartTempHumi = new Chart(ctxTempHumi, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: temps,
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 2,
          fill: false
        },
        {
          label: 'Humidity (%)',
          data: humis,
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 2,
          fill: false
        }
      ]
    },
    options: {
      scales: {
        x: { title: { display: true, text: 'Time' } },
        y: { title: { display: true, text: 'Value' }, min: 0, max: 100 }
      }
    }
  });
}

document.getElementById('timeRangeTempHumi').addEventListener('change', (e) => {
  timeRangeTempHumi = e.target.value;
  updateChartTempHumi();
});

document.getElementById('resetChartTempHumi').addEventListener('click', () => {
  allData = [];
  saveData();
  updateChartTempHumi();
});

// Read temperature and humidity from Firebase
let currentTemp = null;
let currentHumi = null;

onValue(ref(db, 'temperature'), snap => {
  const val = parseFloat(snap.val());
  if (!isNaN(val)) currentTemp = val;
});

onValue(ref(db, 'humidity'), snap => {
  const val = parseFloat(snap.val());
  if (!isNaN(val)) {
    currentHumi = val;
    if (currentTemp !== null) {
      allData.push({ temp: currentTemp, humi: currentHumi, time: Date.now() });
      if (allData.length > 1000) allData.shift();
      saveData();
      updateChartTempHumi();
    }
  }
});
