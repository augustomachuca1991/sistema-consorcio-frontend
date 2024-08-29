import React from 'react'
import { useTranslation } from 'react-i18next';

const InputComponent = ({ name, type, value, onChange, msgError, minValue = '0' }) => {
    const { t } = useTranslation();
    const inputProps = {
        type,
        name,
        id: name,
        value,
        onChange,
        autoComplete: name,
        className: `focus:outline-none block w-full rounded-md border border-gray-200 bg-transparent px-4 py-3 text-gray-600 transition duration-300 invalid:ring-2 invalid:ring-red-400 focus:ring-2 focus:ring-cyan-300 ${msgError && 'ring-2 ring-red-400'}`,
    };

    // Conditionally add the min attribute if the type is number
    if (type === 'number') {
        inputProps.min = minValue.toString();
    }

    return (
        <>
            <label htmlFor={name} className="text-gray-600 ">{t(name)}*</label>
            <input {...inputProps} />
        </>
    )
}

export default InputComponent;