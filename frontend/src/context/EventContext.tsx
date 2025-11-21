import React, { createContext, useContext, useReducer } from "react";
import type { CalendarEvent } from "../types/event.ts";

type State = {
  events: CalendarEvent[];
};

type Action =
  | { type: "ADD_EVENT"; payload: CalendarEvent }
  | { type: "DELETE_EVENT"; payload: string }
  | { type: "UPDATE_EVENT"; payload: CalendarEvent }
  | { type: "SET_EVENTS"; payload: CalendarEvent[] };

const initialState: State = {
  events: [],
};

function eventReducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_EVENT":
      return {
        ...state,
        events: [...state.events, action.payload],
      };

    case "DELETE_EVENT":
      return {
        ...state,
        events: state.events.filter(
          (ev: any) => (ev._id || ev.id) !== action.payload
        ),
      };
      
    case "UPDATE_EVENT":
      return {
        ...state,
        events: state.events.map((ev) =>
          ev.id === action.payload.id ? action.payload : ev
        ),
      };
    case "SET_EVENTS":
      return {
        ...state,
        events: action.payload,
      };

    default:
      return state;
  }
}

const EventContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => {},
});

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(eventReducer, initialState);

  return (
    <EventContext.Provider value={{ state, dispatch }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => useContext(EventContext);
