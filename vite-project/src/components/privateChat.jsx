import { Navigate, useLoaderData, useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import { getFirestore, collection, onSnapshot, doc, getDoc, getDocs, query, where, updateDoc, addDoc, QuerySnapshot, setDoc, deleteField, deleteDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { setDefaultEventParameters } from 'firebase/analytics';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { Dashboard } from "./dashboard";
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

const userUID = { uid: null }

export const PrivateChat = () => {

        //const userUID = 'aerh'

        
    const auth = getAuth();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [isLoading, setIsLoading] = useState(true);


    console.log(userUID)

    const { chatID } = useParams()

    useEffect(() => {
    
        const retrieveChatData = async () => {

            const privateChatDataDoc = await onSnapshot(doc(db, "privateMessages", chatID), (doc) => {
                const privateChatUsers = doc.data().users
                console.log(userUID)
                console.log(privateChatUsers)

                for (const x in privateChatUsers) {
                    console.log(x)
                }

                if (userUID in privateChatUsers) {
                    console.log('user is in there')
                }
                else {
                    console.log('user is NOT in there')
                }

                //setFirebaseRetrievedPrivateChatData()
    
                //console.log(privateChatData)
            })
    
            return privateChatDataDoc;
    
        }

        retrieveChatData()

    }, [])
        // ! THIS IS WHERE YOU PUT THE PRIVATE CHAT RETRIEVAL CODE FROM FIREBASE TO PUT IN COMPONENT
        //! TAKE THE USER UID THEN CD INTO chats IN THE USERSDOC THEN  USE URL PARAM {chatID} TO RETRIEVE DATA FROM FIREBASE
        //! DONT FORGET TO CHECK IF USER HAS ACCESS TO THE PRIVATE CHAT (user is one of listed members)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log('user is currently logged in');
                console.log(user)
                userUID.uid = user.uid
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
