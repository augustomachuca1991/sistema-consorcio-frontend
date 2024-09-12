const { VITE_API_URL } = import.meta.env

const mainUrl = `${VITE_API_URL}/api/inmuebles/`

export const getAllInmuebles = async () => {

    const response = await fetch(mainUrl);

    if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail || 'Error desconocido';
        throw new Error(errorMessage);
    }

    return response.json();
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

export const update = async (id_inmueble, params) => {
    const url = `${mainUrl}update/${id_inmueble}/`;
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

export const remove = async (id_inmueble) => {
    const url = `${mainUrl}delete/${id_inmueble}/`;
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