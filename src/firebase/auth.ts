import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged
} from "firebase/auth";
import { app } from "./config";

export const auth = getAuth(app);

// ✅ 🔥 FORZAR PERSISTENCIA
setPersistence(auth, browserLocalPersistence);

const provider = new GoogleAuthProvider();
provider.addScope("email");


export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  console.log("POPUP RESULT:", result.user); // 🔥
};


export const logout = async () => {
  await signOut(auth);
};

export const subscribeAuth = (callback: any) => {
  return onAuthStateChanged(auth, (firebaseUser) => {
    console.log("FIREBASE RAW USER:", firebaseUser);

    if (!firebaseUser) {
      callback(null);
      return;
    }

    callback({
      id: firebaseUser.uid,
      email: firebaseUser.email ?? "",
      name: firebaseUser.displayName ?? "",
      photoURL: firebaseUser.photoURL ?? "",
    });
  });
};