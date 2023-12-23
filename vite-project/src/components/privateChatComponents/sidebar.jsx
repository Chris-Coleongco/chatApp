import { Link,  } from "react-router-dom";
import { FaHome, FaUserFriends } from 'react-icons/fa'
import { Settings } from "../dashboardComponents/settings";

export const SideBar = ({u}) => (
    
    <>
    <div className="fixed top-0 left-0 h-screen w-16 m-0 flex flex-col bg-violet-950 text-white shadow-lg">
        <Link className="text-black text-xs text-center p-6 rounded-full mt-3 mb-3" to={'/dashboard'}><FaHome/></Link>
        <Link className="text-black text-xs text-center p-6 rounded-full mb-3"><FaUserFriends/></Link>
        <button onClick={() => {navigator.clipboard.writeText(u)}}>you</button>
        <Settings/>
    </div>
    
    </>

);
