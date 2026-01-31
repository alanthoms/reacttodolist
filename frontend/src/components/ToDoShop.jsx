import React, { useState } from "react";
import EditReward from "./EditReward";
import Icon from "@mdi/react";

import { mdiPencilOutline } from "@mdi/js";
import { mdiDelete } from "@mdi/js";

import { mdiCheck } from "@mdi/js";

import { mdiSync } from "@mdi/js";
function ToDoShop({
  totalEffort,
  setTotalEffort,
  rewards,
  setRewards,
  purchasedRewards,
  setPurchasedRewards,
}) {
  const token = localStorage.getItem("token");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingReward, setEditingReward] = useState(null);

  const [newReward, setNewReward] = useState("");
  const [newEffort, setNewEffort] = useState("");
  const [isRepeatable, setIsRepeatable] = useState(false);

  //purchased rewards
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
        },
      );
      if (!res.ok) throw new Error(await res.text());
      await res.json();

      // Update total effort
      setTotalEffort((prev) => prev - reward.effort);

      // Only remove reward if it is NOT repeatable
      if (!reward.repeatable) {
        setRewards((prev) => prev.filter((_, i) => i !== index));
      }

      // Refresh purchased rewards from backend
      const purchasedRes = await fetch(
        "http://localhost:4000/purchased-rewards",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const purchasedData = await purchasedRes.json();
      setPurchasedRewards(purchasedData);
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

  //remove purchased reward

  async function removePurchasedReward(index) {
    const token = localStorage.getItem("token");
    try {
      const deleteTask = await fetch(
        `http://localhost:4000/purchased-rewards/${purchasedRewards[index].id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!deleteTask.ok) {
        const error = await deleteTask.text();
        throw new Error(`Server error: ${deleteTask.status} - ${error}`);
      }
      const updatedPurchasedRewards = purchasedRewards.filter(
        (_, i) => i !== index,
      );
      setPurchasedRewards(updatedPurchasedRewards);
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <div className="to-do-list">
      <div className="flex justify-center items-center  ">
        <div className=" text-7xl text-white leading-none font-sans pr-7 font-extrabold">
          WANTS
        </div>
        <div className=" text-7xl text-white leading-none font-sans ">
          Effort Points:{totalEffort}
        </div>
      </div>
      <form
        className="task-form flex items-center gap-2 mt-4 p-4 rounded-lg bg-white/80 shadow-[0_0_10px_rgba(255,255,255,1),0_4px_6px_rgba(0,0,0,0.1)]"
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
            borderRadius: "4px",
            cursor: "pointer",
            background: isRepeatable ? "red" : "grey",
            transition: "all 0.3s ease", // Smooths out the color, rotation, and glow
            transform: isRepeatable ? "rotate(180deg)" : "rotate(0deg)",
            boxShadow: isRepeatable
              ? "0 0 15px 2px red" // Aquamarine glow
              : "none",
          }}
        >
          <Icon path={mdiSync} size={1} />
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
              <Icon path={mdiPencilOutline} size={1} />
            </button>
            <button
              className="purchase-button"
              onClick={() => purchaseReward(index)}
            >
              <Icon path={mdiCheck} size={1} />
            </button>
            <button
              className="remove-button"
              onClick={() => removeReward(index)}
            >
              <Icon path={mdiDelete} size={1} />
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
                {reward.text} (Cost: {reward.effort_spent}){" "}
              </span>
              <span>
                Purchased at: {new Date(reward.purchased_at).toLocaleString()}
              </span>
              <button
                className="remove-purchased-button"
                //arrow function so it does not call function immediately
                onClick={() => removePurchasedReward(index)}
              >
                Remove
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default ToDoShop;
