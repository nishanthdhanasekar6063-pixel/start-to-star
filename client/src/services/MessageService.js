import axios from "axios";

const API_URL = "http://localhost:8080/api/messages";

// SEND MESSAGE
export const sendMessage = (message) => {
  return axios.post(API_URL, message);
};

// GET USER MESSAGES
export const getUserMessages = (email) => {
  return axios.get(`${API_URL}/${email}`);
};

// GET ALL MESSAGES
export const getAllMessages = () => {
  return axios.get(API_URL);
};

// DELETE MESSAGE
export const deleteMessage = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};