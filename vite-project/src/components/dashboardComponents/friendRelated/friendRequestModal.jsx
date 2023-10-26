import { useState, useEffect } from 'react';

export const FriendReqModal = ({incomingFriendRequests}) => {
    return (

        <div className='modal'  style={{padding: "200px",
            border: "1px solid #4CAF50"}}>
            insert friend requests
            {Array.isArray(incomingFriendRequests) && incomingFriendRequests.map((item, index) => (
                <div key={index}>
                    <button onClick={ NEEDS TO COMMUNICATE WITH DATABASE TO ACCEPT OR DENY FRIEND REQUESTS }>{item}</button>
                </div>
            ))}
        </div>

    );
}