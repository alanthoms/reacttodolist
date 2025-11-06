import React, { useState } from "react";

const EditTask = ({ taskElement }) => {
    const [taskName, setTaskName] = useState(taskElement.text);
    const [effort, setEffort] = useState(taskElement.effort);
    const [isRepeatable, setIsRepeatable] = useState(taskElement.repeatable);
    const token = localStorage.getItem("token");


    //edit task function
    const updateTask = async (id, text, effort, repeatable) => {
        try {
            const body = { text: taskName, effort: effort, repeatable: isRepeatable };
            const response = await fetch(`http://localhost:4000/tasks/${taskElement.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(body)//converts JS object to JSON string
            });
            console.log(response);
            if (!response.ok) {
                const error = await response.text();
                throw new Error(`Server error: ${response.status} - ${error}`);
            }
            window.location.reload();
        } catch (err) {
            console.error(err.message);
        }
    }

    
      
    return (
        <>
            <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target={`#id-${taskElement.id}`}//i dont understand this id stuff
            >
                Edit
            </button>

            <div
                className="modal fade"
                id={`id-${taskElement.id}`}
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
            >
                <div className="modal-dialog"
                onClick={() => {
                                        setTaskName(taskElement.text);
                                        setEffort(taskElement.effort);
                                        setIsRepeatable(taskElement.repeatable);
                                    }}>
                    <div className="modal-content">

                        <div className="modal-header">
                            <h4 className="modal-title" id="exampleModalLabel">Edit Task</h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => {
                                        setTaskName(taskElement.text);
                                        setEffort(taskElement.effort);
                                        setIsRepeatable(taskElement.repeatable);
                                    }}
                            ></button>
                        </div>

                        <div className="modal-body">
                            <input type="text" className="form-control" placeholder="Task Name" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
                            <input type="number" className="form-control mt-3" placeholder="Effort" value={effort} onChange={(e) => setEffort(e.target.value)} />
                            <div className="form-check mt-3">
                                <label className="form-check-label" htmlFor="repeatableCheck">
                                    Repeatable
                                </label>
                                <input className="form-check-input" type="checkbox" id="repeatableCheck" />
                            </div>
                        </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    data-bs-dismiss="modal"
                                    onClick={e => updateTask(taskElement.id, taskName, effort, isRepeatable)}
                        
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    data-bs-dismiss="modal"
                                    onClick={() => {
                                        setTaskName(taskElement.text);
                                        setEffort(taskElement.effort);
                                        setIsRepeatable(taskElement.repeatable);
                                    }}
                                >
                                    Close
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </>
            );
};

            export default EditTask;
