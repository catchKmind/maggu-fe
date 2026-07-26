/**
 * 스토리지 래퍼.
 * 지금은 localStorage, 앱 전환 시 이 파일만 Capacitor Preferences로 교체하면 된다.
 * (@capacitor/preferences 설치 후 구현부만 갈아끼우기)
 */
export const storage = {
  async get(key: string): Promise<string | null> {
    return localStorage.getItem(key)
  },
  async set(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value)
  },
  async remove(key: string): Promise<void> {
    localStorage.removeItem(key)
  },
}
