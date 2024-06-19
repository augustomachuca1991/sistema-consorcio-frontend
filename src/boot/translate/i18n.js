import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next"; 
import enJSON from '../../locale/en.json'
import esJSON from '../../locale/es.json'

i18n.use(initReactI18next).init({
    resources: {
        en: { ...enJSON },
        es: { ...esJSON }, 
    }, // Where we're gonna put translations' files
    lng: import.meta.env.VITE_APP_LANGUAGE || 'es',     // Set the initial language of the App
});