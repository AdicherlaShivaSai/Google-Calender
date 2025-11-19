import React, { useEffect, useState } from "react";
import { minutesToTimeString } from "../utils/time";
import type { CalendarEvent } from "../types/event";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  data: {
    dayIndex: number;
    startMinutes: number;
    endMinutes: number;
    event?: CalendarEvent;
  } | null;
  onClose: () => void;
  onSave: (title: string) => void;
  onDelete?: () => void;
};

const EventModal: React.FC<Props> = ({
  open,
  mode,
  data,
  onClose,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (data?.event) setTitle(data.event.title);
    else setTitle("");
  }, [data]);

  if (!open || !data) return null;

  const startTime = minutesToTimeString(data.startMinutes);
  const endTime = minutesToTimeString(data.endMinutes);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded p-5 w-80 shadow-lg">
        <h2 className="text-lg font-semibold mb-3">
          {mode === "create" ? "Create Event" : "Edit Event"}
        </h2>

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

        <div className="flex justify-between gap-3">

          {mode === "edit" && (
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition"
            >
              Delete
            </button>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                onSave(title);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
            >
              Save
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EventModal;
