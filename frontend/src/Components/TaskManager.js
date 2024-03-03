import React, { useState, useEffect } from "react";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import "./user.css";
import "./card.css";

export default function TaskManager() {
    const [signup, setSignup] = useState(false);
    const [loginStatus, setLoginStatus] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    useEffect(() => {
        checkStatus();
        async function checkStatus() {
            if (localStorage.getItem("token") !== null) {
                setLoginStatus(true);
            } else {
                setLoginStatus(false);
            }
        }
    }, [loginStatus]);
    async function logout() {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                "https://taskmanagerappbyrajeshwar.onrender.com/logout",
                {
                    method: "POST",
                    headers: {
                        contentType: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    credentials: "include",
                }
            );
            const data = await response.json();
            if (response.ok) {
                localStorage.removeItem("token");
                setLoginStatus(false);
                setCurrentUser(null);
            } else {
                console.error("Couldn't logout: Problem with server");
            }
        } catch (error) {
            console.error("Couldn't Logout: Problem with API");
        }
    }

    return (
        <div>
            {loginStatus ? (
                <Home
                    setLoginStatus={setLoginStatus}
                    loginStatus={loginStatus}
                    logout={logout}
                    currentUser={currentUser}
                    setCurrentUser={setCurrentUser}
                />
            ) : signup ? (
                <Signup
                    setSignup={setSignup}
                    setCurrentUser={setCurrentUser}
                    setLoginStatus={setLoginStatus}
                />
            ) : (
                <Login
                    setSignup={setSignup}
                    setCurrentUser={setCurrentUser}
                    setLoginStatus={setLoginStatus}
                />
            )}
        </div>
    );
}
