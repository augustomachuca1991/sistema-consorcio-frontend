import LogoEdificio from '/src/assets/images/logos/LogoEdificio.svg';
import { useTranslation } from "react-i18next";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useState,  } from 'react';
import { useFormik } from 'formik';
import { useAuth } from "../auth/AuthProvider";

const { VITE_API_URL } = import.meta.env

const LoginPage = () => {
    const { t, i18n: { changeLanguage, language } } = useTranslation();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
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
        setIsLoading(true)
        setMsgError("")
        try {

            const response = await fetch(`${VITE_API_URL}/api/token/`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username: "admin", password: password })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setMsgError(t('InvalidUser'))
                    throw new Error(`${t('InvalidUser')}`);
                }

                const { detail } = await response.json()
                setMsgError(detail)
                throw new Error(`${detail}`);
            }
            const userData = await response.json();
            saveUser(userData)
            navigate("/dashboard");

        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const formik = useFormik({
        initialValues,
        onSubmit,
        validate
    })


    if (isAuthenticated) {
        return <Navigate to={`${import.meta.env.VITE_BASE_URL}dashboard`} />;
    }




    return (
        <div className="relative py-16">
            <div className="container relative m-auto px-6 text-gray-500 md:px-12 xl:px-40">
                <div className="m-auto space-y-8 md:w-8/12 lg:w-6/12 xl:w-6/12">
                    <Link to={"/"}>
                        <img src={LogoEdificio} loading="lazy" className="ml-4 w-36" alt="Edificios Murano" />
                    </Link>
                    <div className="rounded-3xl border border-gray-100 bg-white   shadow-2xl shadow-gray-600/10 backdrop-blur-2xl">
                        <div className="p-8 py-12 sm:p-16">
                            <h2 className="mb-8 text-2xl font-bold text-gray-800 ">{t('SingInTitleForm')}</h2>
                            <form onSubmit={formik.handleSubmit} className="space-y-8">
                                <div>
                                    <label htmlFor="email" className="text-gray-600 ">{t('Email')}</label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        autoComplete="username"
                                        className={`focus:outline-none block w-full rounded-md border border-gray-200  bg-transparent px-4 py-3 text-gray-600 transition duration-300 invalid:ring-2 invalid:ring-red-400 focus:ring-2 focus:ring-cyan-300 ${formik.errors.email && 'ring-2 ring-red-400'}`}
                                    />
                                    <span className='text-red-500'>{formik.errors.email}</span>
                                    {!!msgError && (
                                        <span className='text-red-500'>{msgError}</span>
                                    )}
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

                                <p className="border-t border-gray-100  pt-6 text-sm text-gray-500">
                                    {t('NoAccount')}
                                    {/* <a href="#" className="text-primary ml-1">{t('SingUp')}</a> */}
                                    <Link to={'register'} className="text-primary ml-1">{t('SingUp')}</Link>
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