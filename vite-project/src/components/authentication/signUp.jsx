import { useState } from 'react';
import { auth } from '../../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';


export const SignUp = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [userCreatedBool, setUserCreatedBool] = useState(false);

    if (userCreatedBool) {
        return <Navigate to="signIn" />
    }

    const firebaseSignUp = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setUserCreatedBool(true);
        } catch (err) {
            console.error(err);
        }
        
    };

    return (
        <div>
            <h1>Sign Up</h1>
            <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={firebaseSignUp}>Submit</button>
        </div>
    
    );
}