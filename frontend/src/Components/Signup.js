import React, { useState } from 'react';
import "./user.css";

export default function Signup(props) {
    const [warning, setWarning] = useState("");
    async function verifySignup(e) {
        e.preventDefault();
        try {
            const email = document.getElementById('signup-email');
            const username = document.getElementById('signup-username');
            const password = document.getElementById('signup-password');
            const repassword = document.getElementById('signup-repassword');
            if (email.value.trim() === "") {
                setWarning("Email cannot be empty");
                return;
            }
            if (username.value.trim() === "") {
                return setWarning("Username cannot be empty");
            }
            if (password.value !== repassword.value) {
                setWarning("Passwords do not match");
                password.value = "";
                repassword.value = "";
                return;
            }
            if (password.value.length < 4)
                return setWarning("Password should be atleast 4 characters long");
            setWarning('');
            const response = await fetch('https://taskmanagerappbyrajeshwar.onrender.com/signup', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.value.trim(), username: username.value.trim(), password: password.value })
            });
            const data = await response.json();
            if (response.ok) {
                email.value = "";
                username.value = "";
                password.value = "";
                repassword.value = "";
                localStorage.setItem('token', data.token);
                props.setLoginStatus(true);
                props.setCurrentUser(data.name);
            }
            else {
                console.error("Couldn't Sign Up");
                setWarning(data.error);
            }
        }
        catch (error) {
            console.error("Couldn't Sign Up");
        }
    }
    return (
        <div>
            <form className='form-container' method='post' onSubmit={verifySignup}>
                <img src="favicon-32X32.png" alt='logo' style={{ width: "40px", margin: "auto" }} />
                <h2 className='form-header'>Sign up</h2>
                <div className='form-field'>
                    <label htmlFor="email" className="form-label" id="form-label-email">Email</label>
                    <input type="email" name="email" id="signup-email" className='form-input' /></div>
                <div className='form-field'>
                    <label htmlFor="username" className="form-label" id="form-label-username">Username</label>
                    <input type="text" name="username" id="signup-username" className='form-input' /></div>
                <div className='form-field'>
                    <label htmlFor="password" className="form-label" id="form-label-password">Password</label>
                    <input type="password" name="password" id="signup-password" className='form-input' /></div>
                <div className='form-field'>
                    <label htmlFor="repassword" className="form-label" id="form-label-email">Re Enter Password</label>
                    <input type="password" name="repassword" id="signup-repassword" className='form-input' /></div>
                {warning !== "" && <div className='form-warning'>{warning}</div>}
                <button type="submit" id="login-submit" className='form-button buttons'>Submit</button>
                <div className='form-footer'>Already have an account? <a className='toggle-signin' onClick={() => {
                    props.setSignup(false);
                }}>Login</a></div>
            </form>
        </div>
    )
}
