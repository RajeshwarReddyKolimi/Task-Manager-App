import React, { useState, useEffect } from 'react'
import "./card.css";
import Form from "./Form";
import { MdDelete, MdEdit } from "react-icons/md";
import { TiArrowForward } from "react-icons/ti";
export default function Card(props) {
    const { type, moveType, setChanged, logout } = props;
    const { cardId, title, priority, description, deadline = null } = props.details;
    const [timeleft, setTimeleft] = useState("");
    const [showEditTask, setShowEditTask] = useState(false);
    async function deleteTask() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://taskmanagerappbyrajeshwar.onrender.com/deleteTask', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ type: type, cardId: cardId })
            });
            const data = await response.json();
            if (response.ok) {
                if (data.message === "Invalid")
                    logout();
                else {
                    setChanged(prev => !prev);
                }
            }
            else
                console.error("Couldn't Delete Task");
        }
        catch (error) {
            console.error("Couldn't Delete Task");
        }
    }

    async function moveTask(moveTo) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://taskmanagerappbyrajeshwar.onrender.com/moveTask', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ currentType: type, moveType: moveTo, cardId: cardId })
            });
            const data = await response.json();
            if (response.ok) {
                if (data.message === "Invalid")
                    logout();
                else {
                    setChanged(prev => !prev);
                }
            }
            else
                console.error("Couldn't Move Task");
        }
        catch (error) {
            console.error("Couldn't Move Task");
        }
    }

    useEffect(() => {
        let isExpired = false;
        const interval = setInterval(() => {
            if (deadline === null) {
                return;
            }
            const currentDate = new Date();
            const deadlineDate = new Date(deadline);
            const timeDif = Math.floor((deadlineDate - currentDate) / 1000);
            if (timeDif <= 0 && !isExpired) {
                isExpired = true;
                moveTask("Expired");
                return;
            }
            const days = Math.floor(timeDif / (60 * 60 * 24));
            const hours = Math.floor((timeDif % (60 * 60 * 24)) / (60 * 60));
            const minutes = Math.floor((timeDif % (60 * 60)) / 60);
            const seconds = timeDif % 60;
            const fHours = hours < 10 ? `0${hours}` : hours;
            const fMinutes = minutes < 10 ? `0${minutes}` : minutes;
            const fSeconds = seconds < 10 ? `0${seconds}` : seconds;

            const timeLeft = days >= 1
                ? `${days} days`
                : `${fHours}:${fMinutes}:${fSeconds}`;

            setTimeleft(timeLeft);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [deadline]);

    const priorityColor = priority === "Low" ? "#D58D49" : "#D8727D";

    return (
        <div className="card-final">
            {showEditTask && (
                <div className="task-edit">
                    <Form setShowTask={setShowEditTask} setChanged={setChanged} details={{ type, cardId, title, priority, description, deadline }} logout={logout} formTitle="Edit Task" />
                </div>
            )}
            <div className="card-header">
                <div className='card-priority' style={{ color: priorityColor }}>{priority}</div>
                <div className='card-buffer'></div>
                {type !== "Expired" && type !== "Done" && <button className='react-icon' onClick={() => setShowEditTask(true)}><MdEdit /></button>}
                {type !== "Expired" && type !== "Done" && <button className='react-icon' onClick={() => moveTask(moveType)}><TiArrowForward /></button>}
                <button className='react-icon' onClick={deleteTask}><MdDelete /></button>
            </div>
            <div className='card-title'>{title}</div>
            <div className='card-desc'>{description}</div>
            {(type === "Todo" || type === "Ongoing") && deadline !== null && <div className='card-deadline'>
                Time left: {timeleft}</div>}
        </div>
    )
}
