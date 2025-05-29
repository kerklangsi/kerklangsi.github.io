// mq6_gauge.js
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { app } from './firebase-init.js';

const db = getDatabase(app);
const mq6Ref = ref(db, "mq6PPM");

function updateMQ6Gauge(value) {
  const card = document.getElementById("mq6Card");
  if (card) {
    card.innerHTML = `
      <h3>MQ6</h3>
      <div class="gauge">
        <p class="value">${value} ppm</p>
      </div>
    `;
  }
}

onValue(mq6Ref, (snapshot) => {
  const value = snapshot.val();
  if (value !== null) {
    updateMQ6Gauge(value);
  }
});
