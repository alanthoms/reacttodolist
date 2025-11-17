import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Home } from "./pages/Home";
import { Shop } from "./pages/Shop";
import { Layout } from "./components/Layout";
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
  const [purchasedRewards, setPurchasedRewards] = useState([]);

  // Fetch tasks from backend on load
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return;

      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      try {
        // Fetch all endpoints in parallel
        const [tasksRes, completedRes, rewardsRes, userRes, purchasedRes] =
          await Promise.all([
            fetch("http://localhost:4000/tasks", { headers }),
            fetch("http://localhost:4000/completed-tasks", { headers }),
            fetch("http://localhost:4000/rewards", { headers }),
            fetch("http://localhost:4000/api/user", { headers }),
            fetch("http://localhost:4000/purchased-rewards", { headers }),
          ]);

        // Check if all responses are ok
        if (!tasksRes.ok || !completedRes.ok || !rewardsRes.ok || !userRes.ok) {
          throw new Error("Failed to fetch one or more resources");
        }

        // Parse all responses in parallel
        const [tasksData, completedData, rewardsData, userData, purchasedData] =
          await Promise.all([
            tasksRes.json(),
            completedRes.json(),
            rewardsRes.json(),
            userRes.json(),
            purchasedRes.json(),
          ]);

        // Update state
        setTasks(tasksData);
        setCompletedTasks(completedData);
        setRewards(rewardsData);
        setUser(userData);
        setTotalEffort(userData.effort);
        setPurchasedRewards(purchasedData);
      } catch (err) {
        console.error("Error fetching data:", err);
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
          element={
            isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" /> : <Register />}
        />

        {/* Private routes */}
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              isAuthenticated ? (
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
              )
            }
          />
          <Route
            path="/shop"
            element={
              isAuthenticated ? (
                <Shop
                  totalEffort={totalEffort}
                  setTotalEffort={setTotalEffort}
                  rewards={rewards}
                  setRewards={setRewards}
                  completedTasks={completedTasks}
                  setCompletedTasks={setCompletedTasks}
                  purchasedRewards={purchasedRewards}
                  setPurchasedRewards={setPurchasedRewards}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
