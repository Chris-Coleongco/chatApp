import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { FriendsList } from './dashboardComponents/friendRelated/friendsList';
import { Link, Navigate, redirect, useParams } from "react-router-dom";
import { FaBuffer, FaHome, FaPhone, FaUserFriends } from 'react-icons/fa'
import { SideBar } from "./privateChatComponents/sidebar";

export const Dashboard = () => {

    const auth = getAuth();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [userUID, setUserUID] = useState(null);

    const [isLoading, setIsLoading] = useState(true);


    

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log('user is currently logged in');
                console.log(user)
                setUserUID(user.uid)
                setIsAuthenticated(true);
            } else {
                console.log('no user');
            }
            setIsLoading(false);
        });
        return unsubscribe;
    }, [auth]);

    if (isLoading) {
        return <p>Loading...</p>; // Display a loading indicator while checking the authentication state
    }

    if (!isAuthenticated) {
        
        return (
            <Navigate to={'/'} />
        );

    } else {
        console.log(userUID)
        console.log(typeof userUID)
        return (
            
            <>
                <SideBar u={userUID}/>
                <FriendsList userUID={userUID}/>
                
            </>
            
        
        );
    }
};