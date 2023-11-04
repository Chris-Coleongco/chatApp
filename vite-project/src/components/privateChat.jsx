import { Navigate, useLoaderData, useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import { getFirestore, collection, onSnapshot, doc, getDoc, getDocs, query, where, updateDoc, addDoc, QuerySnapshot, setDoc, deleteField, deleteDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { setDefaultEventParameters } from 'firebase/analytics';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
// ! import { getStorage, ref } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyAjZvIcX0bRqNWEM-jwZtQ-EWFEX3HICe8",
    authDomain: "reactfire-bd1e8.firebaseapp.com",
    projectId: "reactfire-bd1e8",
    storageBucket: "reactfire-bd1e8.appspot.com",
    messagingSenderId: "741275514275",
    appId: "1:741275514275:web:bcd112476ae1f91839d616",
    measurementId: "G-97L48GKY1E"
  };

const firebase = initializeApp(firebaseConfig);
const db = getFirestore(firebase);
const auth = getAuth();

const userUID = { UID : null }

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('user is currently logged in');
        console.log(user)
        userUID.UID = user.uid
        console.log(userUID)
    } else {
        console.log('no user');
    }
});


export const PrivateChat = () => {

    const auth = getAuth();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [userUID, setUserUID] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    const { chatID } = useParams()

    // ! THIS IS WHERE YOU PUT THE PRIVATE CHAT RETRIEVAL CODE FROM FIREBASE TO PUT IN COMPONENT
    //! TAKE THE USER UID THEN CD INTO chats IN THE USERSDOC THEN  USE URL PARAM {chatID} TO RETRIEVE DATA FROM FIREBASE

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
                <div className="chat">
                    <h2>{ chatID }</h2>
                </div>
                </>

            );
            
    }

}