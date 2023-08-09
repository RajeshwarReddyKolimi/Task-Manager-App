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
            if (password.value !== repassword.value) {
                setWarning("Passwords do not match");
                password.value = "";
                repassword.value = "";
                return;
            }
            const response = await fetch('/signup', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.value, username: username.value, password: password.value })
            });
            const data = await response.json();
            if (response.ok) {
                email.value = "";
                username.value = "";
                password.value = "";
                repassword.value = "";
                props.setLoginStatus(true);
            }
            else {
                console.error(data.error);
                setWarning(data.error);
            }
        }
        catch (error) {
            console.error("Error in catch");
        }
    }
    return (
        <div>
            <form className='form-container' method='post' onSubmit={verifySignup}>
                <img src="favicon-32X32.png" style={{ width: "40px", margin: "auto" }} />
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
