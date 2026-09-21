import { create } from 'zustand'
import { getAuthToken } from '../shared/lib/authToken'

interface AppState {
  isLoggedIn: boolean
  setLoggedIn: (v: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  isLoggedIn: !!getAuthToken(),
  setLoggedIn: (v) => set({ isLoggedIn: v }),
}))
