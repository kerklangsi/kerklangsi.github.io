// gas_type.js
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { app } from './firebase-init.js';

const db = getDatabase(app);
const gasTypeRef = ref(db, "gastype");

function updateGasType(value) {
  const card = document.getElementById("gasTypeCard");
  if (card) {
    card.innerHTML = `
      <h3>Gas Type</h3>
      <p>${value}</p>
    `;
  }
}

onValue(gasTypeRef, (snapshot) => {
  const value = snapshot.val();
  if (value !== null) {
    updateGasType(value);
  }
});
