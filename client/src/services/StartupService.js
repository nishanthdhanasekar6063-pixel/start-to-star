import axios from "axios";

const API_URL = "http://localhost:8080/api/startups";

// GET ALL STARTUPS
export const getAllStartups = () => {
  return axios.get(API_URL);
};

// CREATE STARTUP
export const createStartup = (startup) => {
  return axios.post(API_URL, startup);
};

// GET STARTUP BY ID
export const getStartupById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

// UPDATE STARTUP
export const updateStartup = (id, startup) => {
  return axios.put(`${API_URL}/${id}`, startup);
};

// DELETE STARTUP
export const deleteStartup = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};