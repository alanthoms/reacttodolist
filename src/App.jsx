import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/home";
import { Shop } from "./pages/shop";
import { Layout } from "./Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { getUser, logout } from "./components/Logout";

function App() {
  const [user, setUser] = useState(() => getUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getUser());

  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [totalEffort, setTotalEffort] = useState(0);
  const [rewards, setRewards] = useState([]);

  // Fetch tasks from backend on load
  useEffect(() => {
  const fetchData = async () => {
    if (!isAuthenticated) return;

    const token = localStorage.getItem("token");

    try {
      // Fetch active tasks
      const tasksRes = await fetch("http://localhost:4000/tasks", {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch completed tasks
      const completedRes = await fetch("http://localhost:4000/completed-tasks", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!tasksRes.ok || !completedRes.ok) {
        throw new Error("Failed to fetch tasks or completed tasks");
      }

      const tasksData = await tasksRes.json();
      const completedData = await completedRes.json();

      setTasks(tasksData);
      setCompletedTasks(completedData);


    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  fetchData();
}, [isAuthenticated]);


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
            ) : <Navigate to="/login" />}
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
            ) : <Navigate to="/login" />}
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
