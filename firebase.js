import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCiF_LKfXDlAPVjlkjlTK7hBgaZZuqF1yY",
  authDomain: "quickstock-49f1f.firebaseapp.com",
  projectId: "quickstock-49f1f",
  storageBucket: "quickstock-49f1f.appspot.com",
  messagingSenderId: "912618627267",
  appId: "1:912618627267:web:6082e7c71295ce8d6f0276",
};
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };
