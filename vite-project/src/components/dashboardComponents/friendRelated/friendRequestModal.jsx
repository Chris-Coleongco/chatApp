import { useState, useEffect } from 'react';

export const FriendReqModal = ({incomingFriendRequests}) => {
    return (

        <div className='modal'  style={{padding: "200px",
            border: "1px solid #4CAF50"}}>
            insert friend requests
            {Array.isArray(incomingFriendRequests) && incomingFriendRequests.map((item, index) => (
                <div key={index}>
                    <button>{item}</button>
                </div>
            ))}
        </div>

    );
}