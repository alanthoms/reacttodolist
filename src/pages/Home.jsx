import TodoList from '../components/ToDoList.jsx'


export function Home({ totalEffort, setTotalEffort, tasks, setTasks, completedTasks, setCompletedTasks }){
    return(
        <>
        <TodoList totalEffort={totalEffort} setTotalEffort={setTotalEffort} tasks={tasks} setTasks={setTasks} completedTasks={completedTasks} setCompletedTasks={setCompletedTasks} />
      </>
    )
}
