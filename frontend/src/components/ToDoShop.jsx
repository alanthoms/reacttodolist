import React, { useState } from "react";
import EditReward from "./EditReward";
function ToDoShop({ totalEffort, setTotalEffort, rewards, setRewards }) {
  const token = localStorage.getItem("token");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingReward, setEditingReward] = useState(null);

  const [newReward, setNewReward] = useState("");
  const [newEffort, setNewEffort] = useState("");
  const [isRepeatable, setIsRepeatable] = useState(false);

  //purchased rewards
  const [purchasedRewards, setPurchasedRewards] = useState([]);
  const [showPurchased, setShowPurchased] = useState(false);

  //Handle input change
  function handleInputChange(event) {
    setNewReward(event.target.value);
  }

  function handleEffortChange(event) {
    setNewEffort(event.target.value);
  }

  // Add reward to backend
  async function addReward() {
    const effortValue = parseInt(newEffort, 10);
    if (isNaN(effortValue) || effortValue < 0) {
      alert("Please enter a valid non-negative number for effort.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/rewards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: newReward,
          effort: effortValue,
          repeatable: isRepeatable,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const rewardFromDB = await res.json();
      setRewards((r) => [...r, rewardFromDB]);
      setNewReward("");
      setNewEffort("");
    } catch (err) {
      console.error(err.message);
    }
  }
  // Purchase reward (subtracts totalEffort)
  async function purchaseReward(index) {
    const reward = rewards[index];
    if (totalEffort < reward.effort) {
      alert("Not enough points to purchase this reward");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:4000/rewards/${reward.id}/purchase`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      // Update total effort
      setTotalEffort((prev) => prev - reward.effort);

      // Flash reward
      const updatedRewards = [...rewards];
      updatedRewards[index].flashed = true;
      setRewards(updatedRewards);

      setPurchasedRewards((prev) => [
        ...prev,
        {
          ...reward,
          purchased_at: new Date().toISOString(),
        },
      ]);

      // Remove reward after flash if not repeatable

      setTimeout(() => {
        if (!reward.repeatable) {
          setRewards((prev) => prev.filter((_, i) => i !== index));
        } else {
          const resetFlash = [...updatedRewards];
          resetFlash[index].flashed = false;
          setRewards(resetFlash);
        }
      }, 500);
    } catch (err) {
      console.error(err.message);
    }
  }

  // Remove reward (does not affect totalEffort)
  async function removeReward(index) {
    const reward = rewards[index];
    try {
      const res = await fetch(`http://localhost:4000/rewards/${reward.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());

      setRewards((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <div className="to-do-list">
      <div className="text-red-500">Tailwind works!</div>
      <h1>Shop</h1>
      <h2>Total Effort from Completed Tasks: {totalEffort}</h2>
      <form
        className="task-form"
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
            fontSize: "18px",
            padding: "4px 8px",
            background: isRepeatable ? "aquamarine" : "grey",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          🔁
        </button>
        <button type="submit">Add</button>
      </form>

      {isEditOpen && editingReward && (
        <EditReward
          rewardElement={editingReward}
          setRewards={setRewards}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
        />
      )}

      <ol>
        {rewards.map((reward, index) => (
          <li
            key={index}
            className={`task-item ${reward.flashed ? "flashed" : ""}`}
          >
            <span className="text">
              {reward.text} (Effort: {reward.effort}){" "}
              {reward.repeatable && "🔁"}
            </span>
            <button
              className="edit-button"
              onClick={() => {
                setEditingReward(reward);
                setIsEditOpen(true);
              }}
            >
              ✏️ Edit
            </button>
            <button
              className="purchase-button"
              onClick={() => purchaseReward(index)}
            >
              ✅ Buy
            </button>
            <button
              className="remove-button"
              onClick={() => removeReward(index)}
            >
              ⛔️ Remove
            </button>
          </li>
        ))}
      </ol>
      <button
        className="toggle-purchased-button"
        onClick={() => setShowPurchased(!showPurchased)}
      >
        {showPurchased ? "Hide Purchased Rewards" : "Show Purchased Rewards"}
      </button>

      <div
        className={`purchased-section ${showPurchased ? "visible" : "hidden"}`}
      >
        <h2>Purchased Rewards</h2>
        <ol>
          {purchasedRewards.map((reward, index) => (
            <li key={index} className="task-item">
              <span className="text">
                {reward.text} (Cost: {reward.effort}){" "}
                {reward.repeatable && "🔁"}
              </span>
              <span>
                Purchased at: {new Date(reward.purchased_at).toLocaleString()}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default ToDoShop;
