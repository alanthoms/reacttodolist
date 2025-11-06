import React, { useState } from "react";
import * as bootstrap from 'bootstrap';
const EditTask = ({ taskElement, setTasks }) => {
    const [taskName, setTaskName] = useState(taskElement.text);
    const [effort, setEffort] = useState(String(taskElement.effort));
    const [isRepeatable, setIsRepeatable] = useState(taskElement.repeatable);
    const token = localStorage.getItem("token");

    const resetState = () => {
        setTaskName(taskElement.text);
        setEffort(String(taskElement.effort));
        setIsRepeatable(taskElement.repeatable);
    };

    //edit task function
    const updateTask = async () => {
        try {
            const body = { text: taskName, effort: Number(effort), repeatable: isRepeatable };
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

            // Hide the modal programmatically after update
            const updatedTask = await response.json(); // <-- get updated task
            console.log("Updated task from server:", updatedTask);

            setTasks(tasks => tasks.map(t => (t.id === updatedTask.id ? updatedTask : t)));//update task in state instead of window reload

            // Close modal
            const modalEl = document.getElementById(`id-${taskElement.id}`);
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();
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
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h4 className="modal-title" id="exampleModalLabel">Edit Task</h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={resetState}
                            ></button>
                        </div>

                        <div className="modal-body">
                            <input type="text" className="form-control" placeholder="Task Name" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
                            <input type="number" className="form-control mt-3" value={effort} onChange={(e) => { console.log("Typed:", e.target.value); setEffort(e.target.value); }} />
                            <p>Effort state: {effort}</p>

                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={`repeatableCheck-${taskElement.id}`}
                                checked={isRepeatable}
                                onChange={() => setIsRepeatable(!isRepeatable)}
                            />
                            <label className="form-check-label" htmlFor={`repeatableCheck-${taskElement.id}`}>
                                Repeatable
                            </label>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-dismiss="modal"
                                onClick={e => updateTask(taskElement.id, taskName, effort, isRepeatable)}

                            >
                                Save
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                data-bs-dismiss="modal"
                                onClick={resetState}
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
