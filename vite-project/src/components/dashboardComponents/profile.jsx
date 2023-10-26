import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { Navigate } from 'react-router-dom';

const auth = getAuth;
const user = auth.currentUser;


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
            <h1>Profile</h1>
            <br/>

            <h3>INSERT INFO RETRIEVED ON SIGNUP HERE</h3>
            <h3>About Me</h3>
            </div>
            </>
        );
    } 
}