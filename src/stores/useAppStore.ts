import { create } from 'zustand'
import { clearAuthToken, getAuthToken, setAuthToken } from '../shared/lib/authToken'

const GUEST_KEY = 'maggu-guest'

/**
 * 회원 상태.
 * - anonymous: 토큰 없음(로그인 전·로그아웃·토큰 만료)
 * - guest: "게스트로 시작하기"로 들어온 사용자. 둘러보기만 가능하고 쓰기 요청은 막는다
 * - member: 애플 등 실제 계정으로 로그인한 사용자
 */
export type AuthStatus = 'anonymous' | 'guest' | 'member'

function readGuest(): boolean {
  try {
    return localStorage.getItem(GUEST_KEY) === '1'
  } catch {
    return false
  }
}

function writeGuest(isGuest: boolean) {
  try {
    if (isGuest) localStorage.setItem(GUEST_KEY, '1')
    else localStorage.removeItem(GUEST_KEY)
  } catch {
    // 저장소를 못 쓰는 환경이면 이번 실행 동안만 게스트로 취급한다
  }
}

/** 새로고침 시 저장된 토큰·게스트 표시로 상태를 복원한다 */
function readInitialStatus(): AuthStatus {
  if (!getAuthToken()) return 'anonymous'
  return readGuest() ? 'guest' : 'member'
}

interface AppState {
  status: AuthStatus
  /** 게스트가 쓰기 기능을 눌렀을 때 띄우는 안내 팝업 */
  isGuestNoticeOpen: boolean
  /** 토큰 저장과 상태 전환을 한 번에 처리한다. 로그인 성공 시 이것만 호출하면 된다 */
  signIn: (accessToken: string, as: Exclude<AuthStatus, 'anonymous'>) => void
  /** 토큰·게스트 표시를 지우고 anonymous로 되돌린다 (로그아웃·탈퇴·토큰 만료 공통) */
  signOut: () => void
  openGuestNotice: () => void
  closeGuestNotice: () => void
}

export const useAppStore = create<AppState>((set) => ({
  status: readInitialStatus(),
  isGuestNoticeOpen: false,
  signIn: (accessToken, as) => {
    setAuthToken(accessToken)
    writeGuest(as === 'guest')
    set({ status: as })
  },
  signOut: () => {
    clearAuthToken()
    writeGuest(false)
    set({ status: 'anonymous', isGuestNoticeOpen: false })
  },
  openGuestNotice: () => set({ isGuestNoticeOpen: true }),
  closeGuestNotice: () => set({ isGuestNoticeOpen: false }),
}))

export const selectIsLoggedIn = (s: AppState) => s.status !== 'anonymous'
export const selectIsGuest = (s: AppState) => s.status === 'guest'
