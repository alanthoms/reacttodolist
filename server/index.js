

const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
const bcrypt = require("bcryptjs");
require('dotenv').config();

//middleware
app.use(cors({
  origin: "http://localhost:5173", // Vite dev server port
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));


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
        return res.status(400).json({ error: "Please provide username, email, and password." });
    }

    try {
        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const result = await pool.query(
            "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email",
            [username, email, hashedPassword]
        );

        res.json({ message: "User registered successfully!", user: result.rows[0] });
    } catch (error) {
        console.error("Registration error:", error.message);

        // Handle unique constraint violation (duplicate username/email)
        if (error.code === "23505") {
            return res.status(400).json({ error: "Username or email already exists." });
        }

        res.status(500).json({ error: "Registration failed." });
    }
});

// User Login (simplified)

app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    try {
        const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        const user = userResult.rows[0];
        if (!user) return res.status(400).json({ error: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET, // ✅ use your real secret
            { expiresIn: "1h" }
        );

        res.json({ user: { id: user.id, username: user.username, email: user.email }, token });
    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ error: "Login failed" });
    }
});


// Create a task
app.post('/tasks', authenticateToken, async (req, res) => {
    try {
        const { text } = req.body;
        const userId = req.user.userId; // Get userId from the token
        const newTask = await pool.query(
            "INSERT INTO tasks (user_id, text) VALUES ($1, $2) RETURNING *", //returns the newly created task
            [userId, text]
        );
        res.json(newTask.rows[0]); // return the newly created task [0] cleans output
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to create task" });
    }
});


//get all tasks
app.get('/tasks', authenticateToken, async (req, res) => {
    try {
        const allTasks = await pool.query("SELECT * FROM tasks WHERE user_id = $1", [req.user.userId]);
        res.json(allTasks.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to retrieve tasks" });
    }
});

//get a specific task
app.get('/tasks/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const task = await pool.query("SELECT * FROM tasks WHERE id = $1 AND user_id = $2", [id, req.user.userId]);
        res.json(task.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to retrieve task" });
    }
});

//update a task
app.put('/tasks/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const updatedTask = await pool.query(
            "UPDATE tasks SET text = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
            [text, id, req.user.userId]
        );
        res.json(updatedTask.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to update task" });
    }
});

//delete a task
app.delete('/tasks/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM tasks WHERE id = $1 AND user_id = $2", [id, req.user.userId]);
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



app.listen(4000, () => {
    console.log('Server is running on port 4000');
});

