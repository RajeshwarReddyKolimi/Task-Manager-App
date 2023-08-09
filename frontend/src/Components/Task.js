import React, { useState } from 'react';
import Form from "./Form";
import Card from "./Card";
import "./card.css";
export default function Task(props) {

    const [showTask, setShowTask] = useState(false);
    return (
        <div className="task">
            {showTask && (
                <div className="task-add">
                    <Form setShowTask={setShowTask} setChanged={props.setChanged} />
                </div>
            )}
            <div className="task-header">
                <h2 className="task-title">{props.type}</h2>
                {props.type === "Todo" ? <button onClick={() => setShowTask(true)} className="add-task">+</button> : <div className="task-circle"></div>}
            </div>
            <div className='task-type'>
                {props.taskItem.map((task, index) => (
                    <Card details={task} index={index} key={index} type={props.type} moveType={props.moveType} setChanged={props.setChanged} />
                ))}
            </div>
            <div className='task-footer'></div>
        </div>
    )
}
