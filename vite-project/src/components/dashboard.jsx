import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { Navigate } from 'react-router-dom';
import { FriendsList } from './dashboardComponents/friendRelated/friendsList';
import { Settings } from './dashboardComponents/settings';

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
                <FriendsList userUID={userUID}/>

                //! ADD COMPONENT FOR PRIVATE / SERVER CHATS THAT IS CONDITIONAL (IF USER CLICKS ON A CHAT / SERVER THEN RENDER THE COMPONENT. IF NOT THEN DONT RENDER)
            
                <Settings/>
                
            </>
            
        
        );
    }
};
