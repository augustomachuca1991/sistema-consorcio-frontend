import LogoEdificio from '/src/assets/images/logos/LogoEdificio.svg';
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';

const RegisterPages = () => {
  const { t, i18n: { changeLanguage, language } } = useTranslation();
  const [msgError, setMsgError] = useState('')
  const { VITE_BASE_URL } = import.meta.env

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
    };

    if (!username) errors.username = t('Required', { Field: t('Username') });

    if (!password) errors.password = t('Required', { Field: t('Password') });
    if (!repassword) errors.repassword = t('Required', { Field: t('RePassword') });

    if (password) {
      if (password.length < 8) {
        errors.password = t('ErrorPassword')
      }
    };

    if (repassword && password) {
      if (repassword !== password) {
        errors.repassword = t('ErrorRePassword')
      }
    };


    return errors
  }

  const onSubmit = ({ username, email, password }) => {
    setMsgError("");

    const params = {
      username,
      email,
      password
    };

    fetch(`${VITE_BASE_URL}/users/store/`, {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
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
  return (
    <div className="relative py-16">
      <div className="container relative m-auto px-6 text-gray-500 md:px-12 xl:px-40">
        <div className="m-auto space-y-8 md:w-8/12 lg:w-6/12 xl:w-6/12">
          <Link to={"/"}>
            <img src={LogoEdificio} loading="lazy" className="ml-4 w-36" alt="Edificios Murano" />
          </Link>
          <div className="rounded-3xl border border-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-2xl shadow-gray-600/10 backdrop-blur-2xl">
            <div className="p-8 py-12 sm:p-16">
              <h2 className="mb-8 text-2xl font-bold text-gray-800 dark:text-white">{t('SingUpTitleForm')}</h2>
              <form onSubmit={formik.handleSubmit} className="space-y-8">
                <div>
                  <label htmlFor="email" className="text-gray-600 dark:text-gray-300">{t('Email')}*</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    autoComplete="username"
                    className={`focus:outline-none block w-full rounded-md border border-gray-200 dark:border-gray-600 bg-transparent px-4 py-3 text-gray-600 transition duration-300 invalid:ring-2 invalid:ring-red-400 focus:ring-2 focus:ring-cyan-300 ${formik.errors.email && 'ring-2 ring-red-400'}`}
                  />
                  <span className='text-red-500'>{formik.errors.email}</span>
                  {!!msgError && (
                    <span className='text-red-500'>{msgError}</span>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="username" className="text-gray-600 dark:text-gray-300">{t('Username')}*</label>

                  </div>
                  <input
                    type="username"
                    name="username"
                    id="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    autoComplete="current-username"
                    className={`focus:outline-none block w-full rounded-md border border-gray-200 dark:border-gray-600 bg-transparent px-4 py-3 text-gray-600 transition duration-300 invalid:ring-2 invalid:ring-red-400 focus:ring-2 focus:ring-cyan-300 ${formik.errors.username && 'ring-2 ring-red-400'}`}
                  />
                  <span className='text-red-500'>{formik.errors.username}</span>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-gray-600 dark:text-gray-300">{t('Password')}*</label>

                  </div>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    autoComplete="current-password"
                    className={`focus:outline-none block w-full rounded-md border border-gray-200 dark:border-gray-600 bg-transparent px-4 py-3 text-gray-600 transition duration-300 invalid:ring-2 invalid:ring-red-400 focus:ring-2 focus:ring-cyan-300 ${formik.errors.password && 'ring-2 ring-red-400'}`}
                  />
                  <span className='text-red-500'>{formik.errors.password}</span>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="repassword" className="text-gray-600 dark:text-gray-300">{t('RePassword')}*</label>

                  </div>
                  <input
                    type="repassword"
                    name="repassword"
                    id="repassword"
                    value={formik.values.repassword}
                    onChange={formik.handleChange}
                    autoComplete="current-repassword"
                    className={`focus:outline-none block w-full rounded-md border border-gray-200 dark:border-gray-600 bg-transparent px-4 py-3 text-gray-600 transition duration-300 invalid:ring-2 invalid:ring-red-400 focus:ring-2 focus:ring-cyan-300 ${formik.errors.repassword && 'ring-2 ring-red-400'}`}
                  />
                  <span className='text-red-500'>{formik.errors.repassword}</span>
                </div>

                <button type="submit" className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95">
                  <span className="relative text-base font-semibold text-white dark:text-dark">{t('SingUp')}</span>
                </button>
                <p className="border-t border-gray-100 dark:border-gray-700 pt-6 text-sm text-gray-400 dark:text-gray-400">
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