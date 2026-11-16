import { ProfileAvatar } from '../../features/mypage/components/ProfileAvatar'

interface AvatarProps {
  name: string
  avatarUrl?: string
  size?: number
}

/**
 * 프로필 이미지. 프로필 사진이 없으면 마이페이지와 같은 기본 이미지(실루엣)를 보여준다.
 * (실제 API 데이터엔 프로필 이미지 필드가 아직 없어서 대부분 기본 이미지로 나온다)
 */
export function Avatar({ avatarUrl, size = 32 }: AvatarProps) {
  return <ProfileAvatar size={size} src={avatarUrl} />
}
