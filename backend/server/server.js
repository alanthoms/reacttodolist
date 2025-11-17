require("dotenv").config();
console.log("DB_USER env var:", process.env.DB_USER);
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcryptjs");

//middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Vite dev server port
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

console.log("✅ CORS middleware loaded");

//fullstack needs data from client side by request body
//gives access to req.body property
app.use(express.json());
app.use((req, res, next) => {
  console.log("🔹 Request received:", req.method, req.url);
  next();
});

const jwt = require("jsonwebtoken");

// 🔒 Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach decoded user info to the request
    next(); // continue to the next handler
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};

//ROUTES//

// User Registration (simplified)
app.post("/api/auth/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "Please provide username, email, and password." });
  }

  try {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const result = await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hashedPassword]
    );

    res.json({
      message: "User registered successfully!",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    // Handle unique constraint violation (duplicate username/email)
    if (error.code === "23505") {
      return res
        .status(400)
        .json({ error: "Username or email already exists." });
    }

    res.status(500).json({ error: "Registration failed." });
  }
});

// User Login (simplified)

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  try {
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    const user = userResult.rows[0];
    if (!user)
      return res.status(400).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid email or password" });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET, // ✅ use your real secret
      { expiresIn: "1h" }
    );

    res.json({
      user: { id: user.id, username: user.username, email: user.email },
      token,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

// Create a task
app.post("/tasks", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Get userId from the token
    const { text, effort, repeatable } = req.body;
    const newTask = await pool.query(
      "INSERT INTO tasks (user_id, text, effort, repeatable) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, text, effort, repeatable]
    );
    res.json(newTask.rows[0]); // return the newly created task [0] cleans output
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to create task" });
  }
});

//get all tasks
app.get("/tasks", authenticateToken, async (req, res) => {
  try {
    const allTasks = await pool.query(
      "SELECT * FROM tasks WHERE user_id = $1",
      [req.user.userId]
    );
    res.json(allTasks.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to retrieve tasks" });
  }
});

//get a specific task
app.get("/tasks/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const task = await pool.query(
      "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
      [id, req.user.userId]
    );
    res.json(task.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to retrieve task" });
  }
});

//update a task
app.put("/tasks/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { text, effort, repeatable } = req.body; // <-- include all fields

    const updatedTask = await pool.query(
      "UPDATE tasks SET text = $1, effort = $2, repeatable = $3 WHERE id = $4 AND user_id = $5 RETURNING *",
      [text, effort, repeatable, id, req.user.userId]
    );

    if (updatedTask.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(updatedTask.rows[0]); // <-- send updated task to frontend
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to update task" });
  }
});

//delete a task
app.delete("/tasks/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM tasks WHERE id = $1 AND user_id = $2", [
      id,
      req.user.userId,
    ]);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

app.get("/api/data", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, username FROM users");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Complete a task and add effort to user
app.post("/tasks/:id/complete", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Start a transaction so both updates happen together
    await pool.query("BEGIN");

    // Get the task and its effort
    const taskResult = await pool.query(
      "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
      [id, req.user.userId]
    );

    if (taskResult.rows.length === 0) {
      await pool.query("ROLLBACK");
      return res.status(404).json({ error: "Task not found" });
    }

    const task = taskResult.rows[0];

    // Insert into completed_tasks table and get that completed task
    const completedTask = await pool.query(
      "INSERT INTO completed_tasks (user_id, task_id, text, effort, completed_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *",
      [req.user.userId, task.id, task.text, task.effort]
    );

    // Update user's total effort
    const updatedUser = await pool.query(
      "UPDATE users SET effort = effort + $1 WHERE id = $2 RETURNING id, username, effort",
      [task.effort, req.user.userId]
    );

    // Delete task if not repeatable
    if (!task.repeatable) {
      await pool.query("DELETE FROM tasks WHERE id = $1 AND user_id = $2", [
        task.id,
        req.user.userId,
      ]);
    }

    await pool.query("COMMIT");

    res.json({
      message: "Task completed!",
      //queryObject: completedTask.rows[0], // Return the completed task object
      // completedTask is a QueryResult object; completedTask.rows[0] is the inserted row
      completedTask: completedTask.rows[0],
      user: updatedUser.rows[0],
    });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err.message);
    res.status(500).json({ error: "Failed to complete task" });
  }
});

// Get completed tasks for a user
app.get("/completed-tasks", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM completed_tasks WHERE user_id = $1 ORDER BY id DESC",
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch completed tasks" });
  }
});

// Get current user info (e.g. total effort)
app.get("/api/user", authenticateToken, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT id, username, effort FROM users WHERE id = $1",
      [req.user.userId]
    );
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch user info" });
  }
});

//remove completed task
app.delete("/completed-tasks/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      "DELETE FROM completed_tasks WHERE id = $1 AND user_id = $2",
      [id, req.user.userId]
    );
    res.json({ message: "Completed task deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to delete completed task" });
  }
});

//
//REWARD ROUTES
//

// Get all rewards
app.get("/rewards", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM rewards WHERE user_id = $1 ORDER BY id DESC",
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch rewards" });
  }
});

// Add a reward
app.post("/rewards", authenticateToken, async (req, res) => {
  const { text, effort, repeatable } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO rewards (user_id, text, effort, repeatable) VALUES ($1, $2, $3, $4) RETURNING *",
      [req.user.userId, text, effort, repeatable]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to add reward" });
  }
});

// Purchase a reward
app.post("/rewards/:id/purchase", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Get reward
    const rewardResult = await pool.query(
      "SELECT * FROM rewards WHERE id = $1 AND user_id = $2",
      [id, req.user.userId]
    );

    if (rewardResult.rows.length === 0) {
      return res.status(404).json({ error: "Reward not found" });
    }

    const reward = rewardResult.rows[0];

    // Check if user has enough points
    const userResult = await pool.query(
      "SELECT effort FROM users WHERE id = $1",
      [req.user.userId]
    );
    const totalEffort = userResult.rows[0].effort;

    if (totalEffort < reward.effort) {
      return res.status(400).json({ error: "Not enough points to purchase" });
    }

    // Deduct points
    await pool.query("UPDATE users SET effort = effort - $1 WHERE id = $2", [
      reward.effort,
      req.user.userId,
    ]);

    // Insert into purchased_rewards
    await pool.query(
      `INSERT INTO purchased_rewards (user_id, reward_id, text, effort_spent, purchased_at)
   VALUES ($1, $2, $3, $4, NOW())`,
      [req.user.userId, reward.id, reward.text, reward.effort]
    );

    // Delete reward if not repeatable
    if (!reward.repeatable) {
      await pool.query("DELETE FROM rewards WHERE id = $1 AND user_id = $2", [
        id,
        req.user.userId,
      ]);
    }

    res.json({ message: "Reward purchased successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to purchase reward" });
  }
});

// Remove a reward
app.delete("/rewards/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM rewards WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Reward not found" });
    }

    res.json({ message: "Reward removed successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to remove reward" });
  }
});

// Update a reward
app.put("/rewards/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { text, effort, repeatable } = req.body;

  try {
    const updatedReward = await pool.query(
      "UPDATE rewards SET text = $1, effort = $2, repeatable = $3 WHERE id = $4 AND user_id = $5 RETURNING *",
      [text, effort, repeatable, id, req.user.userId]
    );

    if (updatedReward.rows.length === 0) {
      return res.status(404).json({ error: "Reward not found" });
    }

    res.json(updatedReward.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to update reward" });
  }
});

// Get purchased rewards
app.get("/purchased-rewards", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, reward_id, text, effort_spent, purchased_at
       FROM purchased_rewards
       WHERE user_id = $1
       ORDER BY purchased_at DESC`,
      [req.user.userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching purchased rewards:", err.message);
    res.status(500).json({ error: "Failed to fetch purchased rewards" });
  }
});

//start server
app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
