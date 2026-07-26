import { create } from 'zustand'

/**
 * 전역 상태 예시 (Zustand). 필요에 맞게 수정해서 사용.
 */
interface AppState {
  isLoggedIn: boolean
  setLoggedIn: (v: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  isLoggedIn: false,
  setLoggedIn: (v) => set({ isLoggedIn: v }),
}))
