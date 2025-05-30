// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAfI7T8d4HdKa6jW_NAuJ1MJrFHX2RyHZU",
  authDomain: "esp32psm.firebaseapp.com",
  databaseURL: "https://esp32psm-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "esp32psm",
  storageBucket: "esp32psm.appspot.com",
  messagingSenderId: "",
  appId: ""
};

const app = initializeApp(firebaseConfig);     // ✅ only once
const db = getDatabase(app);                   // ✅ only once

export { app, db };                            // ✅ group exports

