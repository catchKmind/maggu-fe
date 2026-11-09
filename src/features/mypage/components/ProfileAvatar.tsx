import silhouetteIcon from '../../../assets/mypage/icon_profile_silhouette.svg'

interface ProfileAvatarProps {
  size?: number
  /** 프로필 사진. 없으면 기본 실루엣 */
  src?: string | null
}

/**
 * 프로필 이미지 (Figma: mypage/avatar - default).
 * 계정 API에 프로필 사진 필드가 아직 없어서 메인에서는 항상 기본 실루엣을 보여준다.
 */
export function ProfileAvatar({ size = 42, src }: ProfileAvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt=""
        className="shrink-0 rounded-full border-[0.5px] border-gray-400 object-cover"
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-full border-[0.5px] border-gray-400 bg-gray-200"
      style={{ width: size, height: size }}
    >
      <img
        src={silhouetteIcon}
        alt=""
        className="absolute"
        // Figma 기준(42px 원 안에 28.64px 실루엣, 위로 9.27px)을 크기에 비례해 적용
        style={{
          width: size * (28.6364 / 42),
          height: size * (28.6364 / 42),
          left: '50%',
          top: size * (9.27 / 42),
          transform: 'translateX(-50%)',
        }}
      />
    </div>
  )
}
