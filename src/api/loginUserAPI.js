// api.js (actualizado)
const {VITE_API_URL} = import.meta.env

export const login = async (email, password) => {
    const url = `${VITE_API_URL}/api/token/`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: 'admin', password: password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail || 'Error desconocido';
        throw new Error(errorMessage);
    }

    return response.json();
};