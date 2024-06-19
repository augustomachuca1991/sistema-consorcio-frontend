import { useTranslation } from "react-i18next";

import React from 'react'

const LoadingComponent = () => {
    const { t, i18n: { changeLanguage, language } } = useTranslation();

    return (
        <div className='container mx-auto'>
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary">{t('Loading')}</div>
        </div>
    )
}

export default LoadingComponent