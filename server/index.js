const express = require('express');
const app = express();
const cors = require('cors');
const pool  = require('./db');
const bcrypt = require("bcryptjs");

//middleware
app.use(cors());
/** 
app.use(cors({
  origin: "http://localhost:5173", // Vite dev server port
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
*/

console.log("✅ CORS middleware loaded");

//fullstack needs data from client side by request body
//gives access to req.body property 
app.use(express.json());
app.use((req, res, next) => {
  console.log("🔹 Request received:", req.method, req.url);
  next();
});



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

// Create a task
app.post('/tasks', async (req, res) => {
    try {
        const { text, userId } = req.body;
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
app.get('/tasks', async (req, res) => {
    try {
        const allTasks = await pool.query("SELECT * FROM tasks");
        res.json(allTasks.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to retrieve tasks" });
    }
});

//get a specific task
app.get('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const task = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
        res.json(task.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to retrieve task" });
    }
});

//update a task
app.put('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const updatedTask = await pool.query(
            "UPDATE tasks SET text = $1 WHERE id = $2 RETURNING *",
            [text, id]
        );
        res.json(updatedTask.rows[0]);
    }           catch (err) { 
        console.error(err.message);
        res.status(500).json({ error: "Failed to update task" });
    }
});

//delete a task
app.delete('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
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
