export const requiredField = (value, fieldName) => {
    return value ? undefined : `${fieldName} es requerido`;
};

export const validEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? undefined : 'Email inválido';
};

export const minLength = (value, minLength, fieldName) => {
    return value.length >= minLength ? undefined : `${fieldName} debe tener al menos ${minLength} caracteres`;
};