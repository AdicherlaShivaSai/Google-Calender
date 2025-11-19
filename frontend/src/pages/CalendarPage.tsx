import React, { useEffect, useRef, useState } from "react";
import { yToMinutes } from "../utils/time";
import EventModal from "../components/EventModal.tsx";
import { useEventContext } from "../context/EventContext.tsx";
import {
  createEvent,
  deleteEventApi,
  getEvents,
  updateEvent,
} from "../api/events.ts";
import { formatDate, getMonday } from "../utils/week.ts";

const hours = Array.from({ length: 24 }, (_, i) => i);

const CalendarPage = () => {
  const columnRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const today = new Date();
  const isSameDate = (d1: Date, d2: Date) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  const [editEventData, setEditEventData] = useState<any>(null);
  const { state, dispatch } = useEventContext();
  const events = state.events;

  const [visualDrag, setVisualDrag] = useState<{
    dayIndex: number;
    topPercent: number;
    heightPercent: number;
  } | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [newEventData, setNewEventData] = useState<{
    dayIndex: number;
    startMinutes: number;
    endMinutes: number;
  } | null>(null);

  const handleMouseDown = (e: React.MouseEvent, dayIndex: number) => {
    const col = columnRefs.current[dayIndex];
    if (!col) return;

    const rect = col.getBoundingClientRect();
    const y = e.clientY - rect.top;

    const startMinutes = yToMinutes(y, rect.height);
    setNewEventData({
      dayIndex,
      startMinutes,
      endMinutes: startMinutes + 30,
    });

    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !newEventData) return;

    const col = columnRefs.current[newEventData.dayIndex];
    if (!col) return;

    const rect = col.getBoundingClientRect();
    const y = e.clientY - rect.top;

    const endMinutes = yToMinutes(y, rect.height);

    const topMinutes = Math.min(newEventData.startMinutes, endMinutes);
    const bottomMinutes = Math.max(newEventData.startMinutes, endMinutes);

    setVisualDrag({
      dayIndex: newEventData.dayIndex,
      topPercent: (topMinutes / 1440) * 100,
      heightPercent: ((bottomMinutes - topMinutes) / 1440) * 100,
    });

    setNewEventData({
      ...newEventData,
      endMinutes: bottomMinutes,
    });
  };

  const handleMouseUp = () => {
    if (!isDragging || !newEventData) return;

    setIsDragging(false);
    setVisualDrag(null);
    setModalOpen(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, newEventData]);

  const handleSaveEvent = async (title: string) => {
    // EDIT MODE
    if (editEventData && editEventData.event) {
      const updatedEvent = {
        ...editEventData.event,
        title,
      };

      const res = await updateEvent(editEventData.event.id, updatedEvent);

      dispatch({
        type: "UPDATE_EVENT",
        payload: res.data,
      });

      setModalOpen(false);
      setEditEventData(null);
      return;
    }

    // CREATE MODE
    if (newEventData) {
      const newEvent = {
        title,
        dayIndex: newEventData.dayIndex,
        startMinutes: newEventData.startMinutes,
        endMinutes: newEventData.endMinutes,
        weekStart: "2024-01-01", 
      };

      const res = await createEvent(newEvent);

      dispatch({
        type: "ADD_EVENT",
        payload: res.data,
      });

      setModalOpen(false);
      setNewEventData(null);
    }
  };

  const handleDeleteEvent = async () => {
    if (!editEventData?.event) return;

    const eventId = editEventData.event.id;

    try {

      await deleteEventApi(eventId);

      dispatch({
        type: "DELETE_EVENT",
        payload: eventId,
      });

      setModalOpen(false);
      setEditEventData(null);
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  const loadEventsForWeek = async () => {
    const weekString = formatDate(weekStart);
    const res = await getEvents(weekString);

    dispatch({
      type: "SET_EVENTS",
      payload: res.data,
    });
  };

  useEffect(() => {
    loadEventsForWeek();
  }, [weekStart]);

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Header */}
      <div className="h-12 flex items-center justify-center bg-gray-100 border-b">
        <h1 className="text-lg font-semibold">Weekly Calendar</h1>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center gap-3 p-4 border-b bg-gray-50">
        <button
          onClick={() =>
            setWeekStart(new Date(weekStart.getTime() - 7 * 86400000))
          }
          className="px-3 py-1 border rounded hover:bg-gray-100 transition"
        >
          ← Previous
        </button>

        <button
          onClick={() => setWeekStart(getMonday(new Date()))}
          className="px-3 py-1 border rounded hover:bg-gray-100 transition"
        >
          Today
        </button>

        <button
          onClick={() =>
            setWeekStart(new Date(weekStart.getTime() + 7 * 86400000))
          }
          className="px-3 py-1 border rounded hover:bg-gray-100 transition"
        >
          Next →
        </button>

        <span className="ml-5 font-semibold text-lg">
          Week of {formatDate(weekStart)}
        </span>
      </div>

      <div className="flex border-b">
        <div className="border-r w-16"></div>

        {days.map((day, i) => {
          const date = new Date(weekStart);
          date.setDate(weekStart.getDate() + i);

          return (
            <div
              key={i}
              className={`flex-1 text-center py-2 font-semibold border-r ${
                isSameDate(date, today)
                  ? "bg-blue-100 text-blue-700 border-b-2 border-blue-500"
                  : ""
              }`}
            >
              {day} <br />
              <span className="text-sm text-gray-600">
                {date.getDate()}/{date.getMonth() + 1}
              </span>
            </div>
          );
        })}
        <div className="w-[15px]"></div>
      </div>

      {/* SCROLL AREA */}
      <div className="flex flex-1 overflow-y-auto">
        {/* LEFT TIME COLUMN */}
        <div className="w-16 border-r">
          {hours.map((h) => (
            <div
              key={h}
              className="h-12 border-b text-xs text-gray-500 flex items-center justify-center"
            >
              {h}:00
            </div>
          ))}
        </div>

        {/* RIGHT WEEK GRID */}
        <div className="flex flex-1">
          {[0, 1, 2, 3, 4, 5, 6].map((d) => (
            <div
              key={d}
              className={`relative flex-1 border-r h-[1152px] ${
                isSameDate(
                  new Date(
                    weekStart.getFullYear(),
                    weekStart.getMonth(),
                    weekStart.getDate() + d
                  ),
                  today
                )
                  ? "bg-blue-50"
                  : ""
              }`}
              ref={(el) => {
                columnRefs.current[d] = el;
              }}
              onMouseDown={(e) => handleMouseDown(e, d)}
            >
              {/* 24 Hour Rows */}
              {hours.map((h) => (
                <div key={h} className="h-12 border-b"></div>
              ))}

              {/* Drag Rectangle */}
              {visualDrag && visualDrag.dayIndex === d && (
                <div
                  className="absolute left-0 right-0 bg-blue-400 bg-opacity-30 border border-blue-600 rounded"
                  style={{
                    top: `${visualDrag.topPercent}%`,
                    height: `${visualDrag.heightPercent}%`,
                  }}
                ></div>
              )}

              {/* Render Events */}
              {events
                .filter((ev) => ev.dayIndex === d)
                .map((ev) => {
                  const top = (ev.startMinutes / 1440) * 100;
                  const height =
                    ((ev.endMinutes - ev.startMinutes) / 1440) * 100;

                  return (
                    <div
                      key={ev.id}
                      onClick={(e) => {
                        e.stopPropagation(); 
                        setEditEventData({
                          dayIndex: ev.dayIndex,
                          startMinutes: ev.startMinutes,
                          endMinutes: ev.endMinutes,
                          event: ev,
                        });
                        setModalOpen(true);
                      }}
                      className="absolute left-1 right-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] p-1.5 rounded-md shadow-md cursor-pointer transition-all"
                      style={{
                        top: `${top}%`,
                        height: `${height}%`,
                      }}
                    >
                      {ev.title}
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
      <EventModal
        open={modalOpen}
        mode={editEventData ? "edit" : "create"}
        data={editEventData || newEventData}
        onClose={() => {
          setModalOpen(false);
          setNewEventData(null);
          setEditEventData(null);
        }}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
};

export default CalendarPage;
