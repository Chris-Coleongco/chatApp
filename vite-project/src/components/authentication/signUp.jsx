import { useEffect, useState } from 'react';
import Select from 'react-select';
import { auth } from '../../config/firebase';
import { Navigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, addDoc, collection, Timestamp } from "firebase/firestore";

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

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth() + 1;

const years = Array.from({ length: currentYear - 1899 }, (_, index) => currentYear - index);

// Generate an array of months up to the current month
const monthNames = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
];

const months = Array.from({ length: currentMonth }, (_, index) => monthNames[index]);

console.log(months)

const days31 = Array.from({ length: 31 }, (_, index) => index + 1);
const daysFeb = Array.from({ length: 29 }, (_, index) => index + 1);
const days30 = Array.from({ length: 30 }, (_, index) => index + 1);

let shownDays = days31;


export const SignUp = () => {

    //console.log("signUpPageRendered!!!")

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [fullName, setFullName] = useState(null);
    const [selectedGender, setSelectedGender] = useState(null);

    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);

    const countryData = Country.getAllCountries();

    const [stateData, setStateData] = useState([]);

    const [selectedCountry, setSelectedCountry] = useState(null);

    const [selectedState, setSelectedState] = useState(null);

    const [userCreatedBool, setUserCreatedBool] = useState(false);


    const handleGender = (evt) => {

        const gender = evt.target.value;

        setSelectedGender(gender)

        //console.log(gender)

    }

    const handleBday = () => {

        const formattedBirthday = selectedYear.value + "-" + selectedMonth.value + "-" + selectedDay.value;

        const timestampBday = new Date(formattedBirthday)

        return timestampBday

    }

    useEffect(() => {

        console.log(selectedMonth)
        console.log(selectedDay)
        console.log(selectedYear)

        if (selectedMonth?.value == 2) {

            shownDays = daysFeb

            console.log(shownDays)

        }

        else if (selectedMonth?.value % 2 != 0) {
            //console.log('this has 31 days')

            shownDays = days31

        }

        else {
            shownDays = days30
            console.log(shownDays)
        }

    }, [selectedMonth])


    useEffect(() => {
        //console.log(selectedCountry?.value)
        const states = State.getStatesOfCountry(selectedCountry?.value);
        setStateData(states);
        //console.log(states)
    }, [selectedCountry]);



    const firebaseSignUp = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            setUserCreatedBool(true);
            console.log('created user auth')
            const user = userCredential.user;
            const uid = user.uid;
            const usersDoc = doc(db, "users", uid);
            await setDoc(usersDoc, {
                fullName: fullName,
                gender: selectedGender,
                bday: handleBday(),
                location: {
                    country: selectedCountry,
                    state: selectedState,
                },
                friends: {},
                chats: {}
            });

            console.log('created documents')


        } catch (err) {
            //console.error(err);
            //console.error("error: ", err)
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
                <br />
                <input placeholder="Email" required onChange={(e) => setEmail(e.target.value)} />
                <br />
                <br />
                <input placeholder="Password" type="password" required onChange={(e) => setPassword(e.target.value)} />
                <br />
                <br />
                <input placeholder="Full Name" required onChange={(e) => setFullName(e.target.value)} />
                <br />
                <br />
                <br />

                <div className="flex justify-center space-x-4">
                    <label className="inline-flex items-center">
                        <input type="radio" name="group" value="Male" onChange={handleGender} />
                        <span className="ml-2">Male</span>
                    </label>

                    <label className="inline-flex items-center">
                        <input type="radio" name="group" value="Female" onChange={handleGender} />
                        <span className="ml-2">Female</span>
                    </label>
                </div>
                <br />

                <h4>birthday</h4>

                <Select
                    required
                    value={selectedYear}
                    options={years.map(year => ({ value: year, label: year }))}
                    onChange={(selectedYear) => setSelectedYear(selectedYear)}
                //styles={selectStyles}
                />

                <Select
                    required
                    value={selectedMonth}
                    options={months.map(month => ({ value: months.indexOf(month) + 1, label: month }))}
                    onChange={(selectedMonth) => setSelectedMonth(selectedMonth)}
                //styles={selectStyles}
                />

                <Select
                    required
                    value={selectedDay}
                    options={shownDays.map(day => ({ value: day, label: day }))}
                    onChange={(selectedDay) => setSelectedDay(selectedDay)}
                //styles={selectStyles}
                />

                <br />

                <h4>location</h4>

                <Select
                    required
                    value={selectedCountry}
                    options={countryData.map(country => ({ value: country.isoCode, label: country.name }))}
                    onChange={(selectedCountry) => setSelectedCountry(selectedCountry)}
                //styles={selectStyles}
                />
                <Select
                    value={selectedState}
                    options={stateData.map(state => ({ value: state.isoCode, label: state.name }))}
                    onChange={(selectedState) => setSelectedState(selectedState)}
                //styles={selectStyles}
                />

                <button type='button' onClick={handleBday}>handleBday</button>

                <button type='submit'>Submit</button>
            </form>
        </div>
    );
};
