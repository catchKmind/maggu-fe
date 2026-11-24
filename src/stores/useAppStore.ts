import { create } from 'zustand'
import { getAuthToken } from '../shared/lib/authToken'

const GUEST_KEY = 'maggu-guest'

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

interface AppState {
  isLoggedIn: boolean
  /** 게스트로 시작한 사용자. 둘러보기만 가능하고 글쓰기·댓글·스크랩 같은 쓰기 요청은 막는다 */
  isGuest: boolean
  /** 게스트가 쓰기 기능을 눌렀을 때 띄우는 안내 팝업 */
  isGuestNoticeOpen: boolean
  setLoggedIn: (v: boolean) => void
  setGuest: (v: boolean) => void
  openGuestNotice: () => void
  closeGuestNotice: () => void
}

export const useAppStore = create<AppState>((set) => ({
  isLoggedIn: !!getAuthToken(),
  isGuest: !!getAuthToken() && readGuest(),
  isGuestNoticeOpen: false,
  // 로그아웃·토큰 만료로 로그인이 풀리면 게스트 표시도 함께 지운다
  setLoggedIn: (v) => {
    if (!v) writeGuest(false)
    set(v ? { isLoggedIn: true } : { isLoggedIn: false, isGuest: false, isGuestNoticeOpen: false })
  },
  setGuest: (v) => {
    writeGuest(v)
    set({ isGuest: v })
  },
  openGuestNotice: () => set({ isGuestNoticeOpen: true }),
  closeGuestNotice: () => set({ isGuestNoticeOpen: false }),
}))
