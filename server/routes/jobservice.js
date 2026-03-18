const BASE_URL = "http://localhost:4000/jobs";

export const JobService = {
  createJob: async (data) => {
    const res = await fetch(`${BASE_URL}/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  listJobs: async (page = 1, limit = 10) => {
    const res = await fetch(`${BASE_URL}/list?page=${page}&limit=${limit}`);
    return res.json();
  },

  applyJob: async (id) => {
    const res = await fetch(`${BASE_URL}/apply/${id}`, {
      method: "POST"
    });
    return res.json();
  }
};
