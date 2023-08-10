import React, { useState, useEffect } from 'react'
import "./card.css";
import { MdDelete } from "react-icons/md";
import { TiArrowForward } from "react-icons/ti";
export default function Card(props) {
    const [timeleft, setTimeleft] = useState("");
    async function deleteTask() {
        try {
            const response = await fetch('https://taskmanagerappbyrajeshwar.onrender.com/deleteTask', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ type: props.type, title: props.details.title })
            });
            const data = await response.json();
            if (response.ok) {
                props.setChanged(prev => !prev);
            }
            else
                console.error(data.error);
        }
        catch (error) {
            console.error("Error in delete catch");
        }
    }

    async function moveTask(moveTo) {
        try {
            const response = await fetch('https://taskmanagerappbyrajeshwar.onrender.com/moveTask', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currentType: props.type, moveType: moveTo, title: props.details.title })
            });
            const data = await response.json();
            if (response.ok) {
                props.setChanged(prev => !prev);
            }
            else
                console.error(data.error);
        }
        catch (error) {
            console.error("Error in delete catch");
        }
    }

    useEffect(() => {
        let isExpired = false;
        const interval = setInterval(() => {
            if (props.details.deadline === null) {
                return;
            }
            const currentDate = new Date();
            const deadlineDate = new Date(props.details.deadline);
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
    }, [props.details.deadline]);

    const priorityColor = props.details.priority === "Low" ? "#D58D49" : "#D8727D";

    return (
        <div className="card-final">
            <div className="card-header">
                <div className='card-priority' style={{ color: priorityColor }}>{props.details.priority}</div>
                <div className='card-buffer'></div>
                {props.type !== "Expired" && props.type !== "Done" && <button className='react-icon' onClick={() => moveTask(props.moveType)}><TiArrowForward /></button>}
                <button className='react-icon' onClick={deleteTask}><MdDelete /></button>
            </div>
            <div className='card-title'>{props.details.title}</div>
            <div className='card-desc'>{props.details.description}</div>
            {(props.type === "Todo" || props.type === "Ongoing") && props.details.deadline !== null && <div className='card-deadline'>
                Time left: {timeleft}</div>}
        </div>
    )
}
