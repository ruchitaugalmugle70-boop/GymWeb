import axios from "axios";

let rawBaseURL = import.meta.env.VITE_API_URL || "https://gymweb-s8rt.onrender.com/api";
rawBaseURL = rawBaseURL.trim().replace(/\/+$/, "");
if (!rawBaseURL.endsWith("/api")) {
    rawBaseURL += "/api";
}

const API = axios.create({
    baseURL: rawBaseURL,
    headers: {
        "Content-Type": "application/json"
    }
});

// Interceptor to inject JWT Token on every request
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ─── Auth Endpoints ──────────────────────────────────────────────────────────
export const registerUser = async (userData) => {
    const response = await API.post("/auth/register", userData);
    return response.data;
};

export const loginUser = async (credentials) => {
    const response = await API.post("/auth/login", credentials);
    return response.data;
};

export const googleLogin = async (googleData) => {
    const payload = typeof googleData === "string" ? { idToken: googleData } : googleData;
    const response = await API.post("/auth/google", payload);
    return response.data;
};

export const getProfile = async () => {
    const response = await API.get("/auth/profile");
    return response.data;
};

export const updateProfile = async (data) => {
    const response = await API.patch("/auth/profile", data);
    return response.data;
};

// ─── Exercise Endpoints ──────────────────────────────────────────────────────
export const getAllExercises = async () => {
    const response = await API.get("/exercises");
    return response.data;
};

export const getExerciseById = async (id) => {
    const response = await API.get(`/exercises/${id}`);
    return response.data;
};

// ─── Workout Endpoints ───────────────────────────────────────────────────────
export const getAllWorkouts = async () => {
    const response = await API.get("/workouts");
    return response.data;
};

export const getWorkoutById = async (id) => {
    const response = await API.get(`/workouts/${id}`);
    return response.data;
};

export const createWorkout = async (workoutData) => {
    const response = await API.post("/workouts", workoutData);
    return response.data;
};

// ─── Progress Endpoints ──────────────────────────────────────────────────────
export const getMyProgress = async () => {
    const response = await API.get("/progress/my-progress");
    return response.data;
};

export const logProgress = async (progressData) => {
    const response = await API.post("/progress", progressData);
    return response.data;
};

export default API;
