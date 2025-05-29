// mq4_gauge.js
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { app } from './firebase-init.js';

const db = getDatabase(app);
const mq4Ref = ref(db, "mq4PPM");

function updateMQ4Gauge(value) {
  const card = document.getElementById("mq4Card");
  if (card) {
    card.innerHTML = `
      <h3>MQ4</h3>
      <div class="gauge">
        <p class="value">${value} ppm</p>
      </div>
    `;
  }
}

onValue(mq4Ref, (snapshot) => {
  const value = snapshot.val();
  if (value !== null) {
    updateMQ4Gauge(value);
  }
});
