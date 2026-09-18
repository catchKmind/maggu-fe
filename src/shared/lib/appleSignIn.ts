/**
 * Apple Sign-In JS SDK 래퍼 (웹 전용, 팝업 플로우).
 * 네이티브 앱(Capacitor)으로 갈 땐 @capacitor-community/apple-sign-in 같은
 * 네이티브 플러그인으로 교체 필요 — 이 파일은 웹 배포 전용.
 *
 * 필요한 사전 설정 (Apple Developer 계정에서, 코드로는 할 수 없음):
 * 1. Services ID 생성 + "Sign in with Apple" 활성화
 * 2. 해당 Services ID에 배포 도메인 등록 + Return URL을 VITE_APPLE_REDIRECT_URI와 동일하게 등록
 * 3. 도메인 소유 확인용 파일을 Apple이 주는 그대로 `/.well-known/apple-developer-domain-association.txt`에 배치
 */

export interface AppleSignInResult {
  identityToken: string
  authorizationCode: string
  fullName?: string
}

interface AppleAuthorizationResponse {
  authorization: {
    code: string
    id_token: string
    state?: string
  }
  user?: {
    email?: string
    name?: {
      firstName?: string
      lastName?: string
    }
  }
}

interface AppleIDSignInApi {
  auth: {
    init(config: {
      clientId: string
      scope?: string
      redirectURI: string
      usePopup?: boolean
      state?: string
      nonce?: string
    }): void
    signIn(): Promise<AppleAuthorizationResponse>
  }
}

declare global {
  interface Window {
    AppleID?: AppleIDSignInApi
  }
}

const SDK_URL = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js'

let sdkLoadPromise: Promise<void> | null = null

function loadAppleSdk(): Promise<void> {
  if (window.AppleID) return Promise.resolve()
  if (sdkLoadPromise) return sdkLoadPromise

  sdkLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SDK_URL
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Apple Sign-In SDK를 불러오지 못했습니다'))
    document.head.appendChild(script)
  })
  return sdkLoadPromise
}

export async function signInWithApple(): Promise<AppleSignInResult> {
  const clientId = import.meta.env.VITE_APPLE_CLIENT_ID
  const redirectURI = import.meta.env.VITE_APPLE_REDIRECT_URI
  if (!clientId || !redirectURI) {
    throw new Error('VITE_APPLE_CLIENT_ID / VITE_APPLE_REDIRECT_URI가 설정되지 않았습니다')
  }

  await loadAppleSdk()
  if (!window.AppleID) throw new Error('Apple Sign-In SDK 로드 실패')

  window.AppleID.auth.init({
    clientId,
    scope: 'name email',
    redirectURI,
    usePopup: true,
  })

  const response = await window.AppleID.auth.signIn()
  const { firstName, lastName } = response.user?.name ?? {}
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || undefined

  return {
    identityToken: response.authorization.id_token,
    authorizationCode: response.authorization.code,
    fullName,
  }
}
