import React, { useState } from 'react'

function ToDoList({ totalEffort, setTotalEffort, tasks, setTasks }) {
    //    const [tasks, setTasks] = useState([]);

    const [newTask, setNewTask] = useState("");

    //store effort values
    const [newEffort, setNewEffort] = useState('');
    //stores completed tasks for display

    const [completedTasks, setCompletedTasks] = useState([]);

    const [isRepeatable, setIsRepeatable] = useState(false);

    function handleRepeatableChange(event) {
        setIsRepeatable(event.target.checked);
    }

    //event handler, function uses setter for newTask to access event parameter target's value
    // enables visual change of textbox value
    function handleInputChange(event) {
        setNewTask(event.target.value);

    }

    function handleEffortChange(event) {
        setNewEffort(event.target.value);
    }


    function addTask() {
        //updater function
        //setTasks is state updater functoin for tasks array from Use State
        //passing in an updater function
        //idk t is latest version of task list and spreading by ... helps update immutably 

        //simple if that removes whitespace and checks for empty string
        /*if(newTask.trim() !==""){
            setTasks(t => [...t,newTask])
            setNewTask("");
        }*/

        if (newTask.trim() !== '' && newEffort.trim() !== '') {
            const effortValue = parseInt(newEffort, 10);
            if (!isNaN(effortValue) && effortValue >= 0) {
                setTasks(t => [...t, { text: newTask, effort: effortValue, repeatable: isRepeatable, flashed: false }]);
                setNewTask('');
                setNewEffort('');
            } else {
                alert('Please enter a valid non-negative number for effort.');
            }
        }

    }

    function addCompletedTask(task) {
        setCompletedTasks(ct => [...ct, task]);
    }
        

    function clearTask(index) {
        //add effort from deleted task
        const task = tasks[index];
        setTotalEffort(prev => prev + task.effort);


        // Flash it briefly
        const updatedTasks = [...tasks];
        updatedTasks[index].flashed = true;

        // Remove flash after a delay (e.g. 500ms)

        setTimeout(() => {

            if (!task.repeatable) {
                //filter with arrow function, if index matches i, filtered out
                // we keep i that doesnt equal index
                const updatedTasks = tasks.filter((_, i) => i !== index);
                setTasks(updatedTasks);
            } else {
                const resetFlash = [...updatedTasks];
                resetFlash[index].flashed = false;
                setTasks(resetFlash);
            }
        }, 500);

        addCompletedTask(task);


    }


    function removeTask(index) {
        // dont add effort from deleted task
        //filter with arrow function, if index matches i, filtered out
        // we keep i that doesnt equal index
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
    }

    function moveTaskUp(index) {


        //check if at the top
        if (index > 0) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index - 1]] = [updatedTasks[index - 1], updatedTasks[index]]
            setTasks(updatedTasks);
        }

    }

    function moveTaskDown(index) {

        //check if at the bottom
        if (index < tasks.length - 1) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index + 1]] = [updatedTasks[index + 1], updatedTasks[index]]
            setTasks(updatedTasks);
        }

    }
    return (
        <div className="to-do-list">
            <h1>Tasks</h1>
            <h2>Total Effort from Completed Tasks: {totalEffort}</h2>
            <form className="task-form"
                onSubmit={(e) => {
                    e.preventDefault(); // prevent page reload
                    addTask();
                }}
            >
                <input
                    type="text"
                    placeholder="Enter a task..."
                    value={newTask}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="number"
                    placeholder="Effort (e.g. 3)"
                    value={newEffort}
                    onChange={handleEffortChange}
                    min="0"
                    required
                />
                <button
                    type="button"
                    onClick={() => setIsRepeatable(!isRepeatable)}
                    style={{
                        fontSize: '18px',
                        padding: '4px 8px',
                        background: isRepeatable ? 'aquamarine' : 'grey',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    🔁
                </button>
                <button type="submit">Add</button>
            </form>

            <ol>
                {tasks.map((taskElement, index) =>
                    <li key={index} className={`task-item ${taskElement.flashed ? 'flashed' : ''}`} ><span className="text">
                        {taskElement.text} (Effort: {taskElement.effort}) {taskElement.repeatable && '🔁'}
                    </span>

                        <button
                            className='delete-button'
                            //arrow function so it does not call function immediately
                            onClick={() => clearTask(index)}>
                            ✅
                        </button>

                        <button
                            className='move-button'
                            //arrow function so it does not call function immediately
                            onClick={() => moveTaskUp(index)}>
                            ⬆️
                        </button>
                        <button
                            className='move-button'
                            //arrow function so it does not call function immediately
                            onClick={() => moveTaskDown(index)}>
                            ⬇️
                        </button>
                        <button
                            className='remove-button'
                            //arrow function so it does not call function immediately
                            onClick={() => removeTask(index)}>
                            ⛔️
                        </button>
                    </li>
                )}
            </ol>
        </div>
    );
}
export default ToDoList;