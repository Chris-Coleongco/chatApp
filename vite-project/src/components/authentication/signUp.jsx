import { useEffect, useState } from 'react';
import Select from 'react-select';
import { auth } from '../../config/firebase';
import { Navigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, count  } from "firebase/firestore";
// ! import { getStorage, ref } from "firebase/storage";


// selects imports
import { Country, State, City } from 'country-state-city';
import DatePicker from 'react-date-picker';

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
// ! const storage = getStorage(firebase)
// ! const storageRef = ref(storage, 'profilePictures');

export const SignUp = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [bday, setBday] = useState("");

    console.log(bday)
    
    const countryData = Country.getAllCountries();
    //console.log(countryData)

    const [stateData, setStateData] = useState([]);

    const [selectedCountry, setSelectedCountry] = useState(null);

    const [selectedState, setSelectedState] = useState(null);

    useEffect(() => {
        //console.log(selectedCountry?.value)
        const states = State.getStatesOfCountry(selectedCountry?.value);
        setStateData(states);
        //console.log(states)
    }, [selectedCountry]);

    const [userCreatedBool, setUserCreatedBool] = useState(false);

    const firebaseSignUp = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            setUserCreatedBool(true);
            const user = userCredential.user;
            const uid = user.uid;
            const usersDoc = doc(db, "users", uid);
            await setDoc(usersDoc, {
                fullName : fullName,
                bday: bday,
                country : selectedCountry,
                state : selectedState,
            });
            //console.log('firebase signup executed');
        } catch (err) {
            //console.error(err);
             return <Navigate to="/signUp" />;
        }
    };

    if (userCreatedBool) {
        return <Navigate to="/signIn" />;
    }

    return (
        <div>
            <form onSubmit={firebaseSignUp}>
                <h1>Sign Up</h1>
                <input placeholder="Email" required onChange={(e) => setEmail(e.target.value)} />
                <br/>
                <input placeholder="Password" type="password" required onChange={(e) => setPassword(e.target.value)} />
                <br/>
                <input placeholder="Full Name" required onChange={(e) => setFullName(e.target.value)} />
                <br/>
                <DatePicker onChange={(bday) => setBday(bday)} />
                <Select
                required
                value={selectedCountry}
                options={countryData.map(country => ({ value: country.isoCode, label: country.name }))}
                onChange={(selectedCountry) => setSelectedCountry(selectedCountry)}
                />
                <Select
                required
                value={selectedState}
                options={stateData.map(state => ({ value: state.isoCode, label: state.name }))}
                onChange={(selectedState) => setSelectedState(selectedState)} 
                />

                <button type='submit'>Submit</button>
            </form>
        </div>
    );
};
