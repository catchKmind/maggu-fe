/** 리스트(장소 폴더) 기본 아이콘 후보. 아이콘은 이모지 문자열 또는 내 스티커 이미지 URL로 저장된다. */
export const DEFAULT_FOLDER_ICON = '📍'
export const FOLDER_ICON_OPTIONS = ['📍', '❤️', '⭐️', '🌸', '🍜', '☕️', '🏖️', '🎡', '🐶', '🐱', '🎵', '🏔️', '🍔', '🌙', '🔥', '💜']

export function isImageIcon(icon: string) {
  return /^(https?:|blob:|data:|\/)/.test(icon)
}
