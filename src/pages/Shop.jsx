import ToDoShop from "../components/ToDoShop"

export function Shop({ totalEffort, setTotalEffort, rewards, setRewards }){
    return(
        <>
        <ToDoShop totalEffort={totalEffort} setTotalEffort={setTotalEffort} rewards={rewards} setRewards={setRewards}/>
        </>
    )
}