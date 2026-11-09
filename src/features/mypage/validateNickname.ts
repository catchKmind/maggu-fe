export const NICKNAME_MIN_LENGTH = 2
export const NICKNAME_MAX_LENGTH = 15

/** duplicated / forbidden 은 서버 응답으로만 알 수 있다 */
export type NicknameError = 'tooShort' | 'tooLong' | 'invalidCharacter' | 'duplicated' | 'forbidden'

// 한글·영문·숫자·공백·밑줄만 허용 (기본 닉네임 "느긋한 나그네_0824" 형식)
const ALLOWED_PATTERN = /^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9_ ]+$/

/**
 * 클라이언트에서 확인할 수 있는 규칙만 검사한다.
 * 중복 닉네임 / 금칙어는 서버 응답으로만 알 수 있다.
 */
export function validateNickname(value: string): NicknameError | null {
  const nickname = value.trim()
  if (nickname.length < NICKNAME_MIN_LENGTH) return 'tooShort'
  if (nickname.length > NICKNAME_MAX_LENGTH) return 'tooLong'
  if (!ALLOWED_PATTERN.test(nickname)) return 'invalidCharacter'
  return null
}
