import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AddFriend } from './addFriend';
import { FriendReqModal } from './friendRequestModal';
import { getFirestore, collection, doc, getDoc, query, where } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// ! import { getStorage, ref } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyC96R1yljmWGA8VwqMDCGhZGk3XXkMHAqw",
    authDomain: "newtest-31caa.firebaseapp.com",
    projectId: "newtest-31caa",
    storageBucket: "newtest-31caa.appspot.com",
    messagingSenderId: "42832529334",
    appId: "1:42832529334:web:36270a4fab9c77e60d6317",
    measurementId: "G-ENTER2CTZ4"
  };

const firebase = initializeApp(firebaseConfig);
const db = getFirestore(firebase);




export const FriendsList = ({userUID})  => {

    // code to retrieve friends uids from user collection

    const [userData, setUserData] = useState(null) 

    useEffect( () => {
        
        const fetchData = async () => {
            console.log(userUID)
        
            const userDocRef  = doc(db,  'users', userUID)

            console.log(userDocRef)

            const userInfo = await (await getDoc(userDocRef)).data()

            setUserData(userInfo)

        }
        
        fetchData();
        
        return fetchData;

    }, [db, userUID])


// ! ALL DATABASE LOGIC FOR FRIEND STUFF GOES IN THIS FILE


    //console.log(friendsListReference)

    console.log(userData)

    //const friendsRequestReference = collection()

    const [modalOpen, setModalOpen] = useState(false);

    const firebaseRetrievedFriendsList = ['Item1', 'Item2', 'item3']

    const firebaseRetrievedFriendRequests = ['john', 'ass', 'pee']

    console.log(modalOpen)

    return (

        <>
            
            <h3>Friends</h3>

            <AddFriend />

            {modalOpen && (
                <FriendReqModal incomingFriendRequests={firebaseRetrievedFriendRequests} />
            )}

            <div>
                <button onClick={() => setModalOpen(!modalOpen)}>notifications</button>

            </div>

            <div>

                {firebaseRetrievedFriendsList.map((item, index) => (
                    <div key={index}>

                        <h5>{item}</h5>

                    </div>
                ))}

            </div>

        </>

    );
}