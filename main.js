// main.js
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { app } from './firebase-init.js';

const db = getDatabase(app);

function subscribe(path, callback) {
  const dbRef = ref(db, path);
  onValue(dbRef, (snapshot) => {
    const value = snapshot.val();
    if (value !== null) callback(value);
  });
}

// Update functions for each gauge/card
document.addEventListener("DOMContentLoaded", () => {
  subscribe("temperature", val => document.getElementById("temperatureCard").innerHTML = `<h3>Temperature</h3><p>${val} °C</p>`);
  subscribe("humidity", val => document.getElementById("humidityCard").innerHTML = `<h3>Humidity</h3><p>${val} %</p>`);
  subscribe("mq2PPM", val => document.getElementById("mq2Card").innerHTML = `<h3>MQ2</h3><p>${val} ppm</p>`);
  subscribe("mq4PPM", val => document.getElementById("mq4Card").innerHTML = `<h3>MQ4</h3><p>${val} ppm</p>`);
  subscribe("mq6PPM", val => document.getElementById("mq6Card").innerHTML = `<h3>MQ6</h3><p>${val} ppm</p>`);
  subscribe("Vibrating", val => document.getElementById("vibrationCard").innerHTML = `<h3>Vibration</h3><p>${val ? "Detected" : "None"}</p>`);
  subscribe("gastype", val => document.getElementById("gasTypeCard").innerHTML = `<h3>Gas Type</h3><p>${val}</p>`);
  subscribe("latitude", lat => {
    subscribe("longitude", lng => {
      document.getElementById("locationCard").innerHTML = `<h3>GPS Location</h3><p>Lat: ${lat}, Lng: ${lng}</p>`;
    });
  });
});
