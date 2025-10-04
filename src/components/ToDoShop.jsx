import React, { useState } from 'react';

function ToDoShop({ totalEffort, setTotalEffort, rewards, setRewards, completedTasks, setCompletedTasks }) {
  const [newReward, setNewReward] = useState("");
  const [newEffort, setNewEffort] = useState('');
  const [isRepeatable, setIsRepeatable] = useState(false);

  function handleInputChange(event) {
    setNewReward(event.target.value);
  }

  function handleEffortChange(event) {
    setNewEffort(event.target.value);
  }

  function addReward() {
    const effortValue = parseInt(newEffort, 10);
    if (!isNaN(effortValue) && effortValue >= 0) {
      setRewards(r => [
        ...r,
        { text: newReward, effort: effortValue, repeatable: isRepeatable, flashed: false }
      ]);
      setNewReward('');
      setNewEffort('');
    } else {
      alert('Please enter a valid non-negative number for effort.');
    }
  }

  function purchaseReward(index) {
    const reward = rewards[index];
    if (totalEffort >= reward.effort) {
      setTotalEffort(prev => prev - reward.effort);

      // Flash briefly
      const updatedRewards = [...rewards];
      updatedRewards[index].flashed = true;
      setRewards(updatedRewards);

      setTimeout(() => {
        if (!reward.repeatable) {
          setRewards(rewards.filter((_, i) => i !== index));
        } else {
          const resetFlash = [...updatedRewards];
          resetFlash[index].flashed = false;
          setRewards(resetFlash);
        }
      }, 500);
    } else {
      alert('You do not have enough points to purchase');
    }
  }

  function removeReward(index) {
    setRewards(rewards.filter((_, i) => i !== index));
  }

  return (
    <div className="to-do-list">
        <h1>Shop</h1>
      <h2>Total Effort from Completed Tasks: {totalEffort}</h2>
      <form className = "task-form"
        onSubmit={(e) => {
          e.preventDefault();
          addReward();
        }}
      >
        <input
          type="text"
          placeholder="Enter Reward"
          value={newReward}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          placeholder="Effort Cost"
          value={newEffort}
          onChange={handleEffortChange}
          min="0"
          required
        />
        <button
          type="button"
          onClick={() => setIsRepeatable(!isRepeatable)}
          style={{
            fontSize: '18px',
            padding: '4px 8px',
            background: isRepeatable ? 'aquamarine' : 'grey',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔁
        </button>
        <button type="submit">Add</button>
      </form>

      <ol>
        {rewards.map((reward, index) => (
          <li key={index} className={`task-item ${reward.flashed ? 'flashed' : ''}`}>
            <span className="text">
              {reward.text} (Effort: {reward.effort}) {reward.repeatable && '🔁'}
            </span>
            <button className="delete-button" onClick={() => purchaseReward(index)}>
              ✅
            </button>
            <button className="remove-button" onClick={() => removeReward(index)}>
              ⛔️
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default ToDoShop;
