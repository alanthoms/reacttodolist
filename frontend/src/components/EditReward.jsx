import React from "react";
import Modal from "./Modal";
import EditForm from "./EditForm";

export default function EditReward({
  rewardElement,
  setRewards,
  isOpen,
  onClose,
}) {
  const token = localStorage.getItem("token");

  const handleSave = async (updatedReward) => {
    try {
      const response = await fetch(
        `http://localhost:4000/rewards/${rewardElement.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedReward),
        },
      );

      if (!response.ok) throw new Error(await response.text());
      const updatedFromServer = await response.json();

      setRewards((prev) =>
        prev.map((r) =>
          r.id === updatedFromServer.id ? updatedFromServer : r,
        ),
      );

      onClose();
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Reward">
      <EditForm
        itemType="reward"
        item={rewardElement}
        onSave={handleSave}
        onCancel={onClose}
      />
    </Modal>
  );
}
