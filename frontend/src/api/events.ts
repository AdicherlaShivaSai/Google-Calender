import axios from "axios";
import { BACKEND_URL } from "../config";

const API = `${BACKEND_URL}/events`;

export const getEvents = (weekStart: string) =>
  axios.get(`${API}?week=${weekStart}`);

export const createEvent = (eventData: any) =>
  axios.post(API, eventData);

export const updateEvent = (id: string, eventData: any) =>
  axios.put(`${API}/${id}`, eventData);

export const deleteEventApi = (id: string) =>
  axios.delete(`${API}/${id}`);
