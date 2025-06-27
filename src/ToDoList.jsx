import React, {useState} from 'react'

function ToDoList(){

    const [tasks, setTasks] = useState(["Eat Breakfast", "Shower","Watch a film"]);
    const [newTask, setNewTask] = useState("");

    //event handler, function uses setter for newTask to access event parameter target's value
    // enables visual change of textbox value
    function handleInputChange(event){
        setNewTask(event.target.value);

    }

    function addTask(){
        //updater function
        //setTasks is state updater functoin for tasks array from Use State
        //passing in an updater function
        //idk t is latest version of task list and spreading by ... helps update immutably 

        //simple if that removes whitespace and checks for empty string
        if(newTask.trim() !==""){
            setTasks(t => [...t,newTask])
            setNewTask("");
        }
    }

    function deleteTask(index){

        //filter with arrow function, if index matches i, filtered out
        // we keep i that doesnt equal index
        const updatedTasks = tasks.filter((_,i) => i !== index);
        setTasks(updatedTasks);
    }

    function moveTaskUp(index){


    }

    function moveTaskDown(index){

    }
    return(
        <div className ="to-do-list">
            <h1>To-Do-List</h1>
            <div>
                <input
                    type="text"
                    placeholder="Enter a task..."
                    value={newTask}
                    onChange={handleInputChange}
                />
                <button
                    className="add-button"
                    onClick={addTask}
                    >
                    Add   

                </button>
            </div>
            <ol>
                {tasks.map((taskElement,index)=>
                    <li key={index}><span className ="text">{taskElement}</span>
                    <button 
                    className='delete-button' 
                    //arrow function so it does not call function immediately
                    onClick={() => deleteTask(index)}>
                        Delete
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
                    </li>
                )}
            </ol>
        </div>
    );
}
export default ToDoList;