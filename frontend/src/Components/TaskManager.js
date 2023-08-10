import React, { useState, useEffect } from "react";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import "./user.css";
import "./card.css";
export default function TaskManager() {
    const [deadline, setDeadline] = useState(null);
    const [signup, setSignup] = useState(false);
    const [loginStatus, setLoginStatus] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    useEffect(() => {
        async function checkSession() {
            try {
                const response = await fetch('https://taskmanagerappbyrajeshwar.onrender.com/session');
                const data = await response.json();
                if (response.ok) {
                    if (data.value) {
                        setCurrentUser(data.user.name);
                        setLoginStatus(true);
                    }
                }
            }
            catch (error) {
                console.error("Couldn't load details");
            }
        }
        checkSession();
    }, [loginStatus]);


    async function logout() {
        try {
            const response = await fetch('https://taskmanagerappbyrajeshwar.onrender.com/logout');
            const data = response.json();
            if (response.ok) {
                setLoginStatus(false);
                setCurrentUser(null);
            }
            else
                console.error(data.error);
        }
        catch (error) {
            console.error("Couldn't Logout in Catch");
        }
    }


    return (
        <div>
            {loginStatus ? <Home setLoginStatus={setLoginStatus} loginStatus={loginStatus} logout={logout} currentUser={currentUser} setCurrentUser={setCurrentUser} /> : (signup ? <Signup setSignup={setSignup} setLoginStatus={setLoginStatus} /> : <Login setSignup={setSignup} setLoginStatus={setLoginStatus} />)}
        </div >
    )
}
