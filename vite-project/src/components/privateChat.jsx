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

const PAGE_SIZE = 1

const userUID = { uid: null }

export const PrivateChat = () => {

        //const userUID = 'aerh'

        
    const auth = getAuth();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingChatData, setIsFetchingChatData] = useState(false);

    const [userHasChatAccess, setUserHasChatAccess] = useState(false)

    const [userChatData, setUserChatData] = useState([])

    console.log(userUID)

    const { chatID } = useParams()
    // ! WRAP THIS SO IT ACTIVATES ON CHANGE OF THE PRIVATE CHAT DATA

    

    const [lastVisible, setLastVisible] = useState(null)

    //////////////////////////////////////////////////
    const fetchChatData = async () => {

        setIsFetchingChatData(true)
        
        const messagesDocRef = doc(db, 'privateMessages', chatID)

        const messagesRef = collection(messagesDocRef, 'messages')

        const messagesDocUsers = (await getDoc(messagesDocRef)).data().users

        if (userUID in messagesDocUsers) {
            console.log('user should have access')
            setUserHasChatAccess(true)
            
        } else {
            console.log('user unauthorized')
        }

        console.log(messagesDocUsers)

        let myQuery = query(messagesRef, orderBy('timestamp'), limit(PAGE_SIZE))

        if (lastVisible) {
            myQuery = query(messagesRef, orderBy('timestamp'), limit(PAGE_SIZE), startAfter(lastVisible))
        }

        const unsubscribe = onSnapshot(myQuery, (snapshot) => {
            const paginatedChats = snapshot.docs.map((doc) => doc.data())
            if ((paginatedChats.length >= PAGE_SIZE) == false) {
                console.log('no more data')
                return unsubscribe;
            } else {
                setUserChatData((retrievedChats) => [...retrievedChats, ...paginatedChats])
            }
            // needs to run 

            setLastVisible(snapshot.docs[snapshot.docs.length - 1])
            console.log(lastVisible)

            //! ONTO THIS BIT NOW 

            /*const next = query(collection(db, "cities"),
    orderBy("population"),
    startAfter(lastVisible),
    limit(25));*/
            
            //snapshot.forEach((doc) => {
             //   console.log(doc.id, ' => ', doc.data());
             // });

             setIsFetchingChatData(false)
        })
        return unsubscribe;
    }


    const paginateMagic = () => {

        if (isFetchingChatData == false) {
            fetchChatData(lastVisible);
        }

    }
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
                    <button onClick={paginateMagic}>click to see more msgs</button>
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
