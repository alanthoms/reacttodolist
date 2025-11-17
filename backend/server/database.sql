CREATE DATABASE perntodo;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  text VARCHAR(255) NOT NULL,
  effort INTEGER DEFAULT 0 CHECK (effort >= 0),
  repeatable BOOLEAN DEFAULT FALSE,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);

CREATE TABLE completed_tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
  text VARCHAR(255) NOT NULL,
  effort INTEGER NOT NULL CHECK (effort >= 0),
  completed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_completed_tasks_user_id ON completed_tasks(user_id);
CREATE INDEX idx_completed_tasks_completed_at ON completed_tasks(completed_at);

CREATE TABLE rewards (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  text VARCHAR(255) NOT NULL,
  effort INTEGER NOT NULL CHECK (effort >= 0),
  repeatable BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_rewards_user_text ON rewards(user_id, text);

CREATE TABLE effort_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  task_id INTEGER REFERENCES tasks(id) ON DELETE SET NULL,
  effort INTEGER NOT NULL CHECK (effort >= 0),
  logged_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_effort_log_user_id ON effort_log(user_id);
CREATE INDEX idx_effort_log_logged_at ON effort_log(logged_at);

CREATE TABLE purchased_rewards (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  reward_id INTEGER REFERENCES rewards(id) ON DELETE CASCADE,
  text VARCHAR(255) NOT NULL,
  effort_spent INTEGER NOT NULL CHECK (effort_spent >= 0),
  purchased_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_purchased_rewards_user_id ON purchased_rewards(user_id);
CREATE INDEX idx_purchased_rewards_purchased_at ON purchased_rewards(purchased_at);
