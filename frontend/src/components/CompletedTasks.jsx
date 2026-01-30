import React from "react";
import { useState } from "react";
import Icon from "@mdi/react";
import { mdiDelete } from "@mdi/js";

function CompletedTasks({ completedTasks, onRemove }) {
  const [showCompleted, setShowCompleted] = useState(false);
  return (
    <div>
      <button
        className="toggle-completed-button"
        onClick={() => setShowCompleted(!showCompleted)}
      >
        {showCompleted ? "Hide Completed Tasks" : "Show Completed Tasks"}
      </button>

      <div
        className={`completed-section ${showCompleted ? "visible" : "hidden"}`}
      >
        <h1>Completed Tasks</h1>
        <ol>
          {completedTasks.map((ctaskElement) => (
            <li
              key={ctaskElement.id}
              className={`task-item ${ctaskElement.flashed ? "flashed" : ""}`}
            >
              <span className="text">
                {ctaskElement.text} (Effort: {ctaskElement.effort}){" "}
                {ctaskElement.repeatable && "🔁"}
              </span>
              <span>{ctaskElement.date}</span>
              <span>
                {new Date(ctaskElement.completed_at).toLocaleString()}
              </span>
              <button
                className="remove-completed-button"
                //arrow function so it does not call function immediately
                onClick={() => onRemove(ctaskElement.id)}
              >
                <Icon path={mdiDelete} size={1} />
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default CompletedTasks;
