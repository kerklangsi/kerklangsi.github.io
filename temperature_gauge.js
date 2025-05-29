// temperature_gauge.js
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { app } from './firebase-init.js';

const db = getDatabase(app);
const refTemp = ref(db, 'temperature');

function updateGauge(value) {
  const container = document.getElementById("temperatureCard");
  if (!container) return;

  const percentage = Math.min(Math.max(value / 100, 0), 1);
  const angle = percentage * 180;

  container.innerHTML = `
    <h3>Temperature</h3>
    <div class="gauge-wrap">
      <div class="gauge">
        <div class="needle" style="transform: rotate(${angle}deg);"></div>
        <div class="center-circle"></div>
      </div>
      <p class="gauge-value">${value} °C</p>
    </div>
  `;
}

onValue(refTemp, snapshot => {
  const value = parseFloat(snapshot.val());
  if (!isNaN(value)) updateGauge(value);
});
