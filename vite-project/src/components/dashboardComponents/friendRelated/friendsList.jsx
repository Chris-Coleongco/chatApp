import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AddFriend } from './addFriend';
import { FriendReqModal } from './friendRequestModal';
import { getFirestore, collection, onSnapshot, doc, getDoc, getDocs, query, where, updateDoc, addDoc, QuerySnapshot, setDoc, deleteField, deleteDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { setDefaultEventParameters } from 'firebase/analytics';

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

                const usersIncomingFriendRequests = doc.get('incomingFriendRequests')
                
                setFirebaseRetrievedFriendRequests(usersIncomingFriendRequests)

            })

            return usersDoc;

         }

        fetchFriendData()
         
   }, []);

   
   useEffect(() => {
        console.log(firebaseRetrievedFriends)
   }, [firebaseRetrievedFriends])

   useEffect(() => {
    console.log(firebaseRetrievedFriendRequests)
   }, [firebaseRetrievedFriendRequests])

// ! ALL DATABASE LOGIC FOR FRIEND STUFF GOES IN THIS FILE



    const pushRequestsData = async () => {

        const usersDoc = doc(db, "users", userUID);

        const personsDoc = doc(db, "users", friendRequestSearchBuffer)

        const existingPersonCheck = await getDoc(personsDoc);

        console.log(typeof existingPersonCheck.data())

        const existingFriendCheck = await getDoc(doc(usersDoc, "friends", friendRequestSearchBuffer))

        const existingFriendCheckData = existingFriendCheck.data()

        const existingPersonCheckData = existingPersonCheck.data()

        console.log(typeof existingFriendCheck.data())

        if (existingFriendCheckData === undefined && existingPersonCheckData !== undefined) {

            //doc(usersDoc, "friends",)

            try {
                
                await updateDoc(usersDoc, {
                    [`pendingFriendRequests.${friendRequestSearchBuffer}`]: friendRequestSearchBuffer
                }, { merge: true }) // NEED TO FIX SO DOESNT OVERWRITE PENDINGFRIENDREQUESTS
            } catch (error) {
                await setDoc(usersDoc, {
                    pendingFriendRequests : {
                        [friendRequestSearchBuffer]: friendRequestSearchBuffer
                    }
                })
            }

            try {
                await updateDoc(personsDoc, {
                    [`incomingFriendRequests.${userUID}`]: userUID
                }, { merge: true }) // NEED TO FIX SO DOESNT OVERWRITE PENDINGFRIENDREQUESTS
            } catch (error) {
                await setDoc(personsDoc, {
                    incomingFriendRequests : {
                        [userUID]: userUID
                    }
                })
            }

        }
        else {
            return null;
        }
        
        //else if (existingFriendsData)

        
    }


    const acceptFriendRequest = async (evt) => {
        

        console.log(userUID)
        const buttonValue = evt.target.value;
        const usersDoc = doc(db, "users", userUID);
        
        console.log(buttonValue)

        const personsDoc = doc(db, "users", buttonValue)
        const existingFriendCheck = await getDoc(doc(usersDoc, "friends", buttonValue))

        const existingFriendCheckData = existingFriendCheck.data()

        console.log(typeof existingFriendCheck.data())

        

        if (existingFriendCheckData === undefined) {

            console.log(buttonValue)
            
            const usersDocSnap = (await getDoc(usersDoc)).data();
            const usersNewFriends = { ...usersDocSnap.friends }
            usersNewFriends[buttonValue] = buttonValue

            const personsDocSnap = (await getDoc(personsDoc)).data();
            const personsNewFriends = { ...personsDocSnap.friends }
            personsNewFriends[userUID] = userUID
            
            await updateDoc(usersDoc, {
                ['incomingFriendRequests.' + buttonValue]: deleteField()
            });
    
            await updateDoc(usersDoc, {
                friends : usersNewFriends,
            },  { merge: true })

            await updateDoc(personsDoc, {
                friends : personsNewFriends,
            },  { merge: true })
            
    
            await updateDoc(personsDoc, {
                ['pendingFriendRequests.' + userUID]: deleteField()
            });
    
        }
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
            <button onClick={pushRequestsData}>Add Friend</button>
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

            INCOMING FRIEND REQUETSS:

            <div>
                {firebaseRetrievedFriendRequests && 
                    Object.keys(firebaseRetrievedFriendRequests).map((requester, index) => (
                        <div key={index}>
                            <h5>{firebaseRetrievedFriendRequests[requester]}</h5>
                            <button value={firebaseRetrievedFriendRequests[requester]} onClick={acceptFriendRequest}>Accept</button>
                        </div>
                    ))    
                }
                
                

            </div>

            MY FRIENDS:

            <div>

                {firebaseRetrievedFriends && Object.keys(firebaseRetrievedFriends).map((friend, index) => (
                    <div key={index}>
                        <h5>{firebaseRetrievedFriends[friend]}</h5>
                    </div>
                ))}
                

            </div>

        </>

    );
}