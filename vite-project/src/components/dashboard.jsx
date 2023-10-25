import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { Navigate } from 'react-router-dom';
import { FriendsList } from './dashboardComponents/friendsList';

export const Dashboard = () => {

    const auth = getAuth();
    const user = auth.currentUser;
    if (user !== null) {
    // The user object has basic properties such as display name, email, etc.
        const displayName = user.displayName;
        const email = user.email;

        // The user's ID, unique to the Firebase project. Do NOT use
        // this value to authenticate with your backend server, if
        // you have one. Use User.getToken() instead.
        const uid = user.uid;

        return (
            <>
                <FriendsList/>
            </>
        );
    }
    else {
        console.log("no user")
        return (
            <>
                <Navigate to={"/"}/>
            </>
        );
    }

}