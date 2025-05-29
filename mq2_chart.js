import { db } from './firebase-init.js';
import { ref, onValue } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

const ctxMQ2 = document.getElementById('mq2Chart').getContext('2d');
let allDataMQ2 = JSON.parse(localStorage.getItem('mq2Data')) || [];
let chartMQ2;
let timeRangeMQ2 = 'max';

function saveMQ2() {
  localStorage.setItem('mq2Data', JSON.stringify(allDataMQ2));
}

function aggregateData(data, interval) {
  if (data.length === 0) return { labels: [], values: [] };
  const buckets = [], labels = [];
  let bucketStart = data[0].time, sum = 0, count = 0;
  for (const point of data) {
    if (point.time < bucketStart + interval) {
      sum += point.value; count++;
    } else {
      labels.push(bucketStart);
      buckets.push(sum / count);
      bucketStart += interval * Math.floor((point.time - bucketStart) / interval);
      sum = point.value; count = 1;
    }
  }
  if (count > 0) {
    labels.push(bucketStart);
    buckets.push(sum / count);
  }
  return { labels, values: buckets };
}

function formatLabel(offsetMs) {
  switch (timeRangeMQ2) {
    case 'live': return (offsetMs / 1000).toFixed(0) + 's';
    case '1h': return (offsetMs / 60000).toFixed(0) + 'm';
    case '1d': return (offsetMs / 3600000).toFixed(0) + 'h';
    case '1mo': return (offsetMs / 86400000).toFixed(0) + 'd';
    case '1y': return (offsetMs / (30 * 86400000)).toFixed(0) + 'mo';
    default: return (offsetMs / 86400000).toFixed(0) + 'd';
  }
}

function updateMQ2Chart() {
  const now = Date.now();
  const durations = {
    live: 60 * 1000,
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

  let filtered = allDataMQ2.filter(p => now - p.time <= durations[timeRangeMQ2]);
  let labels, values;

  if (timeRangeMQ2 === 'live') {
    labels = filtered.map(p => formatLabel(p.time - (now - durations[timeRangeMQ2])));
    values = filtered.map(p => p.value);
  } else {
    const { labels: raw, values: val } = aggregateData(filtered, intervalMap[timeRangeMQ2]);
    labels = raw.map(t => formatLabel(t - (now - durations[timeRangeMQ2])));
    values = val;
  }

  if (chartMQ2) chartMQ2.destroy();
  chartMQ2 = new Chart(ctxMQ2, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'MQ2 PPM',
        data: values,
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 2,
        fill: false
      }]
    },
    options: {
      scales: {
        x: { title: { display: true, text: 'Time' } },
        y: { title: { display: true, text: 'PPM' }, min: 0, max: 1000 }
      }
    }
  });
}

document.getElementById('timeRangeMQ2').addEventListener('change', (e) => {
  timeRangeMQ2 = e.target.value;
  updateMQ2Chart();
});

document.getElementById('resetChartMQ2').addEventListener('click', () => {
  allDataMQ2 = [];
  saveMQ2();
  updateMQ2Chart();
});

onValue(ref(db, 'mq2PPM'), snap => {
  const val = parseFloat(snap.val());
  if (!isNaN(val)) {
    allDataMQ2.push({ value: val, time: Date.now() });
    if (allDataMQ2.length > 1000) allDataMQ2.shift();
    saveMQ2();
    updateMQ2Chart();
  }
});
