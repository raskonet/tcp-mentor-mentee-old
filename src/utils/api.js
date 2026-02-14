import { base_url } from "./urls";

// Helper to handle 401s
const handleAuthError = (res) => {
  if (res.status === 401 || res.status === 403) {
    localStorage.clear(); // Clear all data
    window.location.href = '/login'; // Force redirect
    return true;
  }
  return false;
};

export const fetchDataFromApi = async (api_endpoint, api_parameter) => {
  const accessToken = localStorage.getItem("access_token");
  const options = {
    method: "GET",
    headers: {},
  };

  if (accessToken) {
    options.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(
    `${base_url}${api_endpoint}/` +
      `${api_parameter}`,
    options
  );

  if (handleAuthError(res)) return { status_code: 401 }; // Stop processing

  const data = await res.json();
  return data;
};

export const fetchDataWithEndPoint = async (api_endpoint) => {
  const accessToken = localStorage.getItem("access_token");
  const options = {
    method: "GET",
    headers: {},
  };

  if (accessToken) {
    options.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${base_url}${api_endpoint}/`, options);
  
  if (handleAuthError(res)) return { status_code: 401 };

  const data = await res.json();
  return data;
};

const getCookie = (name) => {
  if (!document.cookie) return null;
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='))
    ?.split('=')[1];
  return cookieValue || null;
};

export const fetchDataFromApiWithResponse = async (bodyData, api_endpoint) => {
  const csrfToken = getCookie('csrftoken');
  const accessToken = localStorage.getItem("access_token");
  
  const headers = { 
    "Content-Type": "application/json" 
  };

  if (csrfToken) {
    headers['X-CSRFToken'] = csrfToken;
  }
  
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(bodyData),
    credentials: 'include'
  };
  
  const res = await fetch(`${base_url}${api_endpoint}`, options);

  if (handleAuthError(res)) return { status_code: 401 };

  const data = await res.json();
  return data;
};
