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
  EDIT_USERNAME: `${API_BASE_URL}/api/edit-username/`,
  CHANGE_PASSWORD: `${API_BASE_URL}/api/change-password/`,
  GET_MESSAGES: `${API_BASE_URL}/openai/get-messages/`,
  SEND_MESSAGE: `${API_BASE_URL}/openai/send-message/`,
  CREATE_NOTEBOOK_NOTE: `${API_BASE_URL}/api/create-notebook-note/`,
  SIDEBAR_NOTEBOOK_NOTES: `${API_BASE_URL}/api/sidebar-notebook-notes`,
  NOTEBOOK_NOTES: `${API_BASE_URL}/api/notebook-notes`,
  UPDATE_NOTEBOOK_NOTE: `${API_BASE_URL}/api/update-notebook-note`,
  CREATE_NOTEBOOK_PAGE: `${API_BASE_URL}/api/create-notebook-page/`,
  NOTEBOOK_PAGES: `${API_BASE_URL}/api/notebook-pages/`,
  DELETE_NOTEBOOK_PAGE: `${API_BASE_URL}/api/delete-notebook-page`,
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
