// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || "";

// API Endpoints for more modularity
export const API_ENDPOINTS = {
  UPLOAD_PDF: `${API_BASE_URL}/api/upload-pdf/`,
};

const getCSRFToken = () => {
  const cookieName = "csrftoken";
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${cookieName}=`))
    ?.split("=")[1];
  return cookieValue;
};

// Axios default config; will be used for API requests needing CSRF token
export const axiosConfig = {
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
    "X-CSRFToken": getCSRFToken(),
  },
};
