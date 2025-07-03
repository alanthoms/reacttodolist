import React, {useState} from 'react'

function ToDoList(){

    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    //store effort values
    const [newEffort, setNewEffort] = useState('');
    const [totalEffort, setTotalEffort] = useState(0);


    //event handler, function uses setter for newTask to access event parameter target's value
    // enables visual change of textbox value
    function handleInputChange(event){
        setNewTask(event.target.value);

    }

    function handleEffortChange(event) {
        setNewEffort(event.target.value);
    }


    function addTask(){
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
                setTasks(t => [...t, { text: newTask, effort: effortValue }]);
                setNewTask('');
                setNewEffort('');
            } else {
                alert('Please enter a valid non-negative number for effort.');
                }
            }

    }

    function deleteTask(index){
        //add effort from deleted task
        setTotalEffort(prev => prev + tasks[index].effort);

        //filter with arrow function, if index matches i, filtered out
        // we keep i that doesnt equal index
        const updatedTasks = tasks.filter((_,i) => i !== index);
        setTasks(updatedTasks);
    }

    function removeTask(index){
        // dont add effort from deleted task
        //filter with arrow function, if index matches i, filtered out
        // we keep i that doesnt equal index
        const updatedTasks = tasks.filter((_,i) => i !== index);
        setTasks(updatedTasks);
    }

    function moveTaskUp(index){


        //check if at the top
        if(index > 0){
            const updatedTasks = [...tasks];
            [updatedTasks[index],updatedTasks[index - 1]] = [updatedTasks[index -1],updatedTasks[index]]
            setTasks(updatedTasks);
        }

    }

    function moveTaskDown(index){

        //check if at the bottom
        if(index < tasks.length -1 ){
            const updatedTasks = [...tasks];
            [updatedTasks[index],updatedTasks[index + 1]] = [updatedTasks[index +1],updatedTasks[index]]
            setTasks(updatedTasks);
        }

    }
    return(
        <div className ="to-do-list">
            <h1>To-Do-List</h1>
            <div>
                <h2>Total Effort from Completed Tasks: {totalEffort}</h2>
                <input
                    type="text"
                    placeholder="Enter a task..."
                    value={newTask}
                    onChange={handleInputChange}
                />
                <input
                type="number"
          placeholder="Effort (e.g. 3)"
          value={newEffort}
          onChange={handleEffortChange}
          min="0"></input>
                <button
                    className="add-button"
                    onClick={addTask}
                    >
                    Add   

                </button>
            </div>
            <ol>
                {tasks.map((taskElement,index)=>
                    <li key={index}><span className="text">
                        {taskElement.text} (Effort: {taskElement.effort})
                        </span>

                    <button 
                    className='delete-button' 
                    //arrow function so it does not call function immediately
                    onClick={() => deleteTask(index)}>
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