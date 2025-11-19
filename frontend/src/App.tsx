import CalendarPage from "./pages/CalendarPage.tsx";
import { EventProvider } from "./context/EventContext";

export default function App() {
  return (
    <EventProvider>
      <CalendarPage />
    </EventProvider>
  );
}
