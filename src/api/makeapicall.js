import axios from "axios";

export const makeApiCall = async (endpoint, params) => {
  const username = import.meta.env.VITE_USERNAME;
  const password = import.meta.env.VITE_PASSWORD;
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const auth = btoa(`${username}:${password}`);

  try {
    const response = await axios.get(`${base_url}/${endpoint}`, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
      params: params,
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error, endpoint);
  }
};

export const makePostApiCall = async (endpoint, data) => {
  const username = import.meta.env.VITE_USERNAME;
  const password = import.meta.env.VITE_PASSWORD;
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const auth = btoa(`${username}:${password}`);

  try {
    const response = await axios.post(`${base_url}/${endpoint}`, data, {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json"
      }
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error, endpoint);
  }
};

export const handleApiError = (error, endpoint) => {
  console.error(`Error calling API ${endpoint}:`, error);

  const errorResponse = {
    success: false,
    message: 'An unexpected error occurred'
  };

  if (error.response) {
    errorResponse.message = error.response.data?.message || `Server error: ${error.response.status}`;
    errorResponse.data = error.response.data;
  } else if (error.request) {
    errorResponse.message = 'Network error: No response received from server';
  } else {
    errorResponse.message = error.message || 'Error setting up the request';
  }

  return errorResponse;
};