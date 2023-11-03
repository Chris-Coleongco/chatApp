import { useState, useEffect } from 'react';

export const FriendReqModal = ({incomingFriendRequests}) => {

    return (

        <div className='modal'  style={{padding: "200px",
            border: "1px solid #4CAF50"}}>
            insert friend requests
            {Object.keys(incomingFriendRequests).map((friend, index) => (
                    <div key={index}>
                        <h5>{incomingFriendRequests[friend]}</h5>
                    </div>
                ))}
        </div>

    );
}