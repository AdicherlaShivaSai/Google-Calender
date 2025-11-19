# 📅 Google Calendar Clone (React + Node.js + MongoDB)

A full-stack weekly calendar application inspired by Google Calendar.  
Features drag-to-create events, edit/delete, week navigation, backend persistence, and a clean modular architecture.

---

## 🚀 Features

### 🔹 Frontend (React + TypeScript + Tailwind)
- Weekly calendar grid (7 days × 24 hours)
- Drag to select time range
- Create / Edit / Delete events
- Highlight today's date
- Smooth week navigation (Previous / Today / Next)
- Fully responsive layout
- Global state management using Context + Reducer
- Axios communication with backend API

### 🔹 Backend (Node.js + Express + MongoDB Atlas)
- REST API for events
- Create / Get (weekly) / Update / Delete
- Mongoose schema with timestamps
- Week-based event storage
- CORS configured

---

## 📁 Folder Structure

```
frontend/
  src/
    api/
      events.ts
    components/
      EventModal.tsx
    context/
      EventContext.tsx
      eventReducer.ts
    pages/
      CalendarPage.tsx
    utils/
      time.ts
      week.ts
    types/
      event.ts
  .env
  package.json

backend/
  controllers/
    eventController.js
  models/
    Event.js
  routes/
    events.js
  server.js
  .env
  package.json
```

---

## 🛠 Installation & Running

### Frontend:
```
cd frontend
npm install
npm run dev
```

### Backend:
```
cd backend
npm install
npm run dev
```

### Environment Variables:
Create `.env` inside frontend:

```
VITE_BACKEND_URL="http://localhost:5000"
```
Create `.env` inside backend:

```
MONGO_URI="mongodb+srv://<user>:<pass>@cluster.mongodb.net/google-calendar?retryWrites=true&w=majority"
```

---

## 🧪 API Endpoints

| Method | Endpoint            | Description               |
|--------|---------------------|---------------------------|
| GET    | /events?week=YYYY-MM-DD | Get events for week |
| POST   | /events             | Create new event         |
| PUT    | /events/:id         | Update event             |
| DELETE | /events/:id         | Delete event             |

---

## 🎯 Why This Project Is Strong for Interviews

- Clean architecture  
- Advanced UI logic (drag selection, time-to-pixel mapping)  
- Full-stack real-world implementation  
- State management + backend integration  
- Production-ready layout and UX  

---

## 📄 License
None — This project is for assignment purposes only.
