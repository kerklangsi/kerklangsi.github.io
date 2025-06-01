// data_collector.js
import { db } from './firebase-init.js';
import { ref, onValue } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js';

function pushToStorage(key, newEntry) {
  let existing = JSON.parse(localStorage.getItem(key)) || [];
  existing.push(newEntry);
  localStorage.setItem(key, JSON.stringify(existing));
}

onValue(ref(db, 'mq2PPM'), snap => {
  const val = snap.val();
  if (val && val.value !== undefined && val.time !== undefined) {
    pushToStorage('mq2Data', { value: parseFloat(val.value), time: parseInt(val.time) });
  }
});

onValue(ref(db, 'mq4PPM'), snap => {
  const val = snap.val();
  if (val && val.value !== undefined && val.time !== undefined) {
    pushToStorage('mq4Data', { value: parseFloat(val.value), time: parseInt(val.time) });
  }
});

onValue(ref(db, 'mq6PPM'), snap => {
  const val = snap.val();
  if (val && val.value !== undefined && val.time !== undefined) {
    pushToStorage('mq6Data', { value: parseFloat(val.value), time: parseInt(val.time) });
  }
});

let tempHumiData = {};

onValue(ref(db, 'temperature'), snap => {
  const val = snap.val();
  if (val && val.value !== undefined && val.time !== undefined) {
    tempHumiData.temp = parseFloat(val.value);
    tempHumiData.time = parseInt(val.time);
  }
});

onValue(ref(db, 'humidity'), snap => {
  const val = snap.val();
  if (val && val.value !== undefined) {
    tempHumiData.humi = parseFloat(val.value);
  }

  if ('temp' in tempHumiData && 'time' in tempHumiData && 'humi' in tempHumiData) {
    pushToStorage('tempHumiData', { ...tempHumiData });
    tempHumiData = {}; // clear after saving
  }
});
