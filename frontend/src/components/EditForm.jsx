import React, { useState, useEffect } from "react";

export default function EditForm({
  itemType = "task",
  item,
  onSave,
  onCancel,
}) {
  const [text, setText] = useState("");
  const [effort, setEffort] = useState("");
  const [isRepeatable, setIsRepeatable] = useState(false);

  useEffect(() => {
    if (item) {
      setText(item.text || "");
      setEffort(item.effort || "");
      setIsRepeatable(item.repeatable || false);
    }
  }, [item]);

  async function handleSubmit(e) {
    e.preventDefault();
    const updated = { text, effort: Number(effort), repeatable: isRepeatable };
    await onSave(updated);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {itemType === "task" ? "Task Name" : "Reward Name"}
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="capitalize mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Effort {itemType === "reward" ? "Cost" : "Value"}
        </label>
        <input
          type="number"
          min="0"
          value={effort}
          onChange={(e) => setEffort(e.target.value)}
          className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="repeatable"
          checked={isRepeatable}
          onChange={() => setIsRepeatable(!isRepeatable)}
          className="form-checkbox h-5 w-5 text-blue-600"
        />
        <label
          htmlFor="repeatable"
          className="text-gray-700 dark:text-gray-300"
        >
          Repeatable 🔁
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
        >
          Save
        </button>
      </div>
    </form>
  );
}
