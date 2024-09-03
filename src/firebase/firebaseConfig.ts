import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD6fyhPFQdGZiRDsC-Q4Dgwp5eZcYetBqI",
  authDomain: "brolympics-7368d.firebaseapp.com",
  projectId: "brolympics-7368d",
  storageBucket: "brolympics-7368d.appspot.com",
  messagingSenderId: "708202517048",
  appId: "1:708202517048:web:649cae520ccb1f46340ccd",
  measurementId: "G-PSBC27DYLG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const analytics = getAnalytics(app);

export { auth, analytics }