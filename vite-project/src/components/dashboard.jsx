import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { Navigate } from 'react-router-dom';

const auth = getAuth;
const user = auth.currentUser;

// ! get info from current user here (friends list, circles list, profile details, etc)

export const Dashboard = () => {

    if (user == null) {
        console.log("went to sign in")
        return (
            <Navigate to="/signIn"/>
        );
    } else {
        console.log("went to dashboard")
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
            <a className="newButtonsAdded" href='/profile'>Profile (replace this later with user's name)</a>
            <a className="newButtonsAdded" href='/settings'>Settings</a>
            </div>
            </>
        );
    } 
}