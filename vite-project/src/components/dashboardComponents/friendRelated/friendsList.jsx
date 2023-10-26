import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { FriendReqModal } from './friendRequestModal';

export const FriendsList = ()  => {

    // code to retrieve friends uids from user collection

    const [modalOpen, setModalOpen] = useState(false);

    const firebaseRetrievedFriendsList = ['Item1', 'Item2', 'item3']

    const firebaseRetrievedFriendRequests = ['john', 'ass', 'pee']

    console.log(modalOpen)

    return (

        <>
            
            <h3>Friends</h3>

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