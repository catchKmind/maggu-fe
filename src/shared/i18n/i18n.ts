import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import commonEn from '../locales/en.json'
import commonKo from '../locales/ko.json'
import mapEn from '../../features/map/locales/en.json'
import mapKo from '../../features/map/locales/ko.json'
import communityEn from '../../features/community/locales/en.json'
import communityKo from '../../features/community/locales/ko.json'
import authEn from '../../features/auth/locales/en.json'
import authKo from '../../features/auth/locales/ko.json'

export type Locale = 'en' | 'ko'

const STORAGE_KEY = 'maggu-locale'

const storedLocale = localStorage.getItem(STORAGE_KEY) as Locale | null

i18n.use(initReactI18next).init({
  resources: {
    en: { common: commonEn, map: mapEn, community: communityEn, auth: authEn },
    ko: { common: commonKo, map: mapKo, community: communityKo, auth: authKo },
  },
  ns: ['common', 'map', 'community', 'auth'],
  defaultNS: 'common',
  // 다른 네임스페이스에서 t()를 불러도 common의 공용 문구(bottomSheet 등)는 찾아지도록
  fallbackNS: 'common',
  lng: storedLocale ?? 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export function setLocale(locale: Locale) {
  localStorage.setItem(STORAGE_KEY, locale)
  i18n.changeLanguage(locale)
}

export default i18n
