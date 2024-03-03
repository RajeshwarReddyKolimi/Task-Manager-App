import React, { useState } from "react";
import "./user.css";
export default function Login(props) {
    const [warning, setWarning] = useState("");
    async function verifyLogin(e) {
        e.preventDefault();
        try {
            const email = document.getElementById("login-email");
            const password = document.getElementById("login-password");
            if (email.value.trim() === "")
                return setWarning("Email cannot be empty");
            if (password.value === "") return setWarning("Enter Password");
            setWarning("");
            const response = await fetch(
                "https://taskmanagerappbyrajeshwar.onrender.com/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.value.trim(),
                        password: password.value,
                    }),
                }
            );
            const data = await response.json();
            if (response.ok) {
                email.value = "";
                password.value = "";
                localStorage.setItem("token", data.token);
                props.setCurrentUser(data.name);
                props.setLoginStatus(true);
            } else {
                console.error("Couldn't login");
                setWarning(data.error);
            }
        } catch (error) {
            console.error("Couldn't login");
        }
    }
    async function guestLogin() {
        try {
            const email = "guest@mail.com";
            const password = "Guest@111";
            const response = await fetch(
                "https://taskmanagerappbyrajeshwar.onrender.com/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                    }),
                }
            );
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.token);
                props.setCurrentUser(data.name);
                props.setLoginStatus(true);
            } else {
                console.error("Couldn't login");
                setWarning(data.error);
            }
        } catch (error) {
            console.error("Couldn't login");
        }
    }
    return (
        <form
            className="form-container"
            id="login-form"
            method="post"
            onSubmit={verifyLogin}
        >
            <img
                src="favicon-32X32.png"
                alt="logo"
                style={{ width: "40px", margin: "auto" }}
            />
            <h2 className="form-header">Login</h2>
            <div className="form-field">
                <label
                    htmlFor="email"
                    className="form-label"
                    id="login-label-email"
                >
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    id="login-email"
                    className="form-input"
                />
            </div>
            <div className="form-field">
                <label
                    htmlFor="password"
                    className="form-label"
                    id="login-label-password"
                >
                    Password
                </label>
                <input
                    type="password"
                    name="password"
                    id="login-password"
                    className="form-input"
                />
            </div>
            {warning !== "" && <div className="form-warning">{warning}</div>}
            <button
                type="submit"
                id="login-submit"
                className="form-button buttons"
            >
                Submit
            </button>
            <div className="form-footer">
                <div>Don't have an account? </div>

                <div className="form-footer-item">
                    <div className="guest-login" onClick={verifyLogin}>
                        Guest Login
                    </div>
                    <a
                        onClick={() => {
                            props.setSignup(true);
                        }}
                        className="toggle-signin"
                    >
                        Signup
                    </a>
                </div>
            </div>
        </form>
    );
}
