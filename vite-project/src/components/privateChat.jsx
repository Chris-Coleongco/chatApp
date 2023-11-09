import { Navigate, useLoaderData, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import { getFirestore, collection, onSnapshot, doc, getDoc, getDocs, query, orderBy, limit, startAfter, where, updateDoc, addDoc, QuerySnapshot, setDoc, deleteField, deleteDoc, DocumentSnapshot } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { setDefaultEventParameters } from 'firebase/analytics';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { Dashboard } from "./dashboard";
import { getDefaultLocale } from "react-datepicker";
// ! import { getStorage, ref } from "firebase/storage";

import { MessagingInterface } from "./privateChatComponents/privateChatMain";
import { useIntersection } from '@mantine/hooks'

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

const PAGE_SIZE = 10

const userUID = { uid: null }

export const PrivateChat = () => {

        //const userUID = 'aerh'

        
    const auth = getAuth();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingChatData, setIsFetchingChatData] = useState(false);

    const [userHasChatAccess, setUserHasChatAccess] = useState(false)

    const [userChatData, setUserChatData] = useState([])

   // console.log(userUID)

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
            //console.log('user should have access')
            setUserHasChatAccess(true)
            
        } else {
           // console.log('user unauthorized')
        }

        //console.log(messagesDocUsers)

        let myQuery = query(messagesRef, orderBy('timestamp', 'desc'), limit(PAGE_SIZE))

        if (lastVisible) {
            myQuery = query(messagesRef, orderBy('timestamp', 'desc'), limit(PAGE_SIZE), startAfter(lastVisible))
        }

        const unsubscribe = onSnapshot(myQuery, (snapshot) => {
            const paginatedChats = snapshot.docs.map((doc) => doc.data())
            if ((paginatedChats.length >= 1) == false) {
                //console.log('no more data')
                return unsubscribe;
            } else {
                setUserChatData((retrievedChats) => [...paginatedChats])
            }
            // needs to run 

            setLastVisible(snapshot.docs[snapshot.docs.length - 1])
            //console.log(lastVisible)

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

    const lastPostRef = useRef(null)

    const {ref, entry} = useIntersection({
        root: lastPostRef.current,
        threshold: 1
    })

    useEffect(() => {
        if (entry?.isIntersecting) paginateMagic()
    }, [entry])


    if (userChatData.length == 0) {
        paginateMagic()
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
                //console.log('user is currently logged in');
               // console.log(user)
                userUID.uid = user.uid
                setIsAuthenticated(true);
            } else {
                //console.log('no user');
            }
            setIsLoading(false);
        });
        return unsubscribe;
    }, [auth]);
    


    //useEffect(() => {
        //console.log(userChatData);
        
       // console.log(userHasChatAccess);
    //}, [userChatData, userHasChatAccess]);

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
                
                <div>
                    <SideBar/>
                    <h2 className="text-white">chat id: </h2>
                    <h2 className="text-green-500">{ chatID }</h2>/* must run on scrollonClick={}*/
                    <div className="overflow-scroll">
                        {
                            userChatData.reverse()?.map((msg, index) => {
                                if (index === userChatData.length-1) {
                                    return <div key={msg.id} ref={ref} className="h-20 bg-violet-500 text-black">
                                    <p>Index: {index}</p>
                                    <p>Message: {msg.message}</p>
                                    <p>Sender: {msg.sender}</p>
                                  </div>
                                }
                                return <div key={msg.id} className="h-20 bg-violet-500 text-black">
                                    <p>Index: {index}</p>
                                    <p>Message: {msg.message}</p>
                                    <p>Sender: {msg.sender}</p>
                                    </div>
                                
                            })
                        }
                    </div>
                    <div className="utilVerticalBar">
                </div>
                
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

export const SideBar = () => (
    <div className="fixed top-0 left-0 h-screen w-16 m-0 flex flex-col bg-violet-950 text-white shadow-lg">
        <button className="text-black text-xs text-center">dashboard</button>
    </div>

);