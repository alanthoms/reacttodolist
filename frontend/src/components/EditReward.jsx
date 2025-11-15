import React, { useState } from "react";
import Modal from "./Modal";

function EditReward({ rewardElement, setRewards, isOpen, onClose }) {
  const token = localStorage.getItem("token");
  const [text, setText] = useState(rewardElement.text);
  const [effort, setEffort] = useState(rewardElement.effort);
  const [repeatable, setRepeatable] = useState(rewardElement.repeatable);

  async function handleSubmit(e) {
    e.preventDefault();
    const updatedReward = {
      ...rewardElement,
      text,
      effort: parseInt(effort),
      repeatable,
    };
    try {
      const res = await fetch(
        `http://localhost:4000/rewards/${rewardElement.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedReward),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      const rewardFromDB = await res.json();
      setRewards((prev) =>
        prev.map((r) => (r.id === rewardFromDB.id ? rewardFromDB : r))
      );
      onClose();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Reward">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Reward name"
          required
        />
        <input
          type="number"
          value={effort}
          onChange={(e) => setEffort(e.target.value)}
          placeholder="Effort"
          min="0"
          required
        />
        <label>
          <input
            type="checkbox"
            checked={repeatable}
            onChange={(e) => setRepeatable(e.target.checked)}
          />{" "}
          Repeatable 🔁
        </label>
        <div className="modal-buttons">
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default EditReward;
