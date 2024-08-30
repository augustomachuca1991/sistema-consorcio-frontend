import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';

import LayoutsAdminPages from "../layouts/LayoutsAdminPages";
import { useFormik } from 'formik';
import { ValidateErrorComponent } from '../components/ValidateErrorComponent';
import InputComponent from '../components/InputComponent';
import { getAll } from "../api/buildingApi"




function InmueblesPages() {
    const [edificios, setEdificios] = useState([])
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

    const onSubmit = async (values) => {
        console.log(values.edificio)
        console.log(values.porcentaje)
        console.log(values.ubicacion)
    };

    const handleCreate = () => {
        formik.handleSubmit(); // Esto manejará el envío y la validación
    };

    const formik = useFormik({
        initialValues,
        onSubmit,
        validate
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { edificio } = await getAll();
                setEdificios(edificio);
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
                        <label htmlFor="edificios" className="text-gray-600">{t('edificios')}</label>
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

                        <button type="button" onClick={handleCreate} className="bg-secondary text-white hover:text-gray-200 px-4 py-2 rounded-md shadow-md">Agregar nuevo inmueble</button>

                    </div>
                </form>
            </div>

        </LayoutsAdminPages>
    )



}


export default InmueblesPages