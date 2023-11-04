import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { getFirestore, collection, onSnapshot, doc, getDoc, getDocs, query, where, updateDoc, addDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";


const firebaseConfig = {
    apiKey: "AIzaSyAjZvIcX0bRqNWEM-jwZtQ-EWFEX3HICe8",
    authDomain: "reactfire-bd1e8.firebaseapp.com",
    projectId: "reactfire-bd1e8",
    storageBucket: "reactfire-bd1e8.appspot.com",
    messagingSenderId: "741275514275",
    appId: "1:741275514275:web:bcd112476ae1f91839d616",
    measurementId: "G-97L48GKY1E"
  };

const firebase = initializeApp(firebaseConfig);
const db = getFirestore(firebase);

//! NEED TO ADD AN ONLINE STATUS

export const SignIn = () =>  {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userSignedIn, setUserSignedIn] = useState(false);


    const signInFirebase = async (e) => {
        e.preventDefault();
        console.log(email)
        console.log(password)
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        // Signed in 
        setUserSignedIn(true);
        console.log('sign in')
        const user = userCredential.user.uid;
        //! set user status to online

        console.log(user)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode)
        console.log(errorMessage)
      });
    }
    
    console.log(userSignedIn);

    if (userSignedIn === false) {
    return (
        <>
            <form onSubmit={signInFirebase}>
                <h1>Sign In</h1>
                <input placeholder="Email" required onChange={(e) => setEmail(e.target.value)} />
                <br/>
                <input placeholder="Password" type="password" required onChange={(e) => setPassword(e.target.value)} />
                <br/>
                <button type="submit">click to log in</button>
            </form>

            <a href="/signUp">dont have an account? sign up here!</a>
        </>
    );
  }
  else {
    return (
        <>

            <Navigate to={"/dashboard"} />

        </>
 );
  }
  
}
