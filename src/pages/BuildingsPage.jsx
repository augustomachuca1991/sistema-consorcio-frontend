import { useTranslation } from "react-i18next";
import { useAuth } from "../auth/AuthProvider";
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';

const { VITE_API_URL } = import.meta.env

const BuildingsPage = () => {
    const [msgError, setMsgError] = useState("")
    const [edificios, setEdificios] = useState([])
    const { t, i18n: { changeLanguage, language } } = useTranslation();
    const { getAccessToken } = useAuth

    const initialValues = {
        nombre: "",
        direccion: "",
        telefono: ""
    }

    const validate = ({ nombre, direccion, telefono }) => {
        let errors = {}
        if (!nombre) errors.nombre = t('Required', { Field: t('Name') });

        if (!direccion) errors.direccion = t('Required', { Field: t('Adress') });

        if (!telefono) errors.telefono = t('Required', { Field: t('Phone') });


        return errors
    }

    const onSubmit = ({ nombre, direccion, telefono }) => {
        setMsgError("");

        console.log(nombre)

        const params = {
            nombre,
            direccion,
            telefono
        };

        fetch(`${VITE_API_URL}/edificio/store/`, {
            method: "POST",
            body: JSON.stringify(params),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        console.log(t(errorData.error))
                        throw new Error(t(errorData.error));
                    });
                }
                return response.json();
            })
            .then(json => {
                console.log(json);
                handleReset();
            })
            .catch(err => {
                console.error('Error al enviar la solicitud:', err);
                setMsgError(err.message); // Manejar errores de manera adecuada
            });
    };

    const formik = useFormik({
        initialValues,
        onSubmit,
        validate
    })

    const handleReset = () => {
        formik.resetForm();
    }

    useEffect(() => {
        fetch(`${VITE_API_URL}/edificio/`).then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    console.log(t(errorData.error))
                    throw new Error(t(errorData.error));
                });
            }
            return response.json();
        }).then(json => {
            setEdificios(json.edificio)
        })
            .catch(err => {
                console.error('Error al enviar la solicitud:', err);
                setMsgError(err.message); // Manejar errores de manera adecuada
            });
    }, [edificios])


    return (
        <div className="container mx-auto p-8 space-y-4">
            <form onSubmit={formik.handleSubmit} className="space-y-8">
                <div>
                    <label htmlFor="nombre" className="text-gray-600 ">{t('Name')}*</label>
                    <input
                        type="nombre"
                        name="nombre"
                        id="nombre"
                        value={formik.values.nombre}
                        onChange={formik.handleChange}
                        autoComplete="nombre"
                        className={`focus:outline-none block w-full rounded-md border border-gray-200 bg-transparent px-4 py-3 text-gray-600 transition duration-300 invalid:ring-2 invalid:ring-red-400 focus:ring-2 focus:ring-cyan-300 ${formik.errors.nombre && 'ring-2 ring-red-400'}`}
                    />
                    <span className='text-red-500'>{formik.errors.nombre}</span>
                    {!!msgError && (
                        <span className='text-red-500'>{msgError}</span>
                    )}
                </div>
                <div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="direccion" className="text-gray-600 ">{t('Adrress')}*</label>

                    </div>
                    <input
                        type="direccion"
                        name="direccion"
                        id="direccion"
                        value={formik.values.direccion}
                        onChange={formik.handleChange}
                        autoComplete="current-direccion"
                        className={`focus:outline-none block w-full rounded-md border border-gray-200  bg-transparent px-4 py-3 text-gray-600 transition duration-300 invalid:ring-2 invalid:ring-red-400 focus:ring-2 focus:ring-cyan-300 ${formik.errors.direccion && 'ring-2 ring-red-400'}`}
                    />
                    <span className='text-red-500'>{formik.errors.direccion}</span>
                </div>
                <div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="telefono" className="text-gray-600 ">{t('Phone')}*</label>

                    </div>
                    <input
                        type="telefono"
                        name="telefono"
                        id="telefono"
                        value={formik.values.telefono}
                        onChange={formik.handleChange}
                        autoComplete="current-telefono"
                        className={`focus:outline-none block w-full rounded-md border border-gray-200  bg-transparent px-4 py-3 text-gray-600 transition duration-300 invalid:ring-2 invalid:ring-red-400 focus:ring-2 focus:ring-cyan-300 ${formik.errors.telefono && 'ring-2 ring-red-400'}`}
                    />
                    <span className='text-red-500'>{formik.errors.telefono}</span>
                </div>
                <button type="submit" className="bg-secondary text-white hover:text-gray-200 px-4 py-2 rounded-md shadow-md ">Agregar nuevo edificio</button>
            </form>
            <div className=" bg-gray-400 rounded-lg ">
                <h3 className="font-semibold text-base text-center"> Lista de edificios</h3>
                {!!msgError && (
                    <p>{msgError}</p>
                )}
                {
                    edificios.length ? (
                        <ul className="p-2">
                            {edificios.map((edificio, indexEdificio) => (
                                <li key={indexEdificio}>{edificio.nombre} - {edificio.direccion} - {edificio.telefono}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No  hay edificios agragados en base de datos</p>
                    )
                }
            </div>
        </div>
    )
}

export default BuildingsPage