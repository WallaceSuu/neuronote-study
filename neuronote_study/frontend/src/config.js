// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || "";

// API Endpoints for more modularity
export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  UPLOAD_PDF: `${API_BASE_URL}/api/upload-pdf/`,
  REGISTER: `${API_BASE_URL}/api/register/`,
  NOTES: `${API_BASE_URL}/openai/notes/`,
  FLASHCARDS: `${API_BASE_URL}/openai/flashcards/`,
  GENERATE_FLASHCARDS: `${API_BASE_URL}/openai/generate-flashcards/`,
  GET_FLASHCARDS: `${API_BASE_URL}/openai/get-flashcards/`,
  GET_USER_PDFS: `${API_BASE_URL}/api/get-user-pdfs/`,
  LOGOUT: `${API_BASE_URL}/api/logout/`,
  USER: `${API_BASE_URL}/api/user/`,
  GET_MESSAGES: `${API_BASE_URL}/openai/get-messages/`,
  SEND_MESSAGE: `${API_BASE_URL}/openai/send-message/`,
};

export const getCSRFToken = () => {
  const cookieName = "csrftoken";
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${cookieName}=`))
    ?.split("=")[1];
  return cookieValue;
};

const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

// Axios default config for regular API requests
export const axiosConfig = {
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-CSRFToken": getCSRFToken(),
    "Authorization": `Token ${getAuthToken()}`,
  },
};

// Axios config for file uploads
export const axiosFileConfig = {
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
    "X-CSRFToken": getCSRFToken(),
    "Authorization": `Token ${getAuthToken()}`,
  },
};
