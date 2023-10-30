import { useEffect, useState } from 'react';
import Select from 'react-select';
import { auth } from '../../config/firebase';
import { Navigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc,  } from "firebase/firestore";
// ! import { getStorage, ref } from "firebase/storage";

// selects imports
import { Country, State, City } from 'country-state-city';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"


const firebaseConfig = {
    apiKey: "AIzaSyC96R1yljmWGA8VwqMDCGhZGk3XXkMHAqw",
    authDomain: "newtest-31caa.firebaseapp.com",
    projectId: "newtest-31caa",
    storageBucket: "newtest-31caa.appspot.com",
    messagingSenderId: "42832529334",
    appId: "1:42832529334:web:36270a4fab9c77e60d6317",
    measurementId: "G-ENTER2CTZ4"
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
                incomingFriendRequests : {},
            });

           //  const newRef = collection(usersDoc, "pendingFriendRequests")
            // await addDoc(newRef, {})
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
