import React from 'react'
import "./user.css";
import { AiOutlineClose } from "react-icons/ai";
export default function Form(props) {

    async function addTask(e) {
        const title = document.getElementById('add-task-title').value;
        const priority = document.getElementById('add-task-priority').value;
        const description = document.getElementById('add-task-desc').value;
        const deadline = document.getElementById('add-task-deadline').value;
        e.preventDefault();
        try {
            const response = await fetch('/addTask', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: title, priority: priority, description: description, deadline: deadline })
            });
            const data = await response.json();
            if (response.ok) {
                props.setChanged(prev => !prev);
                props.setShowTask(false);
            }
            else {
                console.error(data.error);
            }
        } catch (error) {
            console.error("Error in add task catch");
        }
    }
    return (
        <div className="form-back" onClick={(e) => {
            if (e.target.className !== 'form-back')
                return;
            e.stopPropagation();
            props.setShowTask(false);
        }}>
            <form action="/" className="add-task-form form-container" onSubmit={addTask}>
                <button type="button" className='form-close react-icon' onClick={() => {
                    props.setShowTask(false)
                }}>< AiOutlineClose /></button>
                <h2 className="form-header">Add Task</h2>
                <div className="form-field">
                    <label htmlFor="add-task-title" className="form-label">Title</label>
                    <input type="text" name="add-task-title" id="add-task-title" className="form-input" required />
                </div>
                <div className="form-field">
                    <label htmlFor="add-task-priority" className="form-label">Priority</label>
                    <select name="add-task-priority" id="add-task-priority" className='form-input'>
                        <option value="Low">Low</option>
                        <option value="High">High</option>
                    </select>
                </div>
                <div className="form-field">
                    <label htmlFor="add-task-desc" className="form-label">Description</label>
                    <input type="text" name="add-task-desc" id="add-task-desc" className="form-input" required />
                </div>
                <div className="form-field">
                    <label htmlFor="add-task-deadline" className="form-label">Deadline</label>
                    <input type="datetime-local" min={new Date().toISOString().slice(0, 16)} name="add-task-deadline" id="add-task-deadline" className="form-input" />
                </div>
                <button type="submit" id="add-task-submit" className='form-button buttons'>Submit</button>
            </form>
        </div >
    )
}
