import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";

const auth = getAuth();


export const Settings = () => {

    const [requestedSignOut, setRequestedSignOut] = useState(false)

    const customSignOutFunc = () => {
    signOut(auth).then(() => {
        // Sign-out successful.
        setRequestedSignOut(true)
        console.log('signed out user')
        }).catch((error) => {
        // An error happened.
        console.log(error)
        });
    }

    if (requestedSignOut == true) {
        return (

            <Navigate to={'/signIn'}/>

        );
    }

    return (

        <button onClick={customSignOutFunc}>log out</button>

    );

}