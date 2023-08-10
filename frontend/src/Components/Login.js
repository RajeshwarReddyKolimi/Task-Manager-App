import React, { useState } from 'react'
import "./user.css";
export default function Login(props) {
    const [warning, setWarning] = useState("");
    async function verifyLogin(e) {
        e.preventDefault();
        try {
            const email = document.getElementById('login-email');
            const password = document.getElementById('login-password');
            const response = await fetch('/login', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.value, password: password.value })
            });
            const data = await response.json();
            if (response.ok) {
                email.value = "";
                password.value = "";
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
            <form className='form-container' id="login-form" method='post' onSubmit={verifyLogin}>
                <img src="favicon-32X32.png" alt="logo" style={{ width: "40px", margin: "auto" }} />
                <h2 className='form-header'>Login</h2>
                <div className='form-field'>
                    <label htmlFor="email" className="form-label" id="login-label-email">Email</label>
                    <input type="email" name="email" id="login-email" className='form-input' /></div>
                <div className='form-field'>
                    <label htmlFor="password" className="form-label" id="login-label-password">Password</label>
                    <input type="password" name="password" id="login-password" className='form-input' /></div>
                {warning !== "" && <div className="form-warning">{warning}</div>}
                <button type="submit" id="login-submit" className='form-button'>Submit</button>
                <div className='form-footer'>Don't have an account? <a onClick={() => {
                    props.setSignup(true);
                }} className='toggle-signin'>Signup</a></div>
            </form>
        </div>
    )
}
