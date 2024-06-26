import { Link, Navigate, redirect, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import { getFirestore, collection, onSnapshot, doc, getDoc, query, orderBy, limit, startAfter, Timestamp, serverTimestamp, addDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { setDefaultEventParameters } from 'firebase/analytics';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
// ! import { getStorage, ref } from "firebase/storage";

import { SideBar } from "./privateChatComponents/sidebar";


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

const PAGE_SIZE = 5

const userUID = { uid: null }


export const PrivateChat = () => {

    const auth = getAuth();
    const [isAuthenticated, setIsAuthenticated] = useState(false);


    const [isFetchingChatData, setIsFetchingChatData] = useState(false);

    const [userHasChatAccess, setUserHasChatAccess] = useState(false)

    const [couldNotAccessUsers, setCouldNotAccessUsers] = useState(false)


    const [loadingAuthStatus, setLoadingAuthStatus] = useState(true)
    const [loadingChatAccessStatus, setLoadingChatAccessStatus] = useState(true)


    const [userChatData, setUserChatData] = useState([])

    const [msgToSend, setMsgToSend] = useState(null)
    // console.log(userUID)

    const { chatID } = useParams()
    // ! WRAP THIS SO IT ACTIVATES ON CHANGE OF THE PRIVATE CHAT DATA

    const [lastVisible, setLastVisible] = useState(null)

    //const scrollContainerRef = useRef(null)

    //////////////////////////////////////////////////
      
    const fetchChatData = async () => {

        setIsFetchingChatData(true)

        // console.log(chatID)

        const messagesDocRef = doc(db, 'privateMessages', chatID)

        // console.log(messagesDocRef)

        const messagesRef = collection(messagesDocRef, 'messages')

        let messagesDocUsers = '';

        try {
            messagesDocUsers = (await getDoc(messagesDocRef)).data().users
        } catch (error) {
            console.log("shit")
            setCouldNotAccessUsers(true)
        }

        

        //console.log(userUID.uid)
        //console.log(messagesDocUsers)

        if (messagesDocUsers[userUID.uid]) {
            //console.log('user should have access')
            setUserHasChatAccess(true)
        } else {
            //console.log('user unauthorized')
        }

        setLoadingChatAccessStatus(false)

        //console.log(messagesDocUsers)

        let myQuery = query(messagesRef, orderBy('timestamp', 'desc'), limit(PAGE_SIZE))

        if (lastVisible) {
            myQuery = query(messagesRef, orderBy('timestamp', 'desc'), limit(PAGE_SIZE), startAfter(lastVisible))
        }

        const unsubscribe = onSnapshot(myQuery, (snapshot) => {
            const paginatedChats = snapshot.docs.map((doc) => doc.data())
            //   console.log(paginatedChats)
            if ((paginatedChats.length >= 1) == false) {
                //console.log('no more data')
                return unsubscribe;
            }
            else {
                setUserChatData([...userChatData, ...paginatedChats])
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

            scrollContainerRef.current.scrollTop = 10

            setIsFetchingChatData(false)
        })
        return unsubscribe;
    }


    const sendMessage = () => {
        console.log(msgToSend)

        console.log(Date())

        //! put the date AS A TIMESTAMP and msg to send along with sender (userUID) and then send it to firebase


        const currentTime = Timestamp.fromDate(new Date())


        const privateChatDoc = doc(db, 'privateMessages', chatID)

        const messagesCollection = collection(privateChatDoc, 'messages')

        addDoc(messagesCollection, {
            message: msgToSend,
            sender: userUID.uid,
            timestamp: currentTime,
        })


    }

    useEffect(() => {
        console.log(msgToSend)
        console.log(Date())
    }, [msgToSend])

    useEffect(() => {
        console.log(couldNotAccessUsers)
    }, [couldNotAccessUsers])

    /* const chatId = 'chat1';
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
        });
        setLoadingAuthStatus(false)
        //   console.log('authstatusset')
        return unsubscribe;
    }, [auth]);


    useEffect(() => {
        console.log(userChatData);
        // console.log(userHasChatAccess);
    }, [userChatData]);


    const paginateMagic = () => {
        //console.log('paginate')
        if (isFetchingChatData == false) {
            fetchChatData(lastVisible);
        }

    }


    const scrollContainerRef = useRef(null);

    


    useEffect(() => {
        const container = scrollContainerRef.current;

        container.scrollTop = 20
        
        const handleScroll = () => {

          const scrollTopStatus = container.scrollTop === 0
      
          // Check if the user has scrolled to the top of the container
          if (scrollTopStatus) {
            paginateMagic();
          } else {
          }
        };
      
        if (scrollContainerRef.current) {
          // Attach the scroll event listener to the container
          scrollContainerRef.current.addEventListener("scroll", handleScroll);

        }
      
        return () => {
          if (scrollContainerRef.current) {
            // Remove the scroll event listener when the component unmounts
            scrollContainerRef.current.removeEventListener("scroll", handleScroll);
          }
        };
      }, [paginateMagic]);
    


    if (userChatData.length == 0 /*|| scrolledUp == true*/) {
        paginateMagic()
    }

    /* 
     const handleScroll = () => {
         const container = scrollContainerRef.current
         const scrollY = container.scrollY;
 
         if (scrollY < 200) {
             paginateMagic();
         }
     };
 */
    //useEffect(() => {
    //   window.addEventListener("scroll", handleScroll);
    //    return () => window.removeEventListener("scroll", handleScroll);
    // }, [handleScroll]);
    /*
        const firstPostRef = useRef(null)
    
        const { ref, entry } = useIntersection({
            root: firstPostRef.current,
            threshold: 1
        })*/

    /* useEffect(() => {
         if (entry?.isIntersecting) paginateMagic()
     }, [entry])*/

    //console.log(isAuthenticated)
    //console.log(userHasChatAccess)=

    //   console.log(loadingAuthStatus)
    //    console.log(loadingChatAccessStatus)

    if ((loadingAuthStatus == false) && (loadingChatAccessStatus == false || couldNotAccessUsers == true)) {
        console.log('loaidng complete')

        // console.log(isAuthenticated)
        // console.log(userHasChatAccess)

        if (isAuthenticated == false) {
            return <Navigate to={'/signIn'} />
        }

        if (userHasChatAccess == false) {
            return <Navigate to={'/dashboard'} />
        }

    }

    return (

        <>

            <div>
                <SideBar />
                <h2 className="text-white">chat id: </h2>
                <h2 className="text-green-500">{chatID}</h2>/* must run on scrollonClick={ }*/


                <div className="infinite-scroll-container overflow-y-scroll max-h-96" ref={scrollContainerRef}>
                    {
                        userChatData.slice().reverse()?.map((msg, index) => {
                            return <div key={msg.id} className="bg-violet-900 text-black pt-1 pb-2 m-4 rounded-md">
                                <p>Index: {index}</p>
                                <p>Message: {msg.message}</p>
                                <p>Sender: {msg.sender}</p>
                                <p>time: {(msg.timestamp).toDate().toString()}
                                </p>
                            </div>
                        }
                        )}
                </div>
                <div className="absolute inset-x-0 bottom-0 h-16 bg-purple-950">
                    need to tset the value here to nothing when the button gets clicked. also need to make it so when u enter while focused in input box you send message (CANNOT MAKE IT SUBMIT VIA FORM IT WILL RELOAD PAGE NO GOODIE)<input placeholder="type here" onChange={(e) => setMsgToSend(e.target.value)} className="rounded-md" />
                    <button onClick={sendMessage} className="rounded-md bg-indigo-800 hover:bg-indigo-600">send</button>
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