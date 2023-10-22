import { useState } from 'react';
import { auth } from '../../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export const SignIn = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [userSignedBool, setUserSignedBool] = useState(false);

    if (userSignedBool) {
        return <Navigate to="/dashboard" />
    }

    const firebaseSignIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setUserSignedBool(true);
        } catch (err) {
            console.error(err);
        }
        
    };

    return (
        <div>
            <h1>Sign In</h1>
            <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={firebaseSignIn}>Submit</button>
        </div>
    
    );
}