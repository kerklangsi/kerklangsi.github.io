// vibration.js
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { app } from './firebase-init.js';

const db = getDatabase(app);
const vibrationRef = ref(db, "Vibrating");

function updateVibration(value) {
  const card = document.getElementById("vibrationCard");
  if (card) {
    card.innerHTML = `
      <h3>Vibration</h3>
      <p>${value === true || value === "true" ? "Detected" : "None"}</p>
    `;
  }
}

onValue(vibrationRef, (snapshot) => {
  const value = snapshot.val();
  if (value !== null) {
    updateVibration(value);
  }
});
