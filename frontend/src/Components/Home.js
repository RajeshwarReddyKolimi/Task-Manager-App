import React, { useState, useEffect } from "react";
import "./user.css";
import "./card.css"
import Task from "./Task";
import { FaUser } from "react-icons/fa";
import { SlLogout } from "react-icons/sl";
export default function Home(props) {
    const [todo, setTodo] = useState([]);
    const [done, setDone] = useState([]);
    const [ongo, setOngo] = useState([]);
    const [expired, setExpired] = useState([]);
    const [showUser, setShowUser] = useState(false);
    const [changed, setChanged] = useState(false);
    const { logout, loginStatus, setCurrentUser, currentUser } = props;
    useEffect(() => {
        run();
    }, [loginStatus, changed]);

    async function run() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://taskmanagerappbyrajeshwar.onrender.com/getTask', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            const details = data.userdetails;
            if (response.ok) {
                if (data.message === "Invalid")
                    logout();
                else {
                    setCurrentUser(details.name);
                    const todotemp = [];
                    const ongotemp = [];
                    const donetemp = [];
                    const expiredtemp = [];
                    details.Todo.forEach(temp => {
                        todotemp.push({
                            cardId: temp.cardId,
                            title: temp.title,
                            priority: temp.priority,
                            description: temp.description,
                            deadline: temp.deadline
                        });
                    });
                    details.Ongoing.forEach(temp => {
                        ongotemp.push({
                            cardId: temp.cardId,
                            title: temp.title,
                            priority: temp.priority,
                            description: temp.description,
                            deadline: temp.deadline
                        });
                    });
                    details.Done.forEach(temp => {
                        donetemp.push({
                            cardId: temp.cardId,
                            title: temp.title,
                            priority: temp.priority,
                            description: temp.description
                        });
                    });
                    details.Expired.forEach(temp => {
                        expiredtemp.push({
                            cardId: temp.cardId,
                            title: temp.title,
                            priority: temp.priority,
                            description: temp.description
                        });
                    });
                    setTodo([...todotemp]);
                    setOngo([...ongotemp]);
                    setDone([...donetemp]);
                    setExpired([...expiredtemp]);
                }
            }
            else
                console.error("Couldn't load tasks");

        } catch (error) {
            console.error("Couldn't load details");
        }
    }

    return (
        <div>
            {showUser &&
                <div className="user-back" onClick={(e) => {
                    if (e.target.className !== 'user-back')
                        return;
                    e.stopPropagation();
                    setShowUser(false);
                }}>
                    <div className="user-details">
                        <div className="username">{currentUser}</div>
                        <button className="logout" onClick={logout}><p>Logout</p> <SlLogout /></button>
                    </div>
                </div>}
            <div className="header">
                <img src="favicon-32X32.png" alt="logo" style={{ width: "40px", margin: "auto" }} />
                <div className="app-title">Task Manager</div>
                <div className="header-buffer"></div>
                <button className='user-button' onClick={() => setShowUser((prev) => (!prev))}><FaUser className="user" /></button>

            </div>
            <div className="task-container">
                <Task type="Todo" moveType="Ongoing" setChanged={setChanged} taskItem={todo} logout={logout} />
                <Task type="Ongoing" moveType="Done" setChanged={setChanged} taskItem={ongo} logout={logout} />
                <Task type="Done" setChanged={setChanged} taskItem={done} logout={logout} />
                <Task type="Expired" setChanged={setChanged} taskItem={expired} logout={logout} />
            </div>
        </div>
    )
}
