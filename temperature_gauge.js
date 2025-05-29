// temperature_gauge.js
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { app } from './firebase-init.js';

const db = getDatabase(app);
const temperatureRef = ref(db, "temperature");

function updateTemperatureGauge(value) {
  const card = document.getElementById("temperatureCard");
  if (card) {
    card.innerHTML = `
      <h3>Temperature</h3>
      <div class="gauge">
        <p class="value">${value} °C</p>
      </div>
    `;
  }
}

onValue(temperatureRef, (snapshot) => {
  const value = snapshot.val();
  if (value !== null) {
    updateTemperatureGauge(value);
  }
});
