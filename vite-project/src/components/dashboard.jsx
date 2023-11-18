import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { FriendsList } from './dashboardComponents/friendRelated/friendsList';
import { Settings } from './dashboardComponents/settings';
import { Link, Navigate, redirect, useParams } from "react-router-dom";
import { FaBuffer, FaHome, FaPhone, FaUserFriends } from 'react-icons/fa'

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

        return (
            
            <>
                <SideBar/>
                <FriendsList userUID={userUID}/>

                //! ADD COMPONENT FOR PRIVATE / SERVER CHATS THAT IS CONDITIONAL (IF USER CLICKS ON A CHAT / SERVER THEN RENDER THE COMPONENT. IF NOT THEN DONT RENDER)
            
                <Settings/>
                
            </>
            
        
        );
    }
};

export const SideBar = () => (
    <div className="fixed top-0 left-0 h-screen w-16 m-0 flex flex-col bg-violet-950 text-white shadow-lg">
        <Link className="text-black text-xs text-center p-6 rounded-full mt-3 mb-3" to={'/dashboard'}><FaHome/></Link>
        <Link className="text-black text-xs text-center p-6 rounded-full mb-3"><FaUserFriends/></Link>
    </div>

);