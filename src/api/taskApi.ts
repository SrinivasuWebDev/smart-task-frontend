import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

export const fetchTasksByUsername = async (username: string) => {
  const response = await api.get(`/tasks/${username}`);
  return response.data;
};

export const deleteTaskById = async (taskId: number) => {
  await api.delete(`/tasks/${taskId}`);
};

export const fetchTasksDueToday = async (username: string) => {
  const response = await api.get(`/tasks/due-today/${username}`);
  return response.data;
};

export const fetchUpcomingTaskCounts = async (username: string) => {
  const response = await api.get(`/tasks/upcoming-counts/${username}`);
  return response.data;
};


export default api;
