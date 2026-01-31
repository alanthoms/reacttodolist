import React, { useState } from "react";
import EditTask from "./EditTask";
import Modal from "./Modal";

import Icon from "@mdi/react";

import { mdiSync } from "@mdi/js";

import CompletedTasks from "./CompletedTasks";

import SortableTask from "./SortableTask";

import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

function ToDoList({
  totalEffort,
  setTotalEffort,
  tasks,
  setTasks,
  completedTasks,
  setCompletedTasks,
}) {
  //    const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("token");
  const [newTask, setNewTask] = useState("");

  //for tailwind modal
  const [editingTask, setEditingTask] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  //store effort values
  const [newEffort, setNewEffort] = useState("");
  //stores completed tasks for display

  const [isRepeatable, setIsRepeatable] = useState(false);

  //event handler, function uses setter for newTask to access event parameter target's value
  // enables visual change of textbox value
  function handleInputChange(event) {
    setNewTask(event.target.value);
  }

  function handleEffortChange(event) {
    setNewEffort(event.target.value);
  }

  async function addTask() {
    //updater function
    //setTasks is state updater functoin for tasks array from Use State
    //passing in an updater function
    //idk t is latest version of task list and spreading by ... helps update immutably

    //        simple if that removes whitespace and checks for empty string
    if (newTask.trim() == "" && newEffort.trim() == "") return;
    const effortValue = parseInt(newEffort, 10);
    if (isNaN(effortValue) || effortValue < 0) {
      alert("Please enter a valid non-negative number for effort.");
      return;
    }

    try {
      const body = {
        text: newTask,
        effort: effortValue,
        repeatable: isRepeatable,
      };
      const response = await fetch("http://localhost:4000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body), //converts JS object to JSON string
      });
      console.log(response);
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Server error: ${response.status} - ${error}`);
      }
      const newTaskFromServer = await response.json();
      setTasks((t) => [...t, newTaskFromServer]);
      setNewTask("");
      setNewEffort("");
    } catch (err) {
      console.error(err.message);
    }
  }

  function addCompletedTask(task) {
    setCompletedTasks((ct) => [...ct, task]);
  }

  async function completeTask(taskId) {
    const token = localStorage.getItem("token");
    const task = tasks.find((t) => t.id === taskId);

    try {
      const response = await fetch(
        `http://localhost:4000/tasks/${taskId}/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const data = await response.json();
      console.log("Fetched completed tasks:", data);

      // Update total effort (from backend, optional)
      setTotalEffort(data.user.effort);

      // Add task to completedTasks
      addCompletedTask(data.completedTask);

      // Remove task from main list if not repeatable, otherwise flash
      if (!task.repeatable) {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
      } else {
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, flashed: true } : t)),
        );
        setTimeout(() => {
          setTasks((prev) =>
            prev.map((t) => (t.id === taskId ? { ...t, flashed: false } : t)),
          );
        }, 500);
      }
    } catch (err) {
      console.error("Error completing task:", err.message);
    }
  }

  async function removeTask(taskId) {
    // dont add effort from deleted task
    //filter with arrow function, if index matches i, filtered out
    // we keep i that doesnt equal index
    //const updatedTasks = tasks.filter((_, i) => i !== index);
    //setTasks(updatedTasks);
    try {
      const deleteTask = await fetch(`http://localhost:4000/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!deleteTask.ok) {
        const error = await deleteTask.text();
        throw new Error(`Server error: ${deleteTask.status} - ${error}`);
      }
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error(err.message);
    }
  }

  async function removeCompletedTask(taskId) {
    const token = localStorage.getItem("token");
    //
    try {
      const deleteTask = await fetch(
        `http://localhost:4000/completed-tasks/${taskId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!deleteTask.ok) {
        const error = await deleteTask.text();
        throw new Error(`Server error: ${deleteTask.status} - ${error}`);
      }

      setCompletedTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error(err.message);
    }
  }
  /*
  function moveTaskUp(index) {
    //check if at the top
    if (index > 0) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index - 1]] = [
        updatedTasks[index - 1],
        updatedTasks[index],
      ];
      setTasks(updatedTasks);
    }
  }

  function moveTaskDown(index) {
    //check if at the bottom
    if (index < tasks.length - 1) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index + 1]] = [
        updatedTasks[index + 1],
        updatedTasks[index],
      ];
      setTasks(updatedTasks);
    }
  }
*/

  const getTaskPos = (id) => tasks.findIndex((task) => task.id === id);
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setTasks((prevTasks) => {
      const originalPos = getTaskPos(active.id);
      const newPos = getTaskPos(over.id);
      const newOrder = arrayMove(prevTasks, originalPos, newPos);

      // --- THE SIDE QUEST: Sync to Database ---
      fetch("http://localhost:4000/tasks/reorder", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderedIds: newOrder.map((t) => t.id) }),
      })
        .then((res) => {
          if (!res.ok) console.error("Database sync failed");
        })
        .catch((err) => console.error("Network error:", err));

      return newOrder;
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Drag only starts after moving 8px (allows clicks to pass through)
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // Require holding for 250ms on mobile to drag
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <div className="to-do-list">
      <h1>Tasks</h1>
      <h2>Total Effort from Completed Tasks: {totalEffort}</h2>
      <form
        className="task-form"
        onSubmit={(e) => {
          e.preventDefault(); // prevent page reload
          addTask();
        }}
      >
        <input
          type="text"
          placeholder="Enter a task..."
          value={newTask}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          placeholder="Effort (e.g. 3)"
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
            background: isRepeatable ? "blue" : "grey",
            transition: "all 0.3s ease", // Smooths out the color, rotation, and glow
            transform: isRepeatable ? "rotate(180deg)" : "rotate(0deg)",
            boxShadow: isRepeatable
              ? "0 0 15px 2px blue" // Aquamarine glow
              : "none",
          }}
        >
          <Icon path={mdiSync} size={1} />
        </button>
        <button type="submit">Add</button>
      </form>
      {isEditOpen && editingTask && (
        <EditTask
          taskElement={editingTask}
          setTasks={setTasks}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
        />
      )}

      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <ol>
          <SortableContext
            items={tasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((taskElement) => (
              <SortableTask
                key={taskElement.id}
                task={taskElement}
                completeTask={completeTask}
                removeTask={removeTask}
                setEditingTask={setEditingTask}
                setIsEditOpen={setIsEditOpen}
              />
            ))}
          </SortableContext>
        </ol>
      </DndContext>
      <CompletedTasks //passes array from useState
        // and creates function to call removeCompletedTask function
        completedTasks={completedTasks}
        onRemove={(taskId) => {
          removeCompletedTask(taskId);
        }}
      />
    </div>
  );
}

export default ToDoList;
