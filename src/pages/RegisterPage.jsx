import LogoEdificio from '/src/assets/images/logos/LogoEdificio.svg';
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from '../auth/AuthProvider';
import { useFormik } from 'formik';
import { useState } from 'react';
import LogoComponent from '../components/LogoComponent';
import { register } from '../api/registerUserAPI';
import InputComponent from '../components/InputComponent';
import { ValidateErrorComponent } from '../components/ValidateErrorComponent';


const RegisterPages = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [msgError, setMsgError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [msgFetch, setMsgFetch] = useState('')

  const { VITE_API_URL, VITE_BASE_URL } = import.meta.env
  const { isAuthenticated } = useAuth()

  const initialValues = {
    email: '',
    username: "",
    password: '',
    repassword: ''
  }

  const validate = ({ email, username, password, repassword }) => {
    let errors = {}
    if (!email) errors.email = t('Required', { Field: t('Email') });
    if (email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(email)) {
        errors.email = t('ErrorEmail');
      }
    }

    if (!username) errors.username = t('Required', { Field: t('Username') });

    if (!password) errors.password = t('Required', { Field: t('Password') });
    if (!repassword) errors.repassword = t('Required', { Field: t('RePassword') });

    if (password) {
      if (password.length < 8) errors.password = t('ErrorPassword')
    }

    if (repassword && password) {
      if (repassword !== password) errors.repassword = t('ErrorRePassword')
    }


    return errors
  }

  const onSubmit = async (values) => {
    setMsgError("");
    setIsLoading(true)

    try {
      const { message, user } = await register(values);
      setMsgFetch(t(message))
    } catch (error) {
      setMsgError(error.message);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
          {!!msgFetch && (<p className=' flex flex-row text-green-500 text-base text-nowrap leading-5 p-2'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            {msgFetch}
          </p>)}

          <div className="rounded-3xl border border-gray-100 bg-white  shadow-2xl shadow-gray-600/10 backdrop-blur-2xl">


            <div className="p-8 py-12 sm:p-16">
              <h2 className="mb-8 text-2xl font-bold text-gray-800 ">{t('SingUpTitleForm')}</h2>
              <form onSubmit={formik.handleSubmit} className="space-y-8">
                <div>
                  <InputComponent name={'email'} type={'email'} value={formik.values.email} onChange={formik.handleChange} msgError={formik.errors.email} />
                  <ValidateErrorComponent msg={formik.errors.email} />
                  <ValidateErrorComponent msg={msgError} />
                </div>
                <div>
                  <InputComponent name={'username'} type={'text'} value={formik.values.username} onChange={formik.handleChange} msgError={formik.errors.username} />
                  <ValidateErrorComponent msg={formik.errors.username} />
                </div>

                <div>
                  <InputComponent name={'password'} type={'password'} value={formik.values.password} onChange={formik.handleChange} msgError={formik.errors.password} />
                  <ValidateErrorComponent msg={formik.errors.password} />
                </div>
                <div>
                  <InputComponent name={'repassword'} type={'password'} value={formik.values.repassword} onChange={formik.handleChange} msgError={formik.errors.repassword} />
                  <ValidateErrorComponent msg={formik.errors.repassword} />
                </div>

                <button type="submit" className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95" disabled={isLoading}>
                  <span className="relative text-base font-semibold text-white ">{isLoading ? 'loading...' : t('SingUp')}</span>
                </button>
                <p className="border-t border-gray-100  pt-6 text-sm text-gray-400 ">
                  todo los campos (*) son obligatorios
                </p>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPages