const { VITE_API_URL } = import.meta.env

const mainUrl = `${VITE_API_URL}/api/gastos/`




export const getAll = async () => {
    const response = await fetch(mainUrl);

    if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail || 'Error desconocido';
        throw new Error(errorMessage);
    }

    const data = await response.json();
    return data; // Devuelve el objeto completo
};

export const store = async (params) => {
    const url = `${mainUrl}store/`;
    const header = {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }
    const response = await fetch(url, header);

    if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail || 'Error desconocido';
        throw new Error(errorMessage);
    }

    return response.json();
};

export const update = async (id_gasto, params) => {
    const url = `${mainUrl}update/${id_gasto}/`;
    const header = {
        method: 'PUT',
        body: JSON.stringify(params),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }
    const response = await fetch(url, header);

    if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail || 'Error desconocido';
        throw new Error(errorMessage);
    }

    return response.json();
};

export const remove = async (id_gasto) => {
    const url = `${mainUrl}delete/${id_gasto}/`;
    const header = {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }
    const response = await fetch(url, header);

    if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail || 'Error desconocido';
        throw new Error(errorMessage);
    }

    return response.json();
};