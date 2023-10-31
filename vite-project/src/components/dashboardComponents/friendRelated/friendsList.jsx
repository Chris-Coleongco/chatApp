import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AddFriend } from './addFriend';
import { FriendReqModal } from './friendRequestModal';
import { getFirestore, collection, onSnapshot, doc, getDoc, getDocs, query, where, updateDoc, addDoc } from "firebase/firestore";
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

    const [friendRequestSearchBuffer, setFriendRequestSearchBuffer] = useState("");

    // for getting possible users to frined request in live search
    const [firebaseRetrievedPeopleList, setFirebaseRetrievedPeopleList] = useState([]);

    const [firebaseRetrievedFriends , setFirebaseRetrievedFriends] = useState({})

    const [firebaseRetrievedFriendRequests , setFirebaseRetrievedFriendRequests] = useState([])

    
    useEffect(() => {

        const fetchFriendData = async () => {

            //usersDoc

            const usersDoc = onSnapshot(doc(db, "users", userUID), (doc) => {

                const usersFriends = doc.get('friends')

                // ! YOU CAN USE THIS FUNCTION TO RETRIEVE INCOMING REQUESTS
                //console.log(usersFriends['friend'])
                setFirebaseRetrievedFriends(usersFriends)

            })

            return usersDoc;

         }

        fetchFriendData()
         
   }, []);

   useEffect(() => {
        console.log(firebaseRetrievedFriends)
   }, [firebaseRetrievedFriends])


// ! ALL DATABASE LOGIC FOR FRIEND STUFF GOES IN THIS FILE

   

    const pushData = async () => {

        const usersDoc = doc(db, "users", userUID);

        const personDoc = doc(db, "users", friendRequestSearchBuffer)

        const existingPersonCheck = await getDoc(personDoc);

        console.log(typeof existingPersonCheck.data())

        const existingFriendCheck = await getDoc(doc(usersDoc, "friends", friendRequestSearchBuffer))

        const existingFriendCheckData = existingFriendCheck.data()

        const existingPersonCheckData = existingPersonCheck.data()

        console.log(typeof existingFriendCheck.data())

        if (existingFriendCheckData === undefined && existingPersonCheckData !== undefined) {
            const userRef = collection(usersDoc, "pendingFriendRequests")
            await addDoc(userRef, {
                requester: userUID,
                requested: friendRequestSearchBuffer
            })
            const personRef = collection(usersDoc, "incomingFriendRequests")
            await addDoc(personRef, {
                requester: userUID,
                requested: friendRequestSearchBuffer
            })

        }
        else {
            return null;
        }
        
        //else if (existingFriendsData)

        
    }
    //console.log(friendsListReference)

    //const friendsRequestReference = collection()

    const [modalOpen, setModalOpen] = useState(false);



    console.log(modalOpen)

    return (

        <>
            
            <h3>Friends</h3>

            <div className='addFriendSearch'>
            <input type='search' onChange={(e) => setFriendRequestSearchBuffer(e.target.value)}/>
            <button onClick={pushData}>Add Friend</button>
            <div id='peopleList'>
                {firebaseRetrievedPeopleList.map((item, index) => (
                    <div key={index}>

                        <h5>{item}</h5>

                    </div>
                ))}
            </div>
            <br/>

            NEED TO HAVE LIVE SEARCH HERE
            
            </div>

            {modalOpen && (
                <FriendReqModal incomingFriendRequests={firebaseRetrievedFriendRequests} />
            )}

            <div>
                <button onClick={() => setModalOpen(!modalOpen)}>notifications</button>

            </div>

            MY FRIENDS:

            <div>

                {Object.keys(firebaseRetrievedFriends).map((friend, index) => (
                    <div key={index}>
                        <h5>{firebaseRetrievedFriends[friend]}</h5>
                    </div>
                ))}
                

            </div>

        </>

    );
}