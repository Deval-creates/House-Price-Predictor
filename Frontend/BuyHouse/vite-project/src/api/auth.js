const BASE_URL = "http://127.0.0.1:8000";

export const signupUser = async (email, password) => {
    const res = await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    
    if (res.ok && data.token) {
        // Store token and user_id in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user_id);
    }
    
    return data;
};

export const loginUser = async (email, password) => {
    const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    
    if (res.ok && data.token) {
        // Store token and user_id in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user_id);
    }
    
    return data;
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
};

export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};

export const getAuthToken = () => {
    return localStorage.getItem("token");
};