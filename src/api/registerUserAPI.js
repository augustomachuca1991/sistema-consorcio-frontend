// api.js (actualizado)
const {VITE_API_URL} = import.meta.env

export const register = async (params) => {
    const url = `${VITE_API_URL}/api/users/store/`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
    });

    if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail || 'Error desconocido';
        throw new Error(errorMessage);
    }

    return response.json();
};