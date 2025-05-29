// mq2_gauge.js
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { app } from './firebase-init.js';

const db = getDatabase(app);
const mq2Ref = ref(db, "mq2PPM");

function updateMQ2Gauge(value) {
  const card = document.getElementById("mq2Card");
  if (card) {
    card.innerHTML = `
      <h3>MQ2</h3>
      <div class="gauge">
        <p class="value">${value} ppm</p>
      </div>
    `;
  }
}

onValue(mq2Ref, (snapshot) => {
  const value = snapshot.val();
  if (value !== null) {
    updateMQ2Gauge(value);
  }
});
