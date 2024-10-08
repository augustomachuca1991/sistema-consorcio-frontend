import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';

import LayoutsAdminPages from "../layouts/LayoutsAdminPages";
import { useFormik } from 'formik';
import { ValidateErrorComponent } from '../components/ValidateErrorComponent';
import InputComponent from '../components/InputComponent';
import { getAll } from "../api/buildingApi";
import { getAllInmuebles, store, update, remove } from "../api/inmuebleApi";// se importa metodos de inmuebleApi
import ModalComponent from "../components/ModalComponent";




function InmueblesPages() {
    const [edificios, setEdificios] = useState([]);
    const [inmuebles, setInmuebles] = useState([]); // Nuevo estado para inmuebles
    const [selectedInmueble, setSelectedInmueble] = useState(null); // Agregar este estado
    const [editMode, setEditMode] = useState(false); // Agregar este estado
    const [isLoading, setIsLoading] = useState(false);
    const [isShow, setIsShow] = useState(false);
    const { t } = useTranslation();
    const initialValues = {
        edificio: '',
        ubicacion: '',
        porcentaje: 10
    }

    const validate = ({ ubicacion, porcentaje, edificio }) => {
        let errors = {}
        if (!edificio) errors.edificio = t('Required', { Field: t('Building') })
        if (!ubicacion) errors.ubicacion = t('Required', { Field: t('Location') })
        if (!porcentaje) errors.porcentaje = t('Required', { Field: t('Percentage') })
        return errors
    }
    //cuando presiono el boton Editar del registro y rellena el formulario con los datos del reg:
    const handleSelectInmueble = (inmueble) => {
        setSelectedInmueble(inmueble);
        formik.setValues({
            edificio: inmueble.id_edificio_id,
            ubicacion: inmueble.ubicacion,
            porcentaje: inmueble.porcentaje,
        });
        setEditMode(true)
    };

    //para refrescar
    const handleReset = () => {
        formik.resetForm(); 
        setSelectedInmueble(null);
        setEditMode(false)

    };
    //cuando presiono el boton eliminar de un registro
    const handleDelete = async (id) => {
        if (window.confirm(t(`Are you sure you want to delete this record ID ${id}?`))) {
            try {
                const { message } = await remove(id)
                console.log(message)
                // Actualizar la lista de inmuebles después de eliminar un registro
                const { inmueble } = await getAllInmuebles();
                setInmuebles(inmueble);
            } catch (error) {
                console.log(error.message)
            }
        }
    };

    //cuando envio una orden desde el formulario
    const onSubmit = async (values, { resetForm }) => {
        try {

            if (editMode) {
                if (!selectedInmueble?.id_inmueble) {
                    throw new Error("no hay Inmjueble seleccionado");
                }
                await update(selectedInmueble.id_inmueble, values)
                setEditMode(false)
            } else {
                // Guardar el nuevo inmueble
                await store({
                    id_edificio: values.edificio,
                    ubicacion: values.ubicacion,
                    porcentaje: values.porcentaje,
                });
            }

            // Actualiza la lista de inmuebles
            const { inmueble } = await getAllInmuebles();
            setInmuebles(inmueble);

            // Resetea el formulario y el estado de edición
            resetForm();
            setEditMode(false);
            setSelectedInmueble(null);

        } catch (error) {
            console.error('Error al guardar el inmueble:', error);
        }
    };
   


    const formik = useFormik({
        initialValues,
        onSubmit,
        validate
    })

    const handleShow = (inmueble) => {
        setSelectedInmueble(inmueble);
        setIsShow(true)
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { edificio } = await getAll();
                setEdificios(edificio);

                const { inmueble } = await getAllInmuebles(); // Obtenemos los inmuebles
                console.log(inmueble); // Inspecciona la estructura de los datos
                setInmuebles(inmueble); // Guardamos los inmuebles en el estado

            } catch (error) {
                setMsgError(error.message)
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [])

    return (
        <LayoutsAdminPages>

            <div className="container mx-auto p-8 space-y-4 ">

                <form onSubmit={formik.handleSubmit} className="space-y-8">
                    <div>
                        <label htmlFor="inmuebles" className="text-gray-600">{t('edificio')}</label>
                        <select
                            name="edificio"
                            value={formik.values.edificio}
                            onChange={formik.handleChange}
                            className={`focus:outline-none block w-full rounded-md border border-gray-200  bg-transparent px-4 py-3 text-gray-600 transition duration-300 invalid:ring-2 invalid:ring-red-400 focus:ring-2 focus:ring-cyan-300 capitalize ${formik.errors.edificio && 'ring-2 ring-red-400'}`}
                        >
                            <option value="" label="Selecciona un edificio" />
                            {edificios.map((edificio, indexEdificio) => (
                                <option key={indexEdificio} value={edificio.id_edificio}>{edificio.nombre}</option>
                            ))}
                        </select>
                        <ValidateErrorComponent msg={formik.errors.edificio} />
                    </div>
                    <div>
                        <InputComponent type={'text'} name={'ubicacion'} value={formik.values.ubicacion} onChange={formik.handleChange} msgError={formik.errors.ubicacion} />
                        <ValidateErrorComponent msg={formik.errors.ubicacion} />
                    </div>
                    <div>
                        <InputComponent type={'number'} name={'porcentaje(%)'} value={formik.values.porcentaje} onChange={formik.handleChange} msgError={formik.errors.porcentaje} />
                        <ValidateErrorComponent msg={formik.errors.porcentaje} />
                    </div>
                    <div className="flex items-center">

                        {editMode ? (
                            <>
                                <button type="button" onClick={handleReset} className="ml-auto bg-white text-gray-500 hover:text-white hover:bg-gray-500 px-4 py-2 rounded-md shadow-md border border-gray-500">{t('Cancel')}</button>
                                <button type="submit" className="ml-auto bg-green-500 text-white hover:text-gray-200 px-4 py-2 rounded-md shadow-md">{t('Save Change')}</button>
                            </>) :
                            (<button type="submit" className="bg-secondary text-white hover:text-gray-200 px-4 py-2 rounded-md shadow-md">{isLoading ? 'loading...' : 'Agregar nuevo inmueble'}</button>)
                        }



                    </div>

                </form>





                {/* Aquí comienza la lista de inmuebles */}
                <div className="bg-gray-200 rounded-lg">
                    <h3 className="font-semibold text-xl tracking-wider leading-5 text-center py-3">Lista de Inmuebles</h3>
                    {
                        inmuebles.length ? (
                            <ul className="p-2 space-y-2">
                                {inmuebles.map((inmueble, indexInmueble) => {
                                    const edificioNombre = edificios.find(e => e.id_edificio === inmueble.id_edificio_id)?.nombre || 'Edificio desconocido';
                                    return (
                                        <li key={indexInmueble} className="flex justify-between items-center p-2 bg-white rounded shadow hover:bg-gray-50">
                                            <span>{inmueble.ubicacion} - Tasa correspndiente: {inmueble.porcentaje}% - Edificio  {edificioNombre}</span>
                                            <div className="space-x-2">
                                                <button
                                                    onClick={() => handleSelectInmueble(inmueble)}
                                                    className="bg-transparent text-green-500 hover:bg-green-500 hover:text-white p-2 rounded-full ">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                                    </svg>

                                                </button>
                                                <button
                                                    onClick={() => handleShow(inmueble)}
                                                    className="bg-transparent text-purple-500 hover:bg-purple-500 hover:text-white p-2 rounded-full ">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                    </svg>

                                                </button>
                                                <button
                                                    onClick={() => handleDelete(inmueble.id_inmueble)}
                                                    className="bg-transparent text-red-700 hover:bg-red-700 hover:text-white p-2 rounded-full ">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>

                                                </button>

                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p className="p-3">No hay inmuebles agregados en la base de datos</p>
                        )
                    }

                </div>
            </div>
            <ModalComponent stateModal={isShow}>
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                        <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10`}>
                            <svg
                                className={`h-6 w-6 text-red-600`}
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                />
                            </svg>
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                            <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">
                                Deactivate account
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                        type="button"
                        className={`inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto`}
                    >
                        Deactivate
                    </button>
                    <button
                        type="button"
                        onClick={() => { setIsShow(false) }}
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    >
                        Cancel
                    </button>
                </div>
            </ModalComponent>
        </LayoutsAdminPages>
    )



}


export default InmueblesPages