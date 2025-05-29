// humidity_gauge.js
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { app } from './firebase-init.js';

const db = getDatabase(app);
const refHum = ref(db, 'humidity');

function updateGauge(value) {
  const container = document.getElementById("humidityCard");
  if (!container) return;

  const percentage = Math.min(Math.max(value / 100, 0), 1);
  const angle = percentage * 180;

  container.innerHTML = `
    <h3>Humidity</h3>
    <div class="gauge-wrap">
      <div class="gauge">
        <div class="needle" style="transform: rotate(${angle}deg);"></div>
        <div class="center-circle"></div>
      </div>
      <p class="gauge-value">${value} %</p>
    </div>
  `;
}

onValue(refHum, snapshot => {
  const value = parseFloat(snapshot.val());
  if (!isNaN(value)) updateGauge(value);
});