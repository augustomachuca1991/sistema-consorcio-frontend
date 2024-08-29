import { useTranslation } from 'react-i18next';
import React from 'react';

import LayoutsAdminPages from "../layouts/LayoutsAdminPages";
import { useFormik } from 'formik';
import { ValidateErrorComponent } from '../components/ValidateErrorComponent';
import InputComponent from '../components/InputComponent';

const EDIFICIOS = [

    {
        id_edificio: '1',
        nombre: 'edificio 1',
        direccion: 'direccion 1',
        telefono: 'telefono 1',
        created_at: '',
    },
    {
        id_edificio: '2',
        nombre: 'edificio 2',
        direccion: 'direccion 2',
        telefono: 'telefono 2',
        created_at: '',
    },
    {
        id_edificio: '3',
        nombre: 'edificio 3',
        direccion: 'direccion 3',
        telefono: 'telefono 3',
        created_at: '',
    },
    {
        id_edificio: '4',
        nombre: 'edificio 4',
        direccion: 'direccion 4',
        telefono: 'telefono 4',
        created_at: '',
    },
]

function InmueblesPages() {

    const { t } = useTranslation();
    const initialValues = {
        ubicacion: '',
        porcentaje: 0
    }

    const validate = ({ ubicacion, porcentaje }) => {
        let errors = {}

        if (!ubicacion) errors.ubicacion = t('Required', { Field: t('Location') })
        if (!porcentaje) errors.porcentaje = t('Required', { Field: t('Percentage') })
        return errors
    }

    const onSubmit = async (values) => {
        console.log('click en submit')
    };

    const formik = useFormik({
        initialValues,
        onSubmit,
        validate
    })
    return (
        <LayoutsAdminPages>

            <div className="container mx-auto p-8 space-y-4 ">

                <form onSubmit={formik.handleSubmit} className="space-y-8">
                    <div>
                        <label htmlFor="edificios" className="text-gray-600">{t('edificios')}</label>
                        <select

                            className={`focus:outline-none block w-full rounded-md border border-gray-200  bg-transparent px-4 py-3 text-gray-600 transition duration-300 invalid:ring-2 invalid:ring-red-400 focus:ring-2 focus:ring-cyan-300 capitalize ${formik.errors.email && 'ring-2 ring-red-400'}`}
                        >
                            {EDIFICIOS.map((edificio, indexEdificio) => (
                                <option key={indexEdificio} value={edificio.id_edificio}>{edificio.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <InputComponent type={'text'} name={'ubicacion'} value={formik.values.ubicacion} onChange={formik.handleChange} msgError={formik.errors.ubicacion} />
                        <ValidateErrorComponent msg={formik.errors.ubicacion} />
                    </div>
                    <div>
                        <InputComponent type={'number'} name={'porcentaje(%)'} value={formik.values.porcentaje} onChange={formik.handleChange} msgError={formik.errors.porcentaje} />
                        <ValidateErrorComponent msg={formik.errors.porcentaje} />
                    </div>
                </form>
            </div>

        </LayoutsAdminPages>
    )



}


export default InmueblesPages