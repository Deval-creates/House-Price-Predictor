const BASE_URL = "http://127.0.0.1:8000";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
};

export const addFavourite = async (propertyData) => {
    const token = localStorage.getItem("token");
    
    if (!token) {
        throw new Error("Please login to add favourites");
    }

    const res = await fetch(`${BASE_URL}/favourites`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(propertyData)
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Failed to add favourite");
    }

    return res.json();
};

export const getFavourites = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
        throw new Error("Please login to view favourites");
    }

    const res = await fetch(`${BASE_URL}/favourites`, {
        headers: getAuthHeaders()
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Failed to fetch favourites");
    }

    return res.json();
};

export const removeFavourite = async (propertyId) => {
    const token = localStorage.getItem("token");
    
    if (!token) {
        throw new Error("Please login to remove favourites");
    }

    const res = await fetch(`${BASE_URL}/favourites/${propertyId}`, {
        method: "DELETE",
        headers: getAuthHeaders()
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Failed to remove favourite");
    }

    return res.json();
};

export const checkFavourite = async (propertyId) => {
    const token = localStorage.getItem("token");
    
    if (!token) {
        return { is_favourite: false };
    }

    const res = await fetch(`${BASE_URL}/favourites/check/${propertyId}`, {
        headers: getAuthHeaders()
    });

    if (!res.ok) {
        return { is_favourite: false };
    }

    return res.json();
};

export const toggleFavourite = async (propertyData) => {
    const isFav = await checkFavourite(propertyData.property_id);
    
    if (isFav.is_favourite) {
        return await removeFavourite(propertyData.property_id);
    } else {
        return await addFavourite(propertyData);
    }
};