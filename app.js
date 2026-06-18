import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔥 Firebase config (PASTE YOURS HERE)
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginBox = document.getElementById("loginBox");
const appDiv = document.getElementById("app");

window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await signInWithEmailAndPassword(auth, email, password);
};

window.logout = function () {
  signOut(auth);
};

onAuthStateChanged(auth, user => {
  if (user) {
    loginBox.style.display = "none";
    appDiv.style.display = "block";
    loadData();
  } else {
    loginBox.style.display = "block";
    appDiv.style.display = "none";
  }
});

window.addTransaction = async function () {
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const note = document.getElementById("note").value;

  await addDoc(collection(db, "transactions"), {
    amount: Number(amount),
    category,
    note,
    date: new Date().toISOString()
  });

  loadData();
};

async function loadData() {
  const snap = await getDocs(collection(db, "transactions"));

  let totals = {};

  snap.forEach(doc => {
    const data = doc.data();
    totals[data.category] = (totals[data.category] || 0) + data.amount;
  });

  const budgetList = document.getElementById("budgetList");
  budgetList.innerHTML = "";

  for (let cat in totals) {
    budgetList.innerHTML += `
      <div class="category">
        <b>${cat}</b>: $${totals[cat].toFixed(2)}
      </div>
    `;
  }
}
