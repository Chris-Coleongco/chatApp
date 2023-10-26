import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export const FriendsList = ()  => {

    // code to retrieve friends uids from user collection

    

    const firebaseRetrievedFriendsList = ['Item1', 'Item2', 'item3']

    return (

        <>
        
            <h3>Friends</h3>

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