import { useState, useEffect } from 'react';

export const AddFriend = () => {

    //  ! adding friend logic and cool database shit goes here
    const [friendRequestSearchBuffer, setFriendRequestSearchBuffer] = useState("");
    
    useEffect(() => {
        console.log('Data:', friendRequestSearchBuffer);
      }, [friendRequestSearchBuffer]);

    return (

        <div className='addFriendSearch'>
            <input type='search' onChange={(e) => setFriendRequestSearchBuffer(e.target.value)}/>

            REQUEST OF USER IS SENT TO A COLLECTION OF FRIEND REQUESTS

            NEED TO HAVE LIVE SEARCH HERE
            
        </div>

    );
}