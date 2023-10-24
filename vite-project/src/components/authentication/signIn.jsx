import { useState } from 'react';
import { auth } from '../../config/firebase';
import { Navigate, redirect } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';

export const SignIn = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [userSignedBool, setUserSignedBool] = useState(false);

    if (userSignedBool) {
        console.log('got exect')
        return <Navigate to="/dashboard" />
    }

    const firebaseSignIn = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setUserSignedBool(true);
        } catch (err) {
            console.error(err);
        }
        
    };

    return (
        <div>
            <form onSubmit={firebaseSignIn}>
                <h1>Sign In</h1>
                <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                <br/>
                <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
                <br/>
                <button type='submit'>Submit</button>
            </form>
        </div>
    
    );
}