
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth/AuthProvider";
import { login } from "../api/loginUserAPI"
import { useState, } from 'react';
import { useFormik } from 'formik';
import LogoComponent from "../components/LogoComponent";
import InputComponent from "../components/InputComponent";
import { ValidateErrorComponent } from "../components/ValidateErrorComponent";

const { VITE_BASE_URL } = import.meta.env

const LoginPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [msgError, setMsgError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { saveUser, isAuthenticated } = useAuth();


    const initialValues = {
        email: '',
        password: '',
    }

    const validate = ({ email, password }) => {
        let errors = {}
        if (!email) errors.email = t('Required', { Field: t('Email') });
        if (email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regex.test(email)) {
                errors.email = t('ErrorEmail');
            }
        }

        if (!password) errors.password = t('Required', { Field: t('Password') });
        if (password) {
            if (password.length < 8) {
                errors.password = t('ErrorPassword')
            }
        }
        return errors
    }

    const onSubmit = async ({ email, password }) => {
        setIsLoading(true);
        setMsgError('');
        try {
            const userData = await login(email, password);
            saveUser(userData);
            navigate(`${VITE_BASE_URL}dashboard`);
        } catch (error) {
            setMsgError(error.message);
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const formik = useFormik({
        initialValues,
        onSubmit,
        validate
    })


    if (isAuthenticated) {
        return <Navigate to={`${VITE_BASE_URL}dashboard`} />;
    }

    return (
        <div className="relative py-16">
            <div className="container relative m-auto px-6 text-gray-500 md:px-12 xl:px-40">
                <div className="m-auto space-y-8 md:w-8/12 lg:w-6/12 xl:w-6/12">
                    <LogoComponent />
                    <div className="rounded-3xl border border-gray-100 bg-white   shadow-2xl shadow-gray-600/10 backdrop-blur-2xl">
                        <div className="p-8 py-12 sm:p-16">
                            <h2 className="mb-8 text-2xl font-bold text-gray-800 capitalize-first-letter">{t('SingInTitleForm')}</h2>
                            <form onSubmit={formik.handleSubmit} className="space-y-8">
                                <div>
                                    <InputComponent name={'email'} type={'email'} value={formik.values.email} onChange={formik.handleChange} msgError={formik.errors.email}/>
                                    <ValidateErrorComponent msg={formik.errors.email}/>
                                    <ValidateErrorComponent msg={msgError}/>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="password" className="text-gray-600 ">{t('Password')}</label>
                                        <button className="-mr-2 p-2" type="reset">
                                            <span className="text-sm text-primary">{t('ForgotPassword')}</span>
                                        </button>
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        autoComplete="current-password"
                                        className={`focus:outline-none block w-full rounded-md border border-gray-200  bg-transparent px-4 py-3 text-gray-600 transition duration-300 invalid:ring-2 invalid:ring-red-400 focus:ring-2 focus:ring-cyan-300 ${formik.errors.password && 'ring-2 ring-red-400'}`}
                                    />
                                    <span className='text-red-500'>{formik.errors.password}</span>
                                </div>

                                <button type="submit" disabled={isLoading} className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95">
                                    {isLoading ?
                                        (<span className="relative text-base font-semibold text-white">Loading...</span>) : (<span className="relative text-base font-semibold text-white">{t('SingIn')}</span>)
                                    }

                                </button>

                                <p className="border-t border-gray-100  pt-6 text-sm text-gray-500 capitalize-first-letter">
                                    {t('NoAccount')}
                                    {/* <a href="#" className="text-primary ml-1">{t('SingUp')}</a> */}
                                    <Link to={'register'} className="text-primary ml-1 uppercase">{t('SingUp')}</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default LoginPage