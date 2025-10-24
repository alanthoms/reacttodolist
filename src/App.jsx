import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/home";
import { Shop } from "./pages/shop";
import { Layout } from "./Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Navigate } from "react-router-dom";


function App() {

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem("token"); // true if token exists
    });
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
        localStorage.setItem("rewards", JSON.stringify(rewards));
        console.log("Saved tasks:", tasks);
        console.log("Saved completed tasks:", completedTasks);
        console.log("Saved total effort:", totalEffort);
        console.log("Saved rewards:", rewards);
    }, [tasks, completedTasks, totalEffort, rewards]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:4000/api/data"); // or your backend route
                if (!response.ok) throw new Error("Failed to fetch data");
                const result = await response.json();
                console.log("Fetched data from backend:", result);
                // you can store it in state if needed
                // setData(result);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <Router>
            <Routes>
                {/* Public routes */}
                <Route
                    path="/login"
                    element={isAuthenticated ? <Navigate to="/" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
                />
                <Route
                    path="/register"
                    element={isAuthenticated ? <Navigate to="/" /> : <Register />}
                />
                {/* Private routes */}
                <Route element={<Layout />}>
                    <Route
                        path="/"
                        element={isAuthenticated ? (
                            <Home
                                totalEffort={totalEffort}
                                setTotalEffort={setTotalEffort}
                                tasks={tasks}
                                setTasks={setTasks}
                                completedTasks={completedTasks}
                                setCompletedTasks={setCompletedTasks}
                            />
                        ) : (
                            <Navigate to="/login" />
                        )}
                    />
                    <Route
                        path="/shop"
                        element={isAuthenticated ? (
                            <Shop
                                totalEffort={totalEffort}
                                setTotalEffort={setTotalEffort}
                                rewards={rewards}
                                setRewards={setRewards}
                                completedTasks={completedTasks}
                                setCompletedTasks={setCompletedTasks}
                            />
                        ) : (
                            <Navigate to="/login" />
                        )}
                    />
                </Route>
                {/* Fallback to Home if route not found */}
                <Route path="*" element={<Home />} />
            </Routes>
        </Router>
    );
}

export default App;
