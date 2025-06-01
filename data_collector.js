import { db } from './firebase-init.js';
import { ref, onValue } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

function pushToStorage(key, newEntry) {
  const data = JSON.parse(localStorage.getItem(key)) || [];
  data.push(newEntry);
  if (data.length > 1000) data.shift();
  localStorage.setItem(key, JSON.stringify(data));
}

// MQ2
onValue(ref(db, 'mq2PPM'), snap => {
  const val = parseFloat(snap.val());
  if (!isNaN(val)) pushToStorage('mq2Data', { value: val, time: Date.now() });
});

// MQ4
onValue(ref(db, 'mq4PPM'), snap => {
  const val = parseFloat(snap.val());
  if (!isNaN(val)) pushToStorage('mq4Data', { value: val, time: Date.now() });
});

// MQ6
onValue(ref(db, 'mq6PPM'), snap => {
  const val = parseFloat(snap.val());
  if (!isNaN(val)) pushToStorage('mq6Data', { value: val, time: Date.now() });
});

// TEMP & HUMI
let currentTemp = null;
onValue(ref(db, 'temperature'), snap => {
  const val = parseFloat(snap.val());
  if (!isNaN(val)) currentTemp = val;
});

onValue(ref(db, 'humidity'), snap => {
  const val = parseFloat(snap.val());
  if (!isNaN(val) && currentTemp !== null) {
    pushToStorage('tempHumiData', { temp: currentTemp, humi: val, time: Date.now() });
    currentTemp = null;
  }
});
