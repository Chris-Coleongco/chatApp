import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Navigate } from "react-router-dom";


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
        const user = userCredential.user;
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
