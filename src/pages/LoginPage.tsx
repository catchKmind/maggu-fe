import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAppleLogin } from '../features/auth/hooks/useAppleLogin'
import { loadAppleSdk } from '../shared/lib/appleSignIn'
import bgImage from '../assets/main/img_bgd.png'

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 384 512" fill="currentColor" aria-hidden="true">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z"
      />
    </svg>
  )
}

interface LoginPageProps {
  onAppleLogin?: () => void
  onGoogleLogin?: () => void
  onGuestLogin?: () => void
}

export default function LoginPage({ onAppleLogin, onGoogleLogin, onGuestLogin }: LoginPageProps) {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const appleLogin = useAppleLogin()

  // 이 페이지가 Apple 로그인 팝업의 리다이렉트 대상으로 열렸을 수도 있어서,
  // 버튼을 누르기 전에도 SDK가 미리 로드되어 있어야 팝업 쪽에서 핸드셰이크가 끝남.
  useEffect(() => {
    loadAppleSdk().catch(() => {
      // 팝업이 아닌 일반 방문인데 스크립트 로드가 실패해도 페이지 자체는 정상 동작해야 하므로 무시
    })
  }, [])

  const handleAppleLogin = () => {
    appleLogin.mutate(undefined, {
      onSuccess: () => {
        onAppleLogin?.()
        navigate('/')
      },
    })
  }

  return (
    <div
      className="relative flex flex-1 flex-col items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="flex flex-1 flex-col items-center justify-center">
        <h1 className="text-40 font-bold text-gray-900">{t('title')}</h1>
      </div>

      <div className="flex w-full flex-col gap-3 px-6 pb-[calc(var(--safe-bottom)+32px)]">
        {appleLogin.isError && <p className="text-center text-13 text-red-500">{t('appleLoginError')}</p>}
        <button
          type="button"
          onClick={handleAppleLogin}
          disabled={appleLogin.isPending}
          className="flex h-14 items-center justify-center gap-2 rounded-full bg-gray-1000 text-16 font-semibold text-white disabled:opacity-60"
        >
          <AppleIcon />
          {appleLogin.isPending ? t('signingIn') : t('appleLogin')}
        </button>
        <button
          type="button"
          onClick={onGoogleLogin}
          className="flex h-14 items-center justify-center gap-2 rounded-full bg-gray-50 text-16 font-semibold text-gray-900"
        >
          <GoogleIcon />
          {t('googleLogin')}
        </button>
        <button
          type="button"
          onClick={onGuestLogin}
          className="flex h-14 items-center justify-center rounded-full bg-white text-16 font-bold text-gray-900"
        >
          {t('guestLogin')}
        </button>
      </div>
    </div>
  )
}
