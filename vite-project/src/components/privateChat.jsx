import { Link, Navigate, redirect, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import { getFirestore, collection, onSnapshot, doc, getDoc, query, orderBy, limit, startAfter } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { setDefaultEventParameters } from 'firebase/analytics';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
// ! import { getStorage, ref } from "firebase/storage";

import { useIntersection } from '@mantine/hooks'
import { FaBuffer, FaHome, FaPhone, FaUserFriends } from 'react-icons/fa'

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
//!
//!
//!
//!
//!
//!                  ON MESSAGE SEND ADD TOMESSAGES COLLECITON (it will implicitly create on if it does not exist so no need to worry)

//!

//!
//!
//!


export const PrivateChat = () => {

        //const userUID = 'aerh'

        
    const auth = getAuth();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingChatData, setIsFetchingChatData] = useState(false);

    const [userHasChatAccess, setUserHasChatAccess] = useState(false)
    
    const [chatAccessLoading, setChatAccessLoading] = useState(true)

    const [userChatData, setUserChatData] = useState([])

   // console.log(userUID)

    const { chatID } = useParams()
    // ! WRAP THIS SO IT ACTIVATES ON CHANGE OF THE PRIVATE CHAT DATA

    

    const [lastVisible, setLastVisible] = useState(null)

    //////////////////////////////////////////////////
    const fetchChatData = async () => {

        setIsFetchingChatData(true)

        console.log(chatID)
        
        const messagesDocRef = doc(db, 'privateMessages', chatID)

        console.log(messagesDocRef)

        const messagesRef = collection(messagesDocRef, 'messages')

        const messagesDocUsers = (await getDoc(messagesDocRef)).data().users

        console.log(messagesDocUsers)

        //console.log(userUID.uid)
        //console.log(messagesDocUsers)

        if (messagesDocUsers[userUID.uid]) {
            //console.log('user should have access')
            setUserHasChatAccess(true)
            setChatAccessLoading(false)
        } else {
           //console.log('user unauthorized')
        }

        //console.log(messagesDocUsers)

        let myQuery = query(messagesRef, orderBy('timestamp', 'desc'), limit(PAGE_SIZE))

        if (lastVisible) {
            myQuery = query(messagesRef, orderBy('timestamp', 'desc'), limit(PAGE_SIZE), startAfter(lastVisible))
        }

        const unsubscribe = onSnapshot(myQuery, (snapshot) => {
            const paginatedChats = snapshot.docs.map((doc) => doc.data())
            console.log(paginatedChats)
            if ((paginatedChats.length >= 1) == false) {
                //console.log('no more data')
                return unsubscribe;
            }
            else {
                setUserChatData([...paginatedChats, ...userChatData])
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
    const paginateMagic = () => {
        //console.log('paginate')
        if (isFetchingChatData == false) {
            fetchChatData(lastVisible);
        }

    }

    if (userChatData.length == 0) {
        paginateMagic()
    }

    const firstPostRef = useRef(null)

    const {ref, entry} = useIntersection({
        root: firstPostRef.current,
        threshold: 1
    })

    useEffect(() => {
        if (entry?.isIntersecting) paginateMagic()
    }, [entry])

    if (isLoading) {
        return <FaBuffer/>
    }

    if (chatAccessLoading) {
        return<FaBuffer/>
    }

    //console.log(isAuthenticated)
    //console.log(userHasChatAccess)
    

    if (isAuthenticated == false) {
        
        return (
            <Navigate to={'/signIn'} />
        );
    }
    
    if (userHasChatAccess == false) {
        
        return (
            <Navigate to={'/dashboard'} />
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
                                    
                                    console.log(userChatData)
                                    console.log('executed here')
                                    return <div key={msg.id} ref={index === 0 ? ref : null} className="bg-violet-500 text-black p-">
                                    <p>Index: {index}</p>
                                    <p>Message: {msg.message}</p>
                                    <p>Sender: {msg.sender}</p>
                                    <p>time: {(msg.timestamp).toString()}</p>
                                  </div>
                                }
                                console.log('executed there')
                                return <div key={msg.id} className="bg-violet-500 text-black pt-1 pb-2 m-4">
                                    <p>Index: {index}</p>
                                    <p>Message: {msg.message}</p>
                                    <p>Sender: {msg.sender}</p>
                                    <p>time: {(msg.timestamp).toString()}</p>
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
        <Link className="text-black text-xs text-center p-6 rounded-full mt-3 mb-3" to={'/dashboard'}><FaHome/></Link>
        <Link className="text-black text-xs text-center p-6 rounded-full mb-3"><FaUserFriends/></Link>
    </div>

);