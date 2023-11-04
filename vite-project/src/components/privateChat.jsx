import { Navigate, useLoaderData, useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import { getFirestore, collection, onSnapshot, doc, getDoc, getDocs, query, orderBy, limit, startAfter, where, updateDoc, addDoc, QuerySnapshot, setDoc, deleteField, deleteDoc, DocumentSnapshot } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { setDefaultEventParameters } from 'firebase/analytics';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { Dashboard } from "./dashboard";
import { getDefaultLocale } from "react-datepicker";
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

const PAGE_SIZE = 20

const userUID = { uid: null }

export const PrivateChat = () => {

        //const userUID = 'aerh'

        
    const auth = getAuth();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    const [userHasChatAccess, setUserHasChatAccess] = useState(false)

    const [userChatData, setUserChatData] = useState([])

    console.log(userUID)

    const { chatID } = useParams()
    // ! WRAP THIS SO IT ACTIVATES ON CHANGE OF THE PRIVATE CHAT DATA

    const messagesRef = collection(doc(db, 'privateMessages', chatID), 'messages')

    useEffect(() => {
        const fetchChatData = async () => {
    
            const unsubscribe = onSnapshot(query(messagesRef, orderBy('timestamp')), (snapshot) => {
                snapshot.forEach((doc) => {
                    console.log(doc.id, ' => ', doc.data());
                  });
            })
    
            return unsubscribe;
        }
        
        fetchChatData();

    }, [messagesRef])
/*const chatId = 'chat1';
const messagesRef = collection(doc(db, 'privateMessages', chatId), 'messages');

const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
    snapshot.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data());
    });
});*/ 

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
    


    useEffect(() => {
        console.log(userChatData);
        
        console.log(userHasChatAccess);
    }, [userChatData, userHasChatAccess]);

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
                    /*THIS ISNT WORKING CUZ THE DATA IS A TWO DICTIONARY DATATYPE. */
                </div>
                </>
                /* {userChatData && 
                    Object.keys(userChatData).map((data, index) => (
                        <div key={index}>
                            <h5>{userChatData[data]}</h5>
                            <button value={userChatData[data]}>Accept</button>
                        </div>
                    ))    
                } */ 
            );
    }

    
}
