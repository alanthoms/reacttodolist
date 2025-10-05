import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/home";
import { Shop } from "./pages/shop";
import { Layout } from "./Layout";

function App() {

    //  Initialize state directly from localStorage (lazy initialization)
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem("tasks");
        console.log("Loaded tasks:", JSON.parse(saved));
        return saved ? JSON.parse(saved) : [];
    });

    const [completedTasks, setCompletedTasks] = useState(() => {
        const saved = localStorage.getItem("completedTasks");
        console.log("Loaded completed tasks:", JSON.parse(saved));
        return saved ? JSON.parse(saved) : [];
    });

    const [totalEffort, setTotalEffort] = useState(() => {
        const saved = localStorage.getItem("totalEffort");
        console.log("Loaded total effort:", JSON.parse(saved));
        return saved ? JSON.parse(saved) : 0;
    });

    const [rewards, setRewards] = useState(() => {
        const saved = localStorage.getItem("rewards");
        console.log("Loaded rewards:", JSON.parse(saved));
        return saved ? JSON.parse(saved) : [];
    });

    // Save to localStorage whenever any state changes
    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
        localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
        localStorage.setItem("totalEffort", JSON.stringify(totalEffort));
        ; localStorage.setItem("rewards", JSON.stringify(rewards));
        console.log("Saved tasks:", tasks);
        console.log("Saved completed tasks:", completedTasks);
        console.log("Saved total effort:", totalEffort);
        console.log("Saved rewards:", rewards);
    }, [tasks, completedTasks, totalEffort, rewards]);

    return (
        <Router>
            <Routes>
                <Route element={<Layout />}>
                    <Route
                        path="/"
                        element={
                            <Home
                                totalEffort={totalEffort}
                                setTotalEffort={setTotalEffort}
                                tasks={tasks}
                                setTasks={setTasks}
                                completedTasks={completedTasks}
                                setCompletedTasks={setCompletedTasks}
                            />
                        }
                    />
                    <Route
                        path="/shop"
                        element={
                            <Shop
                                totalEffort={totalEffort}
                                setTotalEffort={setTotalEffort}
                                rewards={rewards}
                                setRewards={setRewards}
                                completedTasks={completedTasks}
                                setCompletedTasks={setCompletedTasks}
                            />
                        }
                    />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
