import axios from "axios";

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
    "http://localhost:5000",
});

// unify server error shape -> throw message
api.interceptors.response.use(
  (r) => r,
  (error) => {
    const resp = error?.response;
    if (resp?.data?.errorMessage) {
      return Promise.reject(new Error(resp.data.errorMessage));
    }
    if (resp?.data?.message) {
      return Promise.reject(new Error(resp.data.message));
    }
    return Promise.reject(error);
  }
);
