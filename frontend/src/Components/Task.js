import React, { useState } from 'react';
import Form from "./Form";
import Card from "./Card";
import "./card.css";
export default function Task(props) {
    const { type, moveType, taskItem, setChanged, logout } = props;
    const [showAddTask, setShowAddTask] = useState(false);

    return (
        <div className="task">
            {showAddTask && (
                <div className="task-add">
                    <Form setShowTask={setShowAddTask} setChanged={setChanged} logout={logout} formTitle="Add Task" />
                </div>
            )}
            <div className="task-header">
                <h2 className="task-title">{type}</h2>
                {type === "Todo" ? <button onClick={() => setShowAddTask(true)} className="add-task">+</button> : <div className="task-circle"></div>}
            </div>
            <div className='task-type'>
                {taskItem.map((task, index) => (
                    <Card details={task} index={index} key={index} type={type} moveType={moveType} setChanged={setChanged} logout={logout} />

                ))}
            </div>
            <div className='task-footer'></div>
        </div>
    )
}
