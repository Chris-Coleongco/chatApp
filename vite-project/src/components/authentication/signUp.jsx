import { useEffect, useState } from 'react';
import Select from 'react-select';
import { auth } from '../../config/firebase';
import { Navigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, addDoc,  collection} from "firebase/firestore";

// ! import { getStorage, ref } from "firebase/storage";

// selects imports
import { Country, State, City } from 'country-state-city';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"


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
const genderChoices = ['male', 'female', 'other']


const selectStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? 'white' : 'black',
    }),
  }



export const SignUp = () => {

    console.log("signUpPageRendered!!!")

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [fullName, setFullName] = useState(null);
    const [selectedGender, setSelectedGender] = useState(null);
    const [bday, setBday] = useState(null);

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
                gender : selectedGender,
                bday: bday,
                location : {
                    country : selectedCountry,
                    state : selectedState,
                },
                friends : {},
            });

            
        } catch (err) {
            //console.error(err);
            console.error("error: ", err)
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
                <Select
                required
                value={selectedGender}
                options={genderChoices.map(gender => ({value: gender}))}
                onChange={(selectedGender) => setSelectedGender(selectedGender)}
                styles={selectStyles}
                />
                <br/>
                <DatePicker className='custom-calendar' selected={bday} onChange={(bday) => setBday(bday)} dateFormat="MMMM d, yyyy" />
                <Select
                required
                value={selectedCountry}
                options={countryData.map(country => ({ value: country.isoCode, label: country.name }))}
                onChange={(selectedCountry) => setSelectedCountry(selectedCountry)}
                styles={selectStyles}
                />
                <Select
                value={selectedState}
                options={stateData.map(state => ({ value: state.isoCode, label: state.name }))}
                onChange={(selectedState) => setSelectedState(selectedState)} 
                styles={selectStyles}
                />

                <button type='submit'>Submit</button>
            </form>
        </div>
    );
};
