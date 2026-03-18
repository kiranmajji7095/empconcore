import axios from "axios";

/**
 * BASE URL
 * Must match backend route mounting
 * If backend: app.use("/jobs", jobsRoutes)
 */
const API_URL = "http://localhost:4000/jobs";

/**
 * GET TOKEN FROM LOCAL STORAGE
 */
const getToken = () => {
  return localStorage.getItem("token");
};

const jobApi = {
  // ✅ CREATE JOB
  createJob(data) {
    return axios.post(`${API_URL}/create`, data, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json"
      }
    });
  },

  // ✅ GET ALL JOBS
  getJobs() {
    return axios.get(API_URL);
  },

  // ✅ DELETE JOB
  deleteJob(id) {
    return axios.delete(`${API_URL}/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
  }
};

export default jobApi;
