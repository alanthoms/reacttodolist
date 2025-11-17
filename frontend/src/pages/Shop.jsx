import ToDoShop from "../components/ToDoShop";

export function Shop({
  totalEffort,
  setTotalEffort,
  rewards,
  setRewards,
  completedTasks,
  setCompletedTasks,
  purchasedRewards,
  setPurchasedRewards,
}) {
  return (
    <>
      <ToDoShop
        totalEffort={totalEffort}
        setTotalEffort={setTotalEffort}
        rewards={rewards}
        setRewards={setRewards}
        completedTasks={completedTasks}
        setCompletedTasks={setCompletedTasks}
        purchasedRewards={purchasedRewards}
        setPurchasedRewards={setPurchasedRewards}
      />
    </>
  );
}
