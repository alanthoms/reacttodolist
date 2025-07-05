import ToDoShop from "../components/ToDoShop"

export function Shop({ totalEffort, setTotalEffort }){
    return(
        <>
        <h1>Shop Page</h1>
        <ToDoShop totalEffort={totalEffort} setTotalEffort={setTotalEffort}/>
        </>
    )
}