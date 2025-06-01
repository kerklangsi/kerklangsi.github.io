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

onValue(ref(db, 'temperature'), snap => {
  const val = snap.val();
  if (val && val.value !== undefined && val.time !== undefined) {
    pushToStorage('temperatureData', { value: parseFloat(val.value), time: parseInt(val.time) });
  }
});

onValue(ref(db, 'humidity'), snap => {
  const val = snap.val();
  if (val && val.value !== undefined && val.time !== undefined) {
    pushToStorage('humidityData', { value: parseFloat(val.value), time: parseInt(val.time) });
  }
});

onValue(ref(db, 'Vibrating'), snap => {
  const val = snap.val();
  pushToStorage('vibrationData', { value: val, time: Date.now() });
});

onValue(ref(db, 'gastype'), snap => {
  const val = snap.val();
  pushToStorage('gastypeData', { value: val, time: Date.now() });
});

onValue(ref(db, 'latitude'), snap => {
  const val = snap.val();
  pushToStorage('latitudeData', { value: parseFloat(val), time: Date.now() });
});

onValue(ref(db, 'longitude'), snap => {
  const val = snap.val();
  pushToStorage('longitudeData', { value: parseFloat(val), time: Date.now() });
});
