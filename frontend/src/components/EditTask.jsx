import React from "react";
import Modal from "./Modal";
import EditForm from "./EditForm";

export default function EditTask({ taskElement, setTasks, isOpen, onClose }) {
  const token = localStorage.getItem("token");

  const handleSave = async (updatedTask) => {
    try {
      const response = await fetch(
        `http://localhost:4000/tasks/${taskElement.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedTask),
        }
      );

      if (!response.ok) throw new Error(await response.text());
      const updatedFromServer = await response.json();

      setTasks((tasks) =>
        tasks.map((t) =>
          t.id === updatedFromServer.id ? updatedFromServer : t
        )
      );

      onClose();
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Task">
      <EditForm
        itemType="task"
        item={taskElement}
        onSave={handleSave}
        onCancel={onClose}
      />
    </Modal>
  );
}
