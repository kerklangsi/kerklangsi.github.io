// humidity_gauge.js
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { app } from './firebase-init.js';

const db = getDatabase(app);
const humidityRef = ref(db, "humidity");

function updateHumidityGauge(value) {
  const card = document.getElementById("humidityCard");
  if (card) {
    card.innerHTML = `
      <h3>Humidity</h3>
      <div class="gauge">
        <p class="value">${value} %</p>
      </div>
    `;
  }
}

onValue(humidityRef, (snapshot) => {
  const value = snapshot.val();
  if (value !== null) {
    updateHumidityGauge(value);
  }
});
