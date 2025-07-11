import TodoList from '../components/ToDoList.jsx'


export function Home({ totalEffort, setTotalEffort, tasks, setTasks }){
    return(
        <>
        <TodoList totalEffort={totalEffort} setTotalEffort={setTotalEffort} tasks={tasks} setTasks={setTasks}/>
      </>
    )
}
