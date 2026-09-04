interface AvatarProps {
  name: string
  avatarUrl?: string
  size?: number
  className?: string
}

/**
 * 실제 API 데이터엔 프로필 이미지 필드가 없어서(AppUser/MyAccountResponse 둘 다 없음),
 * avatarUrl이 없으면 이름 첫 글자로 대체 아바타를 그림.
 */
export function Avatar({ name, avatarUrl, size = 32, className = '' }: AvatarProps) {
  const dimension = `${size}px`

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt=""
        className={`rounded-full object-cover ${className}`}
        style={{ width: dimension, height: dimension }}
      />
    )
  }

  const initial = name.trim().charAt(0).toUpperCase() || '?'

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-purple-100 font-semibold text-purple-500 ${className}`}
      style={{ width: dimension, height: dimension, fontSize: size * 0.42 }}
    >
      {initial}
    </span>
  )
}
