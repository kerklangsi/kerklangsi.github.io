import { db } from './firebase-init.js';
import { ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

function createGauge(canvasId, max = 1000, color = "#66cc99") {
  const ctx = document.getElementById(canvasId).getContext("2d");
  return new Chart(ctx, {
    type: "doughnut",
    data: {
      datasets: [{
        data: [0, max],
        backgroundColor: [color, "#eee"],
        borderWidth: 0
      }]
    },
    options: {
      cutout: "70%",
      rotation: -90,
      circumference: 180,
      plugins: { legend: { display: false } }
    }
  });
}

function updateGauge(chart, value, labelId, unit = "ppm", max = 1000) {
  chart.data.datasets[0].data = [value, max - value];
  chart.update();
  document.getElementById(labelId).innerText = `${Math.round(value)} ${unit}`;
}

// Initialize all gauges
const mq2Gauge = createGauge("mq2GaugeCanvas", 1000, "#ff6f61");
const mq4Gauge = createGauge("mq4GaugeCanvas", 1000, "#ffcc00");
const mq6Gauge = createGauge("mq6GaugeCanvas", 1000, "#66cc99");
const tempGauge = createGauge("tempGaugeCanvas", 100, "#7ed6a5");
const humidityGauge = createGauge("humidityGaugeCanvas", 100, "#3498db");

// Firebase bindings
onValue(ref(db, "mq2PPM"), snap => updateGauge(mq2Gauge, snap.val(), "mq2GaugeValue"));
onValue(ref(db, "mq4PPM"), snap => updateGauge(mq4Gauge, snap.val(), "mq4GaugeValue"));
onValue(ref(db, "mq6PPM"), snap => updateGauge(mq6Gauge, snap.val(), "mq6GaugeValue"));
onValue(ref(db, "temperature"), snap => updateGauge(tempGauge, snap.val(), "tempGaugeValue", "\u00b0C", 100));
onValue(ref(db, "humidity"), snap => updateGauge(humidityGauge, snap.val(), "humidityGaugeValue", "%", 100));
onValue(ref(db, "gasType"), snap => {
  document.getElementById("gasTypeValue").innerText = (snap.val() || "Unknown").toUpperCase();
});
onValue(ref(db, "Vibrating"), snap => {
  const indicator = document.getElementById("vibrationIndicator");
  const vibrating = snap.val() === true || snap.val() === 1;
  indicator.className = `circle ${vibrating ? "green" : "red"}`;
});
onValue(ref(db, "latitude"), latSnap => {
  onValue(ref(db, "longitude"), lonSnap => {
    const lat = latSnap.val();
    const lon = lonSnap.val();
    if (lat && lon) {
      const mapURL = `https://www.google.com/maps?q=${lat},${lon}&hl=es;z=14&output=embed`;
      document.getElementById("mapFrame").src = mapURL;
    }
  });
});
