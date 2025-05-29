// location.js
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { app } from './firebase-init.js';

const db = getDatabase(app);
const latRef = ref(db, "latitude");
const lngRef = ref(db, "longitude");

let latitude = null;
let longitude = null;

function updateLocationCard() {
  const card = document.getElementById("locationCard");
  if (card && latitude !== null && longitude !== null) {
    card.innerHTML = `
      <h3>GPS Location</h3>
      <p>Lat: ${latitude}</p>
      <p>Lng: ${longitude}</p>
      <iframe
        width="100%"
        height="300"
        frameborder="0"
        style="border:0; margin-top: 10px;"
        src="https://maps.google.com/maps?q=${latitude},${longitude}&hl=es;z=14&output=embed"
        allowfullscreen>
      </iframe>
    `;
  }
}


onValue(latRef, (snapshot) => {
  const val = snapshot.val();
  if (val !== null) {
    latitude = val;
    updateLocationCard();
  }
});

onValue(lngRef, (snapshot) => {
  const val = snapshot.val();
  if (val !== null) {
    longitude = val;
    updateLocationCard();
  }
});
