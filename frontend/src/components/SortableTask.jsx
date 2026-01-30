import React from "react";
import Icon from "@mdi/react";
import { mdiPencilOutline, mdiCheck, mdiDelete } from "@mdi/js";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableTask({
  task,
  completeTask,
  removeTask,
  setEditingTask,
  setIsEditOpen,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`task-item ${task.flashed ? "flashed" : ""}`}
    >
      <span className="text">
        {task.text} (Effort: {task.effort}) {task.repeatable && "🔁"}
      </span>

      <button
        className="edit-button"
        onClick={() => {
          setEditingTask(task);
          setIsEditOpen(true);
        }}
      >
        <Icon path={mdiPencilOutline} size={1} />
      </button>

      <button className="delete-button" onClick={() => completeTask(task.id)}>
        <Icon path={mdiCheck} size={1} />
      </button>

      <button className="remove-button" onClick={() => removeTask(task.id)}>
        <Icon path={mdiDelete} size={1} />
      </button>
    </li>
  );
}
