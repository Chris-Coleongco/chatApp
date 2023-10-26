import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Navigate } from 'react-router-dom';
import { FriendsList } from './dashboardComponents/friendRelated/friendsList';

export const Dashboard = () => {
    const auth = getAuth();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log('user is currently logged in');
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
        return <Navigate to={'/'} />;
    } else {
        return <FriendsList />;
    }
};
