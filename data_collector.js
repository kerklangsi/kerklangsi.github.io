// data_collector.js
import { db } from './firebase-init.js';
import { ref, onValue } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js';

function pushToStorage(key, newEntry) {
  let existing = JSON.parse(localStorage.getItem(key)) || [];
  existing.push(newEntry);
  localStorage.setItem(key, JSON.stringify(existing));
}

let currentTime = null;

onValue(ref(db, 'time'), snap => {
  const val = snap.val();
  if (val !== null && !isNaN(val)) {
    currentTime = parseInt(val);
  }
});

function pushWithTime(key, value) {
  if (currentTime !== null) {
    pushToStorage(key, { value: parseFloat(value), time: currentTime });
  }
}

onValue(ref(db, 'mq2PPM'), snap => {
  const val = snap.val();
  if (val !== null && !isNaN(val)) pushWithTime('mq2Data', val);
});

onValue(ref(db, 'mq4PPM'), snap => {
  const val = snap.val();
  if (val !== null && !isNaN(val)) pushWithTime('mq4Data', val);
});

onValue(ref(db, 'mq6PPM'), snap => {
  const val = snap.val();
  if (val !== null && !isNaN(val)) pushWithTime('mq6Data', val);
});

let tempHumiData = {};

onValue(ref(db, 'temperature'), snap => {
  const val = snap.val();
  if (val !== null && !isNaN(val)) {
    tempHumiData.temp = parseFloat(val);
  }
});

onValue(ref(db, 'humidity'), snap => {
  const val = snap.val();
  if (val !== null && !isNaN(val)) {
    tempHumiData.humi = parseFloat(val);
  }

  if ('temp' in tempHumiData && 'humi' in tempHumiData && currentTime !== null) {
    pushToStorage('tempHumiData', { ...tempHumiData, time: currentTime });
    tempHumiData = {};
  }
});
