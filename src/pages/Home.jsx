import TodoList from '../components/ToDoList.jsx'


export function Home({ totalEffort, setTotalEffort }){
    return(
        <>
        <TodoList totalEffort={totalEffort} setTotalEffort={setTotalEffort}/>
      </>
    )
}
