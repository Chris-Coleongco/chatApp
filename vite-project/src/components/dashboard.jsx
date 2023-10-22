import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { Navigate } from 'react-router-dom';

const auth = getAuth;
const user = auth.currentUser;

export const Dashboard = () => {

    if (user === null) {
        return (
            <Navigate to="/signIn"/>
        );
    } else {
        return (
            <>
    
            <div>
    
            <h1>Dashboard</h1>
    
            <a href='signUp'>click here to sign up</a>
            <br/>
            <a href='signIn'>click here to sign in</a>
            <br/>
             show friend list in Dashboard
             New DMs get shown somehwere
            <a className="newButtonsAdded" href='/explore'>Explore</a>
            <a className="newButtonsAdded" href='/settings'>Settings</a>
    
            </div>
    
            
    
            </>
        );
    } 
}