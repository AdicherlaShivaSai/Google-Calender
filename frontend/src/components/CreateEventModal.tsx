import React, { useState } from "react";
import { minutesToTimeString } from "../utils/time";

type Props = {
  open: boolean;
  data: {
    dayIndex: number;
    startMinutes: number;
    endMinutes: number;
  } | null;
  onClose: () => void;
  onSave: (title: string) => void;
};

const CreateEventModal: React.FC<Props> = ({ open, data, onClose, onSave }) => {
  const [title, setTitle] = useState("");

  if (!open || !data) return null;

  const startTime = minutesToTimeString(data.startMinutes);
  const endTime = minutesToTimeString(data.endMinutes);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded p-5 w-80 shadow-lg">
        <h2 className="text-lg font-semibold mb-3">Create Event</h2>

        <p className="text-sm text-gray-600 mb-2">
          {startTime} → {endTime}
        </p>

        <input
          type="text"
          placeholder="Event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onSave(title);
              setTitle("");
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;
