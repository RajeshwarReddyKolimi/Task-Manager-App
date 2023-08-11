import React, { useState } from 'react'
import "./user.css";
import { AiOutlineClose } from "react-icons/ai";
import { v4 as uuidv4 } from 'uuid';
export default function Form(props) {
    const [warning, setWarning] = useState('');
    const { logout, setChanged, setShowTask, formTitle } = props;
    const { type = '', cardId = '', title = '', priority = '', description = '', deadline = null } = props.details || {};
    async function addTask(e) {
        e.preventDefault();
        const title = document.getElementById('add-task-title').value.trim();
        const priority = document.getElementById('add-task-priority').value.trim();
        const description = document.getElementById('add-task-desc').value.trim();
        const deadline = document.getElementById('add-task-deadline').value.trim();
        if (title === "") {
            return setWarning("Title cannot be empty")
        }
        if (description === "") {
            return setWarning("Description cannot be empty")
        }
        try {
            setWarning('');
            const token = localStorage.getItem('token');
            const response = await fetch('https://taskmanagerappbyrajeshwar.onrender.com/addTask', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ cardId: uuidv4(), title: title, priority: priority, description: description, deadline: deadline })
            });
            const data = await response.json();
            if (response.ok) {
                if (data.message === "Invalid")
                    logout();
                else {
                    setChanged(prev => !prev);
                    setShowTask(false);
                }
            }
            else {
                console.error("Couldn't Add Task");
            }
        } catch (error) {
            console.error("Couldn't Add Task");
        }
    }

    async function editTask(e) {
        e.preventDefault();
        const curtitle = document.getElementById('add-task-title').value.trim();
        const curpriority = document.getElementById('add-task-priority').value.trim();
        const curdescription = document.getElementById('add-task-desc').value.trim();
        const curdeadline = document.getElementById('add-task-deadline').value.trim();
        if (curtitle === "") {
            return setWarning("Title cannot be empty")
        }
        if (curdescription === "") {
            return setWarning("Description cannot be empty")
        }
        try {
            setWarning('');
            const token = localStorage.getItem('token');
            const response = await fetch('https://taskmanagerappbyrajeshwar.onrender.com/editTask', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ type: type, cardId: cardId, title: curtitle, priority: curpriority, description: curdescription, deadline: curdeadline })
            });
            const data = await response.json();
            if (response.ok) {
                if (data.message === "Invalid")
                    logout();
                else {
                    setChanged(prev => !prev);
                    setShowTask(false);
                }
            }
            else {
                console.error("Couldn't Edit Task");
            }
        } catch (error) {
            console.error("Couldn't Edit Task");
        }
    }

    return (
        <div className="form-back" onClick={(e) => {
            if (e.target.className !== 'form-back')
                return;
            e.stopPropagation();
            setShowTask(false);
        }}>
            <form action="/" className="form-container" onSubmit={formTitle === "Add Task" ? addTask : editTask}>
                <button type="button" className='form-close react-icon' onClick={() => {
                    setShowTask(false)
                }}>< AiOutlineClose /></button>
                <h2 className="form-header">{formTitle}</h2>
                <div className="form-field">
                    <label htmlFor="add-task-title" className="form-label">Title</label>
                    <input type="text" name="add-task-title" defaultValue={title} id="add-task-title" className="form-input" />
                </div>
                <div className="form-field">
                    <label htmlFor="add-task-priority" className="form-label">Priority</label>
                    <select name="add-task-priority" id="add-task-priority" className='form-input' defaultValue={priority}>
                        <option value="Low" >Low</option>
                        <option value="High">High</option>
                    </select>
                </div>
                <div className="form-field">
                    <label htmlFor="add-task-desc" className="form-label">Description</label>
                    <textarea name="add-task-desc" defaultValue={description} id="add-task-desc" className="form-input" ></textarea>
                </div>

                <div className="form-field">
                    <label htmlFor="add-task-deadline" className="form-label">Deadline</label>
                    <input type="datetime-local" defaultValue={deadline} min={new Date().toISOString().slice(0, 16)} name="add-task-deadline" id="add-task-deadline" className="form-input" />
                </div>
                {warning !== "" && <div className='form-warning'>{warning}</div>}
                <button type="submit" id="add-task-submit" className='form-button buttons'>Submit</button>
            </form >
        </div >
    )
}
