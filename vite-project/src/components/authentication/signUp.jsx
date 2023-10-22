import { useState } from 'react';
import { auth } from '../../config/firebase';
import { Navigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userCreatedBool, setUserCreatedBool] = useState(false);
    const [error, setError] = useState(null);

    const firebaseSignUp = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setUserCreatedBool(true);
            console.log('firebase signup executed');
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    if (userCreatedBool) {
        return <Navigate to="/signIn" />;
    }

    return (
        <div>
            <form onSubmit={firebaseSignUp}>
                <h1>Sign Up</h1>
                <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
                <button type='submit'>Submit</button>
            </form>
        </div>
    );
};
