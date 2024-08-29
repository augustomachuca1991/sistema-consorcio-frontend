import { useTranslation } from "react-i18next";
import { useAuth } from "../auth/AuthProvider";
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import LayoutsAdminPages from "../layouts/LayoutsAdminPages";
import { ValidateErrorComponent } from "../components/ValidateErrorComponent";


//import DashboardPage from './DashboardPage'; 

const { VITE_API_URL } = import.meta.env


const BuildingsPage = () => {
    const [msgError, setMsgError] = useState("");
    const [edificios, setEdificios] = useState([]);
    const { t } = useTranslation();
    const [selectedEdificio, setSelectedEdificio] = useState(null);
    const [showGuardarCambios, setShowGuardarCambios] = useState(false);//visibilidad del boton
    const [showAgregar, setShowAgregar] = useState(true); //visibilidad del boton
    const { getAccessToken } = useAuth();


    const initialValues = {
        nombre: "",
        direccion: "",
        telefono: ""
    };

    const validate = ({ nombre, direccion, telefono }) => {
        let errors = {};
        if (!nombre) errors.nombre = t('Required', { Field: t('Name') });
        if (!direccion) errors.direccion = t('Required', { Field: t('Adress') });
        if (!telefono) errors.telefono = t('Required', { Field: t('Phone') });
        return errors;
    };

    const formik = useFormik({
        initialValues: selectedEdificio || initialValues,
        validate,
        onSubmit: (values) => {
            if (!formik.errors.nombre && !formik.errors.direccion && !formik.errors.telefono) {
                if (selectedEdificio) {
                    updateEdificio(values); // Si hay un edificio seleccionado, lo actualiza
                } else {
                    storeEdificio(values); // Si no, lo crea
                }
            } else {
                console.log('Formulario no válido:', formik.errors);
            }
        },
    });

    //el Store por separado
    const storeEdificio = ({ nombre, direccion, telefono }) => {
        setMsgError("");
        const params = { nombre, direccion, telefono };

        fetch(`${VITE_API_URL}/edificio/store/`, {
            method: 'POST',
            body: JSON.stringify(params),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        console.log(t(errorData.error));
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
                setMsgError(err.message);
            });
    };

    //el Update por separado
    const updateEdificio = ({ nombre, direccion, telefono }) => {
        setMsgError("");
        const params = { nombre, direccion, telefono };

        if (selectedEdificio && selectedEdificio.id_edificio) {
            fetch(`${VITE_API_URL}/edificio/update/${selectedEdificio.id_edificio}/`, {
                method: 'PUT',
                body: JSON.stringify(params),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(errorData => {
                            console.log(t(errorData.error));
                            throw new Error(t(errorData.error));
                        });
                    }
                    return response.json();
                })
                .then(json => {
                    console.log(json);
                    handleReset();
                    setSelectedEdificio(null);
                    setShowGuardarCambios(false);

                })
                .catch(err => {
                    console.error('Error al enviar la solicitud:', err);
                    setMsgError(err.message);
                });
        } else {
            console.error('No hay un edificio seleccionado o el ID es undefined');
        }
    };

    //delete por separado
    const deleteEdificio = async (id) => {
        if (window.confirm(t(`Are you sure you want to delete this record ID ${id}?`))) {
            try {
                const response = await fetch(`${VITE_API_URL}/edificio/delete/${id}/`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => {
                        return { error: 'Failed to parse error response as JSON' };
                    });
                    console.error('Error:', errorData);
                    setMsgError(errorData.error || 'An unknown error occurred.');
                    return;
                }

                // Solo intentar convertir a JSON si hay contenido en la respuesta
                const result = await response.json().catch(() => {
                    return { message: 'Deleted successfully' }; // Fallback in case of empty response
                });
                console.log('Delete successful:', result.message);
                // Aquí puedes actualizar la UI o mostrar un mensaje de éxito
            } catch (err) {
                console.error('Error al enviar la solicitud:', err);
                setMsgError(err.message);
            }
        }
    };




    //las distintas funciones handle
    const handleReset = () => {
        formik.resetForm();
        setSelectedEdificio(null);
        setShowGuardarCambios(false);
        setShowAgregar(true); // para que este boton este visible siempre al iniciar o resetear

    };

    const handleCreate = () => {
        formik.handleSubmit(); // Esto manejará el envío y la validación
    };

    const handleUpdate = () => {
        formik.handleSubmit(); // Esto también manejará el envío y la validación
    };

    const handleSelectEdificio = (edificio) => {
        setSelectedEdificio(edificio);
        formik.setValues({
            nombre: edificio.nombre,
            direccion: edificio.direccion,
            telefono: edificio.telefono,
        });
        setShowGuardarCambios(true);//visible el boton
        setShowAgregar(false); // Oculta el botón "Agregar nuevo edificio"
    };

    const handleDelete = async (id) => {
        await deleteEdificio(id);
    };

    const handleShow = (edificio) => {
        // Implementa la lógica para mostrar detalles del edificio aquí
    };




    //mostrar la lista de edificios
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
    }, [])


    return (
        <LayoutsAdminPages>
            <div className="container mx-auto p-8 space-y-4 ">

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
                        <ValidateErrorComponent msg={formik.errors.nombre} />
                        <ValidateErrorComponent msg={msgError} />
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
                        <ValidateErrorComponent msg={formik.errors.direccion} />
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
                        <ValidateErrorComponent msg={formik.errors.telefono} />

                    </div>
                    <div className="flex items-center">
                        {showAgregar && (
                            <button type="button" onClick={handleCreate} className="bg-secondary text-white hover:text-gray-200 px-4 py-2 rounded-md shadow-md">Agregar nuevo edificio</button>
                        )}

                        {showGuardarCambios && (
                            < >
                                <button type="button" onClick={handleReset} className="ml-auto bg-white text-gray-500 hover:text-white hover:bg-gray-500 px-4 py-2 rounded-md shadow-md border border-gray-500">{t('Cancel')}</button>
                                <button type="button" onClick={handleUpdate} className="ml-auto bg-green-500 text-white hover:text-gray-200 px-4 py-2 rounded-md shadow-md">{t('Save Change')}</button>
                            </>

                        )}

                    </div>
                </form>

                <div className=" bg-gray-200 rounded-lg">
                    <h3 className="font-semibold text-xl tracking-wider leading-5 text-center py-3"> Lista de edificios</h3>
                    {
                        edificios.length ? (
                            <ul className="p-2 space-y-2">
                                {edificios.map((edificio, indexEdificio) => (
                                    <li key={indexEdificio} className="flex justify-between items-center p-2 bg-white rounded shadow hover:bg-gray-50">
                                        <span>{edificio.nombre} - {edificio.direccion} - {edificio.telefono}</span>
                                        <div className="space-x-2">

                                            <button
                                                onClick={() => handleSelectEdificio(edificio)}
                                                className="bg-transparent text-green-500 hover:bg-green-500 hover:text-white p-2 rounded-full ">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                                </svg>

                                            </button>
                                            <button
                                                onClick={() => handleShow(edificio)}
                                                className="bg-transparent text-purple-500 hover:bg-purple-500 hover:text-white p-2 rounded-full ">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                </svg>

                                            </button>
                                            <button
                                                onClick={() => handleDelete(edificio.id_edificio)}
                                                className="bg-transparent text-red-700 hover:bg-red-700 hover:text-white p-2 rounded-full ">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>

                                            </button>

                                        </div>

                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No  hay edificios agragados en base de datos</p>
                        )
                    }
                </div>
            </div>
        </LayoutsAdminPages>
    )
}

export default BuildingsPage